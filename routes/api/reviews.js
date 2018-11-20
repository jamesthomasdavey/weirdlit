const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const mongoose = require('mongoose');

// load input validation
const isEmpty = require('./../../validation/is-empty');
const validateReviewInput = require('./../../validation/review');
const validateCommentInput = require('../../validation/comment');

// load mongoose models
const Book = require('./../../models/Book');
const Review = require('./../../models/Review');
const User = require('./../../models/User');
const Comment = require('../../models/Comment');

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
      if (!book) return res.status(404).json({ nobook: 'Book not found' });
      next();
    })
    .catch(err => res.status(400).json(err));
};

// @route     get /api/books/:bookId/reviews
// @desc      get all reviews for a book
// @access    public
router.get('/', verifyBookId, (req, res) => {
  Review.find({ book: req.params.bookId })
    .populate('creator', ['name', '_id'])
    .populate('book', ['title', '_id'])
    .then(reviews => {
      if (!reviews || reviews.length === 0) return res.json([]);
      res.json(reviews);
    });
});

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
        return res.json({ errors });
      }
      // now validate input
      errors = validateReviewInput(req.body);
      if (!isEmpty(errors)) return res.json({ errors });

      // make/save review
      const newReview = new Review({
        rating: req.body.rating,
        headline: req.body.headline,
        text: req.body.text.replace(/\n\s*\n\s*\n/g, '\n\n'),
        book: req.params.bookId,
        name: req.body.name,
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
      await Book.findById(req.params.bookId).then(async book => {
        book.rating = newRating;
        await Review.find({ book: req.params.bookId }).then(async reviews => {
          if (reviews.length > 2) {
            book.ratingDisplay = true;
          } else {
            book.ratingDisplay = false;
          }
        });
        await book.save();
      });
      await Profile.findOne({ user: req.user._id }).then(async profile => {
        let hasRead;
        profile.booksRead.forEach(bookRead => {
          if (bookRead.toString() === req.params.bookId) {
            hasRead = true;
          }
        });
        if (!hasRead) {
          profile.booksRead.push(req.params.bookId);
          await profile.save();
        }
      });
      // send new review data
      res.json(newReview);
    })
    .catch(err => res.status(400).json(err));
});

// @route     get /api/books/:bookId/reviews/:reviewId
// @desc      get review to book
// @access    public
router.get('/:reviewId', verifyBookId, (req, res) => {
  Review.findById(req.params.reviewId)
    .populate('creator', ['name', '_id'])
    .populate('book', ['title', '_id'])
    .populate({ path: 'comments', populate: { path: 'creator' } })
    .then(review => {
      if (!review.book._id.equals(req.params.bookId))
        return res.status(404).json({ success: false });
      res.json(review);
    });
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
      .populate('book', ['title', '_id'])
      .then(review => {
        if (!review.creator.equals(req.user._id)) {
          errors.unauthorized = 'You are not authorized to do that';
          return res.status(400).json(errors);
        }
        if (!review.book._id.equals(req.params.bookId))
          return res.status(404).json({ success: false });
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
        if (!isEmpty(errors)) return res.json({ errors });
        // create the new review
        review.headline = req.body.headline;
        review.text = req.body.text.replace(/\n\s*\n\s*\n/g, '\n\n');
        review.rating = Number(req.body.rating);
        review.lastUpdated = Date.now();
        // update review
        await review.save();
        // reset book rating
        let newRating;
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
        res.json({ success: true });
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route     delete /api/books/:bookId/reviews/:reviewId
// @desc      delete review of book
// @access    private
router.delete(
  '/:reviewId',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
        await asyncForEach(review.comments, async comment => {
          await Comment.findByIdAndRemove(comment);
        });

        review
          .remove()
          .then(res.json({ success: true }))
          .catch(err => res.status(404).json(err));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route     post /api/books/:bookId/reviews/:reviewId/like
// @desc      like review of book
// @access    private
router.put(
  '/:reviewId/likes',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Review.findById(req.params.reviewId)
      .then(review => {
        review.likes = req.body.likes;
        review.save().then(() => {
          res.json({ success: true });
        });
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route     post /api/books/:bookId/reviews/:reviewId/comments
// @desc      add comment to review
// @access    private
router.post(
  '/:reviewId/comments',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = validateCommentInput(req.body);
    if (!isEmpty(errors)) return res.json({ errors });
    Comment.create({
      text: req.body.text.replace(/\n\s*\n\s*\n/g, '\n\n'),
      creator: req.user._id
    }).then(comment => {
      Review.findById(req.params.reviewId).then(review => {
        review.comments.push(comment._id);
        review.save().then(() => {
          res.json({ comment });
        });
      });
    });
  }
);

// @route     delete /api/books/:bookId/reviews/:reviewId/comments/:commentId
// @desc      delete comment from review
// @access    private

router.delete(
  '/:reviewId/comments/:commentId',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Review.findById(req.params.reviewId)
      .populate('comments', ['creator'])
      .then(review => {
        const commentIds = review.comments.map(comment => comment._id.toString());
        const commentIndex = commentIds.indexOf(req.params.commentId);
        if (review.comments[commentIndex].creator._id.toString() !== req.user._id.toString())
          return res.status(400).json({ authorized: false });
        review.comments.splice(commentIndex, 1);
        review
          .save()
          .then(() => {
            Comment.findByIdAndRemove(req.params.commentId).then(() => res.json({ success: true }));
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
