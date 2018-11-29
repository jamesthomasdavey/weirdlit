const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const prependHttp = require('prepend-http');
const firstBy = require('thenby');

// require mongoose models
const Book = require('./../../models/Book');
const Profile = require('./../../models/Profile');
const User = require('./../../models/User');
const Review = require('./../../models/Review');

// require validation
const isEmpty = require('./../../validation/is-empty');
const validateProfileInput = require('./../../validation/profile');

// functions
const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

// @route     get /api/profile
// @desc      get current profile
// @access    private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user._id })
    .populate('user', ['_id', 'name'])
    .populate({ path: 'booksRead', populate: { path: 'authors' } })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      res.json({
        _id: profile._id,
        user: {
          _id: profile.user._id,
          name: profile.user.name
        },
        handle: profile.handle,
        favoriteBook: profile.favoriteBook,
        location: profile.location,
        bio: profile.bio,
        social: {
          goodreads: profile.social.goodreads,
          twitter: profile.social.twitter,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram
        },
        booksRead: profile.booksRead,
        date: profile.date
      });
    })
    .catch(err => res.status(404).json(err));
});

// @route     get /api/profile/user/:userId/reviews
// @desc      get reviews for specific userId
// @access    public
router.get('/user/:userId/reviews', (req, res) => {
  Review.find({ creator: req.params.userId })
    .populate({ path: 'book', populate: { path: 'authors' } })
    .populate('creator', ['name', '_id'])
    .then(reviews => {
      if (reviews.length > 0) return res.json({ reviews });
      res.json({ reviews: [] });
    })
    .catch(() => res.status(404).json({ reviews: [] }));
});

// @route     get /api/profile/user/:userId/reviews/sort/:sortMethod/:sortOrder/skip/:skipAmount
// @desc      get sorted reviews for specific userId
// @access    public
router.get('/user/:userId/reviews/sort/:sortMethod/:sortOrder/skip/:skipAmount', (req, res) => {
  Review.find({ creator: req.params.userId })
    .populate('creator', ['name', '_id'])
    .populate({ path: 'book', populate: { path: 'authors' } })
    .then(reviews => {
      const updatedReviews = reviews;
      if (req.params.sortMethod === 'writtenDate') {
        updatedReviews.sort((a, b) => {
          a = new Date(a.date);
          b = new Date(b.date);
          return a > b ? -1 : a < b ? 1 : 0;
        });
      } else if (req.params.sortMethod === 'likes') {
        updatedReviews.sort(
          firstBy((a, b) => a.likes.length - b.likes.length, -1).thenBy(
            (a, b) => (a.comments.length = b.comments.length),
            -1
          )
        );
      } else if (req.params.sortMethod === 'rating') {
        updatedReviews.sort(
          firstBy((a, b) => a.rating - b.rating, -1).thenBy(
            (a, b) => a.text.split(' ').length - b.text.split(' ').length,
            -1
          )
        );
      } else if (req.params.sortMethod === 'wordCount') {
        updatedReviews
          .sort((a, b) => a.text.split(' ').length - b.text.split(' ').length)
          .reverse();
      }
      if (req.params.sortOrder === 'asc') {
        updatedReviews.reverse();
      }
      const totalAvailable = updatedReviews.length;
      const skippedReviews = updatedReviews.splice(req.params.skipAmount, 10);
      res.json({ totalAvailable, reviews: skippedReviews });
    })
    .catch(() => res.status(404).json({ reviews: [] }));
});

// @route     get /api/profile/user/reviews
// @desc      get reviews for logged in user, to check if they can unread a book or not
// @access    private
router.get('/user/reviews', passport.authenticate('jwt', { session: false }), (req, res) => {
  Review.find({ creator: req.user._id })
    .then(reviews => {
      if (reviews.length > 0) return res.json({ reviews });
      res.json({ reviews: [] });
    })
    .catch(() => res.status(404).json({ reviews: [] }));
});

// @route     get /api/profile/handle/:handle
// @desc      get specific profile from profile handle
// @access    private
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['_id', 'name'])
    .populate({ path: 'booksRead', populate: { path: 'authors' } })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      res.json({
        _id: profile._id,
        user: {
          _id: profile.user._id,
          name: profile.user.name
        },
        handle: profile.handle,
        favoriteBook: profile.favoriteBook,
        location: profile.location,
        bio: profile.bio,
        social: {
          goodreads: profile.social.goodreads,
          twitter: profile.social.twitter,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram
        },
        booksRead: profile.booksRead,
        date: profile.date
      });
    })
    .catch(err => res.status(400).json(err));
});

// @route     get /api/profile/user/:userId
// @desc      get specific profile from user ID
// @access    private
router.get('/user/:userId', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.userId })
    .populate('user', ['_id', 'name'])
    .populate({ path: 'booksRead', populate: { path: 'authors' } })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      res.json({
        _id: profile._id,
        user: {
          _id: profile.user._id,
          name: profile.user.name
        },
        handle: profile.handle,
        favoriteBook: profile.favoriteBook,
        location: profile.location,
        bio: profile.bio,
        social: {
          goodreads: profile.social.goodreads,
          twitter: profile.social.twitter,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram
        },
        booksRead: profile.booksRead,
        date: profile.date
      });
    })
    .catch(err => res.status(400).json(err));
});

// @route     put /api/profile
// @desc      update current profile
// @access    private
router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = validateProfileInput(req.body);
  if (!isEmpty(errors)) return res.json({ errors });
  Profile.findOne({ handle: req.body.handle.toLowerCase() }).then(handleProfile => {
    if (handleProfile && !handleProfile.user.equals(req.user._id)) {
      // check if the handle is taken, or if it is, make sure it is owned by the current user
      errors.handle = 'This handle has already been taken';
      return res.json({ errors });
    }
    Profile.findOne({ user: req.user._id }).then(profile => {
      if (isEmpty(errors)) {
        let favoriteBook = {};
        if (req.body.favoriteBook.id) {
          favoriteBook = req.body.favoriteBook;
        } else if (req.body.favoriteBook.title) {
          favoriteBook = { title: req.body.favoriteBook.title };
        }
        profile.handle = req.body.handle.toLowerCase();
        profile.favoriteBook = favoriteBook;
        profile.location = req.body.location;
        profile.bio = req.body.bio.replace(/\n\s*\n\s*\n/g, '\n\n');
        profile.social = {
          goodreads: req.body.goodreads ? prependHttp(req.body.goodreads) : '',
          twitter: req.body.twitter ? prependHttp(req.body.twitter) : '',
          facebook: req.body.facebook ? prependHttp(req.body.facebook) : '',
          instagram: req.body.instagram ? prependHttp(req.body.instagram) : ''
        };

        if (req.body.favoriteBook.id) {
          let hasReadFavoriteBook;
          profile.booksRead.forEach(book => {
            if (book._id.equals(req.body.favoriteBook.id)) {
              hasReadFavoriteBook = true;
            }
          });
          if (!hasReadFavoriteBook) {
            profile.booksRead.push(req.body.favoriteBook.id);
          }
        }

        profile.save().then(() => res.json({ success: true }));
      }
    });
  });
  // .catch(err => res.status(400).json(err));
});

// @route     put /api/profile/booksRead
// @desc      read or unread a book
// @access    private
router.put('/booksRead', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user._id }).then(profile => {
    if (!profile) return res.json({});
    if (req.body.hasRead) {
      let hasAlreadyRead;
      profile.booksRead.forEach(bookRead => {
        if (bookRead && bookRead.toString() === req.body.bookId) {
          hasAlreadyRead = true;
        }
      });
      if (!hasAlreadyRead) {
        profile.booksRead.push(req.body.bookId);
        profile.save().then(() => {
          res.json({ success: true });
        });
      }
    } else if (!req.body.hasRead) {
      let removeIndex = null;
      profile.booksRead.forEach((bookRead, index) => {
        if (bookRead && bookRead.toString() === req.body.bookId) {
          removeIndex = index;
        }
      });
      if (removeIndex !== null) {
        profile.booksRead.splice(removeIndex, 1);
        profile.save().then(() => {
          res.json({ success: true });
        });
      }
    }
  });
});

// @route     put /api/profile/booksRead
// @desc      read or unread a book
// @access    private
router.get(
  '/user/:userId/books/filter/:tags/sort/:sortMethod/:sortOrder/skip/:skipAmount',
  (req, res) => {
    Profile.findOne({ user: req.params.userId })
      .populate({ path: 'booksRead', populate: { path: 'authors' } })
      .then(async profile => {
        let tagIds = [];
        if (req.params.tags !== 'none') {
          tagIds = req.params.tags.split('+');
        }
        let books = [];
        if (tagIds.length > 0) {
          profile.booksRead.forEach(bookRead => {
            let doesFit = true;
            const bookTags = bookRead.tags.map(tag => tag.toString());
            tagIds.forEach(tagId => {
              if (!bookTags.includes(tagId)) {
                doesFit = false;
              }
            });
            if (doesFit) {
              books.push(bookRead);
            }
          });
        } else {
          books = profile.booksRead;
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
  }
);

module.exports = router;
