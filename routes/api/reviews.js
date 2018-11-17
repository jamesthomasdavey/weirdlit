const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

// load input validation
const isEmpty = require('./../../validation/is-empty');
const validateReviewInput = require('./../../validation/review');

// load mongoose models
const Book = require('./../../models/Book');
const Review = require('./../../models/Review');
const User = require('./../../models/User');
const Comment = require('../../models/Comment');

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
    .populate('creator', 'name')
    .populate('book', '_id')
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
        return res.status(400).json(errors);
      }
      // now validate input
      errors = validateReviewInput(req.body);
      if (!isEmpty(errors)) return res.status(400).json(errors);

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

// @route     get /api/books/:bookId/reviews/:reviewId
// @desc      get review to book
// @access    public
router.get('/:reviewId', verifyBookId, (req, res) => {
  Review.findById(req.params.reviewId)
    .populate('creator', ['name', '_id'])
    .populate({ path: 'comments', populate: { path: 'creator' } })
    .then(review => {
      res.json(review);
    });
});

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
          text: req.body.text.replace(/\n\s*\n\s*\n/g, '\n\n'),
          name: req.body.name,
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

// @route     delete /api/books/:bookId/reviews/:reviewId
// @desc      delete review of book
// @access    private
router.delete(
  '/:reviewId',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Review.findById(req.params.reviewId)
      .then(review => {
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
router.post(
  '/:reviewId/like',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Review.findById(req.params.reviewId)
      .then(review => {
        if (!review) {
          errors.noreview = 'Review not found';
          return res.status(404).json(errors);
        }
        if (
          review.likes.length > 0 &&
          review.likes.filter(like => like.user.equals(req.user._id))
        ) {
          errors.alreadyLiked = 'User already liked this review';
          return res.status(400).json(errors);
        }
        review.likes.unshift({ user: req.user._id });
        review
          .save()
          .then(review => res.json(review))
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route     post /api/books/:bookId/reviews/:reviewId/unlike
// @desc      unlike review of book
// @access    private
router.post(
  '/:reviewId/unlike',
  verifyBookId,
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Review.findById(req.params.reviewId)
      .then(review => {
        if (!review) {
          errors.noreview = 'Review not found';
          return res.status(404).json(errors);
        }
        if (
          review.likes.length === 0 ||
          !review.likes.filter(like => like.user.equals(req.user._id))
        ) {
          errors.notliked = 'User has not liked this review';
          return res.status(400).json(errors);
        }
        const removeIndex = review.likes.map(like => like.user.toString()).indexOf(req.user._id);
        review.likes.splice(removeIndex, 1);
        review
          .save()
          .then(review => res.json(review))
          .catch(err => res.status(400).json(err));
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
    Comment.create({
      text: req.body.text,
      creator: req.user._id
    }).then(comment => {
      Review.findById(req.params.reviewId).then(review => {
        review.comments.push(comment._id);
        review.save().then(() => {
          res.json({ success: true });
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
      .then(review => {
        if (!review) {
          errors.noreview = 'Review not found';
          return res.status(404).json(errors);
        }
        if (
          review.comments.length === 0 ||
          !review.comments.filter(comment => comment.equals(req.params.commentId))
        ) {
          errors.nocomments = 'Comment not found';
          return res.status(404).json(errors);
        }
        if (
          !review.comments
            .filter(comment => comment.equals(req.params.commentId))[0]
            .user.equals(req.params.user._id)
        ) {
          errors.unauthorized = 'You are not allowed to do that';
          return res.status(400).json(errors);
        }
        const removeIndex = review.comments
          .map(comment => comment.toString())
          .indexOf(req.params.commentId);

        review.comments.splice(removeIndex, 1);
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
