const express = require('express');
const router = express.Router({ mergeParams: true });
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;
const passport = require('passport');

// load input validation
const isEmpty = require('./../../validation/is-empty');
const validateReviewInput = require('./../../validation/review');

// load mongoose models
const Book = require('./../../models/Book');
const Review = require('./../../models/Review');
const User = require('./../../models/User');

// middleware
const verifyBookId = (req, res, next) => {
  Book.findOne({ _id: req.params.bookId, isApproved: true })
    .then(book => {
      if (!book) res.status(404).json({ msg: 'Book not found' });
      else next();
    })
    .catch(err => res.status(400).json(err));
};

// @route     post /api/books/:bookId/reviews
// @desc      add new review to book
// @access    private
router.post('/', verifyBookId, passport.authenticate('jwt', { session: false }), (req, res) => {
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
});

// @route     put /api/books/:bookId/reviews
// @desc      edit review to book
// @access    private
router.put(
  '/:reviewId',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validateReviewInput(req.body);
    if (!isEmpty(errors)) res.status(400).json(errors);
    else {
      Review.findById(req.params.reviewId).then(async review => {
        if (!review) {
          // check that the review exists
          errors.noreview = 'No review found';
          res.status(404).json(errors);
        } else if (!review.creator.equals(req.user._id)) {
          // check the the reviewer owns the review
          errors.unauthorized = 'Unauthorized';
          res.status(400).json(errors);
        } else {
          // create the new review
          const updatedReview = {
            text: req.body.text,
            rating: req.body.rating,
            lastUpdated: Date.now()
          };
          // update review
          await Review.findByIdAndUpdate(
            req.params.reviewId,
            { $set: updatedReview },
            { new: true }
          );
          // reset book rating
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
          // send or redirect
          res.redirect(`/api/books/${req.params.bookId}`);
        }
      });
    }
  }
);

module.exports = router;
