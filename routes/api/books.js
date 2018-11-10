const express = require('express');
const router = express.Router();
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;
const passport = require('passport');
const imgur = require('imgur-node-api');

// load input validation
const isEmpty = require('./../../validation/is-empty');

// load mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');
const Review = require('./../../models/Review');
const User = require('./../../models/User');

// functions
const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

const getImageLinks = imageUrl => {
  const imageArray = imageUrl.split('.');
  const fileExtension = imageArray.splice(-1);
  const url = imageArray.join('.');
  return {
    original: imageUrl,
    smallSquare: `${url}s.${fileExtension}`,
    bigSquare: `${url}b.${fileExtension}`,
    smallThumbnail: `${url}t.${fileExtension}`,
    mediumThumbnail: `${url}m.${fileExtension}`,
    largeThumbnail: `${url}l.${fileExtension}`,
    hugeThumbnail: `${url}l.${fileExtension}`
  };
};

// middleware
const verifyBookId = (req, res, next) => {
  Book.findOne({ _id: req.params.bookId, isApproved: true })
    .then(book => {
      if (!book) return res.status(404).json({ msg: 'Book not found' });
      next();
    })
    .catch(err => res.status(400).json(err));
};

const checkAuthLevel = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(400).json({ unauthorized: 'You are not authorized to do that' });
  next();
};

// @route     get /api/books
// @desc      view approved books
// @access    public
router.get('/', (req, res) => {
  Book.find({ isApproved: true })
    .sort({ date: -1 })
    .then(books => {
      res.json(books);
    })
    .catch(err => res.status(400).json(err));
});

// @route     get /api/books/pending
// @desc      view pending books
// @access    admin
router.get(
  '/pending',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    Book.find({ isApproved: false, isRejected: false })
      .populate('authors', 'name')
      .populate('creator', 'name')
      .then(books => {
        res.json(
          books.map(book => {
            return {
              _id: book._id,
              title: book.title,
              publishedDate: new Date(book.publishedDate).getFullYear(),
              creator: book.creator,
              authors: book.authors,
              image: book.image
            };
          })
        );
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route     put /api/books/:bookId/approve
// @desc      approve book
// @access    admin
router.put(
  '/:bookId/approve',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    Book.findById(req.params.bookId).then(book => {
      // make sure book isn't already approved
      if (book.isApproved) return res.status(400).json({ msg: 'Book has already been approved' });
      // approve and save book
      book.isApproved = true;
      book.save().then(book => {
        res.json(book);
      });
    });
  }
);

// @route     put /api/books/:bookId/reject
// @desc      reject book
// @access    admin
router.put(
  '/:bookId/reject',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    Book.findById(req.params.bookId).then(book => {
      book.isApproved = false;
      book.isRejected = true;
      book.save().then(book => {
        res.json(book);
      });
    });
  }
);

// @route     get /api/books/random
// @desc      view random books
// @access    public
router.get('/random', (req, res) => {
  const errors = {};
  Book.find({ isApproved: true })
    .then(books => {
      if (books.length === 0) {
        errors.nobooks = 'No books found';
        return res.status(404).json(errors);
      }
      const randomBook = books[Math.floor(Math.random() * books.length)];
      res.redirect(`/api/books/${randomBook._id}`);
    })
    .catch(err => res.status(404).json(err));
});

// @route     post /api/books/add/search
// @desc      search for books to add, return a list of up to 10 results
// @access    private
router.post('/add/search', passport.authenticate('jwt', { session: false }), (req, res) => {
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes/?q=${
        req.body.searchQuery
      }&maxResults=10&key=${googleBooksApiKey}`
    )
    .then(async googleResults => {
      const googleList = flatted.parse(flatted.stringify(googleResults)).data.items;
      bookList = googleList.map(book => {
        return {
          googleId: book.id,
          title: book.volumeInfo.title,
          subtitle: book.volumeInfo.subtitle,
          authors: book.volumeInfo.authors,
          publishedDate: new Date(book.volumeInfo.publishedDate).getFullYear(),
          thumb: book.volumeInfo.imageLinks.thumbnail,
          alreadySubmitted: false
        };
      });
      const updatedBookList = [];
      await asyncForEach(bookList, async book => {
        await Book.findOne({ 'identifiers.googleId': book.googleId }).then(foundBook => {
          if (foundBook) {
            updatedBookList.push({ ...book, alreadySubmitted: true });
          } else {
            updatedBookList.push(book);
          }
        });
      });
      res.json(updatedBookList);
    })
    .catch(err => res.status(400).json(err));
});

// @route     get /api/books/add/:googleId
// @desc      show google book image and image upload form
// @access    private
router.get('/add/:googleId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Book.findOne({ 'identifiers.googleId': req.params.googleId }).then(book => {
    if (book && book.isApproved)
      return res.status(400).json({ googleId: 'This book has already been added' });
    if (book && !book.isApproved)
      return res.status(400).json({ googleId: 'This book has already been requested' });
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes/${
          req.params.googleId
        }?key=${googleBooksApiKey}`
      )
      .then(async googleBookData => {
        const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
        // return object with google id and google image url. these will be included as values in the post form.
        res.json({
          googleImageUrl: volumeInfo.imageLinks.extraLarge
        });
      })
      .catch(err => res.status(400).json(err));
  });
});

// @route     post /api/books/
// @desc      new book route. upload image and store in data.
// @access    private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // upload image to imgur
  const errors = [];
  const imageUrl = req.body.imageUrl;
  imgur.upload(imageUrl, (err, imgurImage) => {
    if (err) errors.push('Unable to upload image. Please try again using a different image URL.');
    if (errors.length > 0) return res.json({ errors });

    Book.findOne({ 'identifiers.googleId': req.body.googleId }).then(book => {
      if (book && book.isApproved) errors.push('This book has already been added.');
      if (book && !book.isApproved) errors.push('This book has already been requested.');
      if (errors.length > 0) return res.json({ errors });

      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${
            req.body.googleId
          }?key=${googleBooksApiKey}`
        )
        .then(async googleBookData => {
          if (!googleBookData) errors.push('Unable to receive data from Google Books.');
          if (errors.length > 0) return res.json({ errors });
          const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;

          // create new book
          const imageLinks = getImageLinks(imgurImage.data.link);
          const newBook = new Book({
            identifiers: {
              googleId: req.body.googleId
            },
            title: volumeInfo.title,
            authors: [],
            creator: req.user._id,
            image: imageLinks
          });
          // add subtitle if it exists
          if (volumeInfo.subtitle) newBook.subtitle = volumeInfo.subtitle;
          if (volumeInfo.publishedDate) newBook.publishedDate = new Date(volumeInfo.publishedDate);
          if (volumeInfo.pageCount) newBook.pageCount = parseInt(volumeInfo.pageCount);
          // add isbn numbers to book if they exist
          if (volumeInfo.industryIdentifiers) {
            volumeInfo.industryIdentifiers.forEach(industryIdentifier => {
              if (industryIdentifier.type === 'ISBN_10') {
                newBook.identifiers.isbn10 = industryIdentifier.identifier;
              } else if (industryIdentifier.type === 'ISBN_13') {
                newBook.identifiers.isbn13 = industryIdentifier.identifier;
              }
            });
          }
          // check if authors exist in our db. if not, create them.
          await asyncForEach(volumeInfo.authors, async authorName => {
            await Author.findOne({ name: authorName })
              .then(async foundAuthor => {
                if (!foundAuthor) {
                  await Author.create({ name: authorName })
                    .then(createdAuthor => {
                      newBook.authors.push(createdAuthor._id);
                    })
                    .catch(() => {
                      errors.push('Unable to create author.');
                    });
                } else {
                  newBook.authors.push(foundAuthor._id);
                }
              })
              .catch(() => {
                errors.push('Unable to find author.');
              });
          });
          if (errors.length > 0) return res.json({ errors });
          // save new book
          await newBook.save().catch(() => {
            errors.push('Unable to save to our database.');
          });
          // send data (we'll have it redirect somewhere else in the future)
          if (errors.length > 0) return res.json({ errors });
          res.json({ msg: 'Success' });
        })
        .catch(() => {
          errors.push('Unknown Error');
          return res.json({ errors });
        });
    });
  });
});

// @route     /api/books/:bookId
// @desc      book show route
// @access    public
router.get('/:bookId', verifyBookId, (req, res) => {
  const errors = {};
  Book.findById(req.params.bookId)
    .populate('authors', 'name')
    .then(async book => {
      if (!book) {
        errors._id = 'Book not found';
        return res.status(404).json(errors);
      }
      // get additional info from google
      const googleInfo = {};
      await axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${
            book.identifiers.googleId
          }?key=${googleBooksApiKey}`
        )
        .then(googleBookData => {
          // store description from google books into an object
          const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
          googleInfo.description = volumeInfo.description ? volumeInfo.description : null;
        })
        .catch(err => res.status(400).json(err));
      // output data after fetching data from google
      res.json({
        _id: book._id,
        title: book.title,
        subtitle: book.subtitle,
        authors: book.authors,
        publishedDate: book.publishedDate,
        description: googleInfo.description,
        pageCount: book.pageCount,
        rating: book.rating,
        identifiers: book.identifiers
      });
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
