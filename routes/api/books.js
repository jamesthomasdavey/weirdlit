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
    .catch(err => console.log(err));
};

// @route     /api/books
// @desc      view approved books
// @access    public
router.get('/', (req, res) => {
  Book.find({ isApproved: true }).then(books => res.json(books));
});

// @route     /api/books/pending
// @desc      view pending books
// @access    private
router.get('/pending', (req, res) => {
  Book.find({ isApproved: false }).then(books => res.json(books));
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
          // check if authors exist. if not, create them.
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
          // add reference for book to each author
          await asyncForEach(newBook.authors, async authorID => {
            await Author.findById(authorID).then(async foundAuthor => {
              foundAuthor.books.push(newBook._id);
              await foundAuthor.save();
            });
          });
          // add reference for book to user
          await User.findById(req.user._id).then(async user => {
            await user.books.push(newBook._id);
          });
          // send data
          res.json(newBook);
        })
        .catch(err => console.log(err));
    }
  });
});

// @route     /api/books/:bookId
// @desc      book show route
// @access    public
router.get('/:bookId', verifyBookId, (req, res) => {
  Book.findById(req.params.bookId)
    .populate('authors')
    .populate('reviews')
    .populate('creator')
    .exec()
    .then(book => {
      // average out rating
      const rating =
        book.reviews.length > 0
          ? (
              book.reviews.reduce((prev, current) => prev + current.rating, 0) / book.reviews.length
            ).toFixed(2)
          : 'This book has not yet been reviewed';
      // get additional info from google
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${
            book.identifiers.googleId
          }?key=${googleBooksApiKey}`
        )
        .then(googleBookData => {
          const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
          res.json({
            book,
            googleInfo: {
              description: volumeInfo.description,
              pageCount: volumeInfo.pageCount
            },
            rating
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// @route     /api/books/:bookId/reviews/new
// @desc      add review to book
// @access    private
router.post(
  '/:bookId/reviews/new',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validateReviewInput(req.body);
    if (!isEmpty(errors)) res.status(400).json(errors);
    User.findById(req.user._id)
      .populate('reviews')
      .exec()
      .then(user => {
        user.reviews.forEach(review => {
          if (review.book == req.params.bookId) errors.user = 'You have already reviewed this book';
        });
        if (!isEmpty(errors)) res.status(400).json(errors);
        else {
          Review.create({
            text: req.body.text,
            rating: req.body.rating,
            book: req.params.bookId,
            creator: req.user._id
          })
            .then(review => {
              Book.findById(req.params.bookId)
                .then(book => {
                  book.reviews.push(review._id);
                  return book.save();
                })
                .then(() => {
                  user.reviews.push(review._id);
                  return user.save();
                })
                .then(() => {
                  res.json(review);
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
