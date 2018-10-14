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
// @access    private
router.get('/pending', (req, res) => {
  Book.find({ isApproved: false })
    .then(books => {
      if (!books || books.length === 0) res.json([]);
      else res.json(books);
    })
    .catch(err => res.status(400).json(err));
});

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
    .populate('creator')
    .exec()
    .then(async book => {
      // get reviews for book
      const bookReviews = [];
      await Review.find({ book: book._id }).then(reviews => {
        if (!reviews || reviews.length === 0) return;
        else reviews.forEach(review => bookReviews.push(review));
      });
      // average out rating
      const rating =
        bookReviews.length > 0
          ? (
              bookReviews.reduce((prev, current) => prev + current.rating, 0) / bookReviews.length
            ).toFixed(2)
          : 'This book has not yet been reviewed';
      // get additional info from google
      const googleInfo = {};
      await axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${
            book.identifiers.googleId
          }?key=${googleBooksApiKey}`
        )
        .then(googleBookData => {
          // store info from google books into an object
          const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
          googleInfo.description = volumeInfo.description ? volumeInfo.description : null;
          googleInfo.pageCount = volumeInfo.pageCount ? volumeInfo.pageCount : null;
          googleInfo.publishedDate = volumeInfo.publishedDate ? volumeInfo.publishedDate : null;
        })
        .catch(err => res.status(400).json(err));
      // output data after fetching data from google
      res.json({
        book,
        reviews: bookReviews,
        rating,
        googleInfo
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
    Book.findById(req.params.bookId).then(book => {
      book.reviews.forEach(review => {
        if (review.creator === req.user._id)
          errors.alreadyReviewed = 'You have already reviewed this book';
      });
      if (!isEmpty(errors)) res.status(400).json(errors);
      else {
        // validate input
        errors = validateReviewInput(req.body);
        if (!isEmpty(errors)) res.status(400).json(errors);
        else {
          // create review
          Review.create({
            text: req.body.text,
            rating: req.body.rating,
            book: req.params.bookId,
            creator: req.user._id
          })
            .then(review => {
              res.json(review);
            })
            .catch(err => res.status(400).json(err));
        }
      }
    });
  }
);

module.exports = router;
