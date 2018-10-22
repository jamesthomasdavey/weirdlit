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
      if (!book) return res.status(404).json({ msg: 'Book not found' });
      next();
    })
    .catch(err => res.status(400).json(err));
};

// @route     post /api/books/:bookId/reviews
// @desc      add new review to book
// @access    private
router.post('/', verifyBookId, passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = {};
  // check if user has reviewed this already
  Review.findOne({ creator: req.user._id, book: req.params.bookId })
    .then(async review => {
      if (review) {
        errors.alreadyReviewed = 'You have already reviewed this book';
        return res.status(400).json(errors);
      }
      // now validate input
      errors = validateReviewInput(req.body);
      if (!isEmpty(errors)) return res.status(400).json(errors);

      // make/save review
      const newReview = new Review({
        rating: req.body.rating,
        headline: req.body.headline,
        text: req.body.text,
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
      // send new review data
      res.json({ newReview });
    })
    .catch(err => res.status(400).json(err));
});

// @route     get /api/books/:bookId/reviews/:reviewId/edit
// @desc      edit review to book
// @access    private
router.get(
  '/:reviewId/edit',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Review.findById(req.params.reviewId)
      .then(review => {
        if (!review) {
          errors.noreview = 'No review found';
          return res.status(404).json(errors);
        }
        if (!review.creator.equals(req.user._id)) {
          errors.unauthorized = 'You are not authorized to do that';
          return res.status(400).json(errors);
        }
        res.json(review);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     put /api/books/:bookId/reviews/:reviewId
// @desc      update review to book
// @access    private
router.put(
  '/:reviewId',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = {};
    // check if review exists
    Review.findById(req.params.reviewId)
      .then(async review => {
        // check if review exists
        if (!review) {
          errors.noreview = 'No review found';
          return res.status(404).json(errors);
        }
        // check if user owns review
        if (!review.creator.equals(req.user._id)) {
          errors.unauthorized = 'You are not authorized to do that';
          return res.status(400).json(errors);
        }
        // validate input
        errors = validateReviewInput(req.body);
        if (!isEmpty(errors)) return res.status(400).json(errors);
        // create the new review
        const updatedReview = {
          headline: req.body.headline,
          text: req.body.text,
          rating: req.body.rating,
          lastUpdated: Date.now()
        };
        // update review
        await Review.findByIdAndUpdate(req.params.reviewId, { $set: updatedReview }, { new: true });
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
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
