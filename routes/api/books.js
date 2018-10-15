const express = require('express');
const router = express.Router();
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;
const passport = require('passport');

// load input validation
const validateReviewInput = require('./../../validation/review');
const isEmpty = require('./../../validation/is-empty');

// load mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');
const Review = require('./../../models/Review');
const User = require('./../../models/User');

// 2cl7AgAAQBAJ

// functions
const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

// middleware

const verifyBookId = (req, res, next) => {
  Book.findById(req.params.bookId)
    .then(book => {
      if (!book) res.status(404).json({ msg: 'Book not found' });
      else if (!book.isApproved)
        res.status(400).json({ msg: 'This book has not yet been approved' });
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
      if (!books || books.length === 0) res.json([]);
      else res.json(books);
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
        if (!books || books.length === 0) res.json([]);
        else res.json(books);
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
          // redirect to book show page
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
      if (!books || books.length === 0) res.json({});
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
    if (book) {
      res.status(400).json({ googleId: 'This book has already been added.' });
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
          // check if authors exist in our. if not, create them.
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
          // send data
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
  Book.findById(req.params.bookId)
    .populate('authors')
    .exec()
    .then(async book => {
      // get reviews for book
      const bookReviews = [];
      await Review.find({ book: book._id })
        .populate('creator')
        .exec()
        .then(reviews => {
          if (!reviews || reviews.length === 0) return;
          // push each review
          else
            reviews.forEach(review =>
              bookReviews.push({
                _id: review._id,
                creator: {
                  _id: review.creator._id,
                  name: review.creator.name
                },
                rating: review.rating,
                text: review.text,
                date: review.date
              })
            );
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
    })
    .catch(err => res.status(400).json(err));
});

// @route     /api/books/:bookId/reviews/new
// @desc      add review to book
// @access    private
router.post(
  '/:bookId/reviews/new',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = {};
    // check if user has reviewed this already
    Review.find({ creator: req.user._id })
      .then(async reviews => {
        if (reviews && reviews.length > 0) {
          reviews.forEach(review => {
            if (review.book == req.params.bookId) {
              errors.alreadyReviewed = 'You have already reviewed this book';
            }
          });
        }
        if (!isEmpty(errors)) res.status(400).json(errors);
        else {
          // validate input
          errors = validateReviewInput(req.body);
          if (!isEmpty(errors)) res.status(400).json(errors);
          else {
            // make/save review
            const newReview = new Review({
              text: req.body.text,
              rating: req.body.rating,
              book: req.params.bookId,
              creator: req.user._id
            });
            await newReview.save();
            // average out ratings
            let newRating = null;
            await Review.find({ book: req.params.bookId }).then(reviews => {
              newRating = (
                reviews.reduce((prev, current) => prev + current.rating, 0) / reviews.length
              ).toFixed(2);
            });
            await Book.findById(req.params.bookId).then(book => {
              book.rating = newRating;
              book.save();
            });
            res.json({ newReview });
          }
        }
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
