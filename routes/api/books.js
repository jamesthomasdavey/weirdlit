const express = require('express');
const router = express.Router();
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;
const passport = require('passport');

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

// middleware

const verifyBookId = (req, res, next) => {
  Book.findOne({ _id: req.params.bookId, isApproved: true })
    .then(book => {
      if (!book) res.status(404).json({ msg: 'Book not found' });
      else next();
    })
    .catch(err => res.status(400).json(err));
};

const checkAuthLevel = (req, res, next) => {
  if (!req.user.isAdmin) res.status(400).json({ msg: 'You are not authorized to do that' });
  else {
    next();
  }
};

// @route     /api/books
// @desc      view approved books
// @access    public
router.get('/', (req, res) => {
  Book.find({ isApproved: true })
    .then(books => {
      res.json(books);
    })
    .catch(err => res.status(400).json(err));
});

// @route     /api/books/pending
// @desc      view pending books
// @access    admin
router.get(
  '/pending',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    Book.find({ isApproved: false })
      .then(books => {
        res.json(books);
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
      if (book.isApproved) res.status(400).json({ msg: 'Book has already been approved' });
      else {
        book.isApproved = true;
        book.save().then(book => {
          res.redirect(`/api/books/${book._id}`);
        });
      }
    });
  }
);

// @route     /api/books/random
// @desc      view random books
// @access    public
router.get('/random', (req, res) => {
  Book.find({ isApproved: true })
    .then(books => {
      if (books.length === 0) res.json({});
      else {
        const randomBook = books[Math.floor(Math.random() * books.length)];
        res.redirect(`/api/books/${randomBook._id}`);
      }
    })
    .catch(err => res.status(400).json(err));
});

// @route     /api/books/new
// @desc      new book route
// @access    private
router.post('/new', passport.authenticate('jwt', { session: false }), (req, res) => {
  Book.findOne({ 'identifiers.googleId': req.body.googleId }).then(book => {
    if (book.isApproved) {
      res.status(400).json({ googleId: 'This book has already been added' });
    } else if (!book.isApproved) {
      res.status(400).json({ googleId: 'This book has already been requested' });
    } else {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${
            req.body.googleId
          }?key=${googleBooksApiKey}`
        )
        .then(async googleBookData => {
          const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
          // create new book
          const newBook = new Book({
            identifiers: {
              googleId: req.body.googleId
            },
            title: volumeInfo.title,
            authors: [],
            creator: req.user._id
          });
          // add subtitle if it exists
          newBook.subtitle = volumeInfo.subtitle ? volumeInfo.subtitle : null;
          newBook.publishedDate = volumeInfo.publishedDate
            ? new Date(volumeInfo.publishedDate)
            : null;
          newBook.pageCount = volumeInfo.pageCount ? parseInt(volumeInfo.pageCount) : null;
          // add isbn numbers to book if they exist
          volumeInfo.industryIdentifiers.forEach(industryIdentifier => {
            if (industryIdentifier.type === 'ISBN_10') {
              newBook.identifiers.isbn10 = industryIdentifier.identifier;
            } else if (industryIdentifier.type === 'ISBN_13') {
              newBook.identifiers.isbn13 = industryIdentifier.identifier;
            }
          });
          // check if authors exist in our db. if not, create them.
          await asyncForEach(volumeInfo.authors, async authorName => {
            await Author.findOne({ name: authorName }).then(async foundAuthor => {
              if (!foundAuthor) {
                await Author.create({ name: authorName }).then(createdAuthor => {
                  newBook.authors.push(createdAuthor._id);
                });
              } else {
                newBook.authors.push(foundAuthor._id);
              }
            });
          });
          // save new book
          await newBook.save();
          // send data (we'll have it redirect somewhere else in the future)
          res.json(newBook);
        })
        .catch(err => res.status(400).json(err));
    }
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
        res.status(404).json(errors);
      } else {
        // get reviews for book
        let bookReviews = [];
        await Review.find({ book: book._id })
          .populate('creator', 'name')
          .then(reviews => {
            if (!reviews || reviews.length === 0) return;
            // push each review
            else
              bookReviews = reviews.map(review => {
                return {
                  _id: review._id,
                  creator: review.creator,
                  rating: review.rating,
                  text: review.text,
                  date: review.date,
                  lastUpdated: review.lastUpdated
                };
              });
          });
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
          reviews: bookReviews,
          identifiers: book.identifiers
        });
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
