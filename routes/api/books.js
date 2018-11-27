const express = require('express');
const router = express.Router();
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;
const passport = require('passport');
const imgur = require('imgur-node-api');
const firstBy = require('thenby');

// load input validation
const isEmpty = require('./../../validation/is-empty');
const validateBookInput = require('./../../validation/book');

// load mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');
const Review = require('./../../models/Review');
const User = require('./../../models/User');
const Tag = require('./../../models/Tag');
const Featured = require('./../../models/Featured');

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

// @route     get /api/books/sort/publishedDate/limit/:limitAmount/skip/:skipAmount
// @desc      view approved books
// @access    public
router.get('/sort/publishedDate/limit/:limitAmount/skip/:skipAmount', (req, res) => {
  Book.find({ isApproved: true })
    .sort({ publishedDate: -1 })
    .skip(parseInt(req.params.skipAmount))
    .limit(parseInt(req.params.limitAmount))
    .then(books => {
      res.json(books);
    });
});

router.get('/filter/:tags/sort/:sortMethod/:sortOrder/skip/:skipAmount', async (req, res) => {
  let tagIds = [];
  if (req.params.tags !== 'none') {
    tagIds = req.params.tags.split('+');
  }
  let books = [];
  if (tagIds.length > 0) {
    await Book.find({ tags: tagIds[0] })
      .populate('authors', 'name')
      .then(matchingBooks => {
        matchingBooks.forEach(matchingBook => {
          let doesFit = true;
          tagIds.forEach(tagId => {
            let matchingBookTags = matchingBook.tags.map(tag => tag.toString());
            if (!matchingBookTags.includes(tagId.toString())) {
              doesFit = false;
            }
          });
          if (doesFit) {
            books.push(matchingBook);
          }
        });
      });
  } else {
    await Book.find()
      .populate('authors', 'name')
      .then(allBooks => {
        allBooks.forEach(book => {
          books.push(book);
        });
      });
  }
  if (req.params.sortMethod === 'publishedDate') {
    books.sort((a, b) => {
      a = new Date(a.publishedDate);
      b = new Date(b.publishedDate);
      return a > b ? -1 : a < b ? 1 : 0;
    });
  } else if (req.params.sortMethod === 'rating') {
    const updatedBooks = [];
    await asyncForEach(books, async book => {
      await Review.find({ book: book._id }).then(reviews => {
        const updatedBook = book;
        if (reviews.length === 0) {
          updatedBook.rating = 0;
          updatedBook.numOfReviews = 0;
        } else {
          const rating =
            reviews.reduce((acc, current) => {
              return acc + current.rating;
            }, 0) / reviews.length;
          updatedBook.rating = rating;
          updatedBook.numOfReviews = reviews.length;
        }
        updatedBooks.push(updatedBook);
      });
    });
    updatedBooks.sort(
      firstBy((a, b) => a.rating - b.rating, -1).thenBy(
        (a, b) => a.numOfReviews - b.numOfReviews,
        -1
      )
    );
    books = updatedBooks;
  } else if (req.params.sortMethod === 'pageCount') {
    books.sort((a, b) => a.pageCount - b.pageCount).reverse();
  }
  if (req.params.sortOrder === 'asc') {
    books.reverse();
  }
  const totalAvailable = books.length;
  const usableTagIds = books.reduce((accTags, currentBook) => {
    const usableTagsFromBook = currentBook.tags.reduce((acc, currentTag) => {
      if (!accTags.includes(currentTag)) {
        return [...acc, currentTag];
      } else {
        return acc;
      }
    }, []);
    return [...accTags, ...usableTagsFromBook];
  }, []);
  const skippedBooks = books.splice(req.params.skipAmount, 12);
  res.json({ totalAvailable, books: skippedBooks, usableTagIds });
});

// @route     get /api/books/featured
// @desc      get featured book ID
// @access    public
router.get('/featured', (req, res) => {
  let date = Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
  while (date % 7 !== 4) {
    date--;
  }
  Featured.findOne({ featuredDate: date }).then(featured => {
    if (featured)
      return res.json({ featuredDate: featured.featuredDate + 1, bookId: featured.bookId });
    Featured.find().then(featureds => {
      if (featureds.length > 0) {
        const featuredIds = featureds.map(featured => featured.bookId.toString());
        Book.find({ isApproved: true }).then(books => {
          const getRandomBookId = () => books[Math.floor(Math.random() * books.length)]._id;
          let randomBookId = getRandomBookId();
          while (featuredIds.includes(randomBookId.toString())) {
            randomBookId = getRandomBookId();
          }
          Featured.create({ featuredDate: date, bookId: randomBookId }).then(newFeatured => {
            res.json(newFeatured);
          });
        });
      } else {
        Book.find({ isApproved: true }).then(books => {
          const getRandomBookId = () => books[Math.floor(Math.random() * books.length)]._id;
          let randomBookId = getRandomBookId();
          Featured.create({ featuredDate: date, bookId: randomBookId }).then(newFeatured => {
            res.json({ featuredDate: newFeatured.featuredDate + 1, bookId: newFeatured.bookId });
          });
        });
      }
    });
  });
});

// @route     get /api/books/random
// @desc      view random books
// @access    public
router.get('/random', (req, res) => {
  const errors = {};
  Book.find({ isApproved: true, isRejected: false })
    .then(books => {
      if (books.length === 0) {
        errors.nobooks = 'No books found';
        return res.status(404).json(errors);
      }
      const randomBook = books[Math.floor(Math.random() * books.length)];
      res.json({ bookId: randomBook._id });
    })
    .catch(err => res.status(404).json(err));
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
          if (volumeInfo.description) newBook.description = volumeInfo.description;
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

// @route     post /api/books/custom
// @desc      new book route for custom books. upload image and store in data.
// @access    private
router.post('/custom', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const errors = validateBookInput(req.body);
  if (!req.body.image) {
    errors.image = 'Image cover is required';
  }
  if (!req.body.publishedDate) {
    errors.publishedDate = 'Publication date is required';
  }
  if (!isEmpty(errors)) return res.json({ errors });

  authors = [];
  await asyncForEach(req.body.authors, async author => {
    if (author._id) {
      authors.push(author._id);
    } else {
      await Author.findOne({ name: author.name }).then(async foundAuthor => {
        if (!foundAuthor) {
          await Author.create({ name: author.name }).then(createdAuthor => {
            authors.push(createdAuthor._id);
          });
        } else {
          authors.push(foundAuthor._id);
        }
      });
    }
  });

  imgur.upload(req.body.image, (err, imgurImage) => {
    if (err) errors.image = 'Unable to upload image. Please try again using a different image URL.';
    if (!isEmpty(errors)) return res.json({ errors });
    const imageLinks = getImageLinks(imgurImage.data.link);
    const newBook = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      authors,
      publishedDate: new Date(req.body.publishedDate),
      pageCount: req.body.pageCount,
      identifiers: {
        isbn10: req.body.isbn10,
        isbn13: req.body.isbn13
      },
      tags: req.body.tags,
      description: req.body.description.replace(/\n\s*\n\s*\n/g, '\n\n'),
      image: imageLinks,
      creator: req.user._id
    };
    Book.create(newBook).then(book => {
      return res.json({ success: 'true' });
    });
  });
});

// @route     /api/books/:bookId
// @desc      book show route
// @access    public
router.get('/:bookId', (req, res) => {
  const errors = [];
  Book.findById(req.params.bookId)
    .populate('authors', 'name')
    .populate('tags', 'name')
    .then(book => {
      if (!book) {
        errors.push('Unable to find book.');
        return res.json(errors);
      }
      if (book.isApproved || !book.isRejected || req.user.isAdmin) {
        return res.json({
          _id: book._id,
          title: book.title,
          subtitle: book.subtitle,
          authors: book.authors,
          publishedDate: book.publishedDate,
          description: book.description,
          pageCount: book.pageCount,
          rating: book.rating,
          identifiers: book.identifiers,
          tags: book.tags,
          image: book.image
        });
      }
    })
    .catch(err => res.status(400).json(err));
});

// @route     /api/books/:bookId/edit
// @desc      book edit route
// @access    admin
router.get(
  '/:bookId/edit',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    Book.findById(req.params.bookId)
      .populate('authors', 'name')
      .populate('tags', 'name')
      .then(book => {
        res.json({
          _id: book._id,
          title: book.title,
          subtitle: book.subtitle,
          authors: book.authors,
          publishedDate: book.publishedDate,
          description: book.description,
          pageCount: book.pageCount,
          rating: book.rating,
          identifiers: book.identifiers,
          tags: book.tags,
          image: book.image,
          isApproved: book.isApproved
        });
      })
      .catch(err => {
        return res.status(404).json(err);
      });
  }
);

// @route     put /api/books/:bookId
// @desc      update book route
// @access    admin
router.put(
  '/:bookId',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    const errors = validateBookInput(req.body);
    if (!isEmpty(errors)) return res.json({ errors });
    Book.findById(req.params.bookId).then(async book => {
      if (!book) return res.json({ success: 'false' });
      book.title = req.body.title;
      book.subtitle = req.body.subtitle;
      book.publishedDate = new Date(req.body.publishedDate);
      book.pageCount = req.body.pageCount;
      book.googleId = req.body.googleId;
      book.isbn10 = req.body.isbn10;
      book.isbn13 = req.body.isbn13;
      book.tags = req.body.tags;
      book.description = req.body.description;

      book.authors = [];
      await asyncForEach(req.body.authors, async author => {
        if (author._id) {
          book.authors.push(author._id);
        } else {
          await Author.findOne({ name: author.name }).then(async foundAuthor => {
            if (!foundAuthor) {
              await Author.create({ name: author.name }).then(createdAuthor => {
                book.authors.push(createdAuthor._id);
              });
            } else {
              book.authors.push(foundAuthor._id);
            }
          });
        }
      });

      if (!isEmpty(errors)) return res.json(errors);
      if (req.body.image) {
        imgur.upload(req.body.image, (err, imgurImage) => {
          if (err)
            errors.image = 'Unable to upload image. Please try again using a different image URL.';
          if (!isEmpty(errors)) return res.json({ errors });
          const imageLinks = getImageLinks(imgurImage.data.link);
          book.image = imageLinks;
          book.save().then(book => {
            res.json({ success: 'true' });
          });
        });
      } else {
        book.save().then(book => {
          res.json({ success: 'true' });
        });
      }
    });
  }
);

// @route     delete /api/books/:bookId
// @desc      delete book route
// @access    admin
router.delete(
  '/:bookId',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    Book.findByIdAndRemove(req.params.bookId).then(() => {
      Review.find({ book: req.params.bookId }).then(async reviews => {
        if (reviews.length > 0) {
          await asyncForEach(reviews, async review => {
            await Review.findByIdAndRemove(review._id);
          });
        }
        Profile.find({ booksRead: req.params.bookId }).then(async profiles => {
          if (profiles.length > 0) {
            await asyncForEach(profiles, async profile => {
              let deleteIndex;
              const booksRead = [...profile.booksRead];
              booksRead.forEach((bookRead, index) => {
                if (bookRead.toString() === req.params.bookId) {
                  deleteIndex = index;
                }
              });
              booksRead.splice(deleteIndex);
              profile.booksRead = booksRead;
              if (profile.favoriteBook.id.toString() === req.params.bookId) {
                profile.favoriteBook = {};
              }
              await profile.save();
            });
          }
          res.json({ success: true });
        });
      });
    });
  }
);

module.exports = router;
