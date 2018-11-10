const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const prependHttp = require('prepend-http');

// require mongoose models
const Book = require('./../../models/Book');
const Profile = require('./../../models/Profile');
const User = require('./../../models/User');

// require validation
const isEmpty = require('./../../validation/is-empty');
const validateProfileInput = require('./../../validation/profile');

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
      let favoriteBookObj = '';
      if (profile.favoriteBook) {
        await Book.findOne({ title: profile.favoriteBook })
          .populate('authors', 'name')
          .then(async book => {
            if (!book || !book.isApproved) return;
            else if (book.isApproved) {
              favoriteBookObj = {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors.map(author => author.name),
                publishedDate: new Date(book.publishedDate).getFullYear(),
                description: book.description,
                image: book.image
              };

              let hasReadFavoriteBook;
              profile.booksRead.forEach(book => {
                if (book._id.equals(favoriteBookObj._id)) {
                  hasReadFavoriteBook = true;
                }
              });
              if (!hasReadFavoriteBook) {
                profile.booksRead.push(favoriteBookObj._id);
                await profile.save();
              }
            }
          });
      }
      res.json({
        _id: profile._id,
        user: {
          _id: profile.user._id,
          name: profile.user.name
        },
        handle: profile.handle,
        favoriteBook: profile.favoriteBook,
        favoriteBookObj,
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
// @access    private
router.get(
  '/user/:userId/reviews',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Review.find({ creator: req.params.userId })
      .populate({ path: 'book', populate: { path: 'authors' } })
      .populate('comments', 'user')
      .populate('likes', 'user')
      .then(reviews => {
        if (reviews.length > 0) return res.json({ reviews });
        res.json({ reviews: [] });
      })
      .catch(() => res.status(404).json({ reviews: [] }));
  }
);

// @route     get /api/profile/handle/:handle
// @desc      get specific profile from profile handle
// @access    private
router.get('/handle/:handle', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['_id', 'name'])
    .populate({ path: 'booksRead', populate: { path: 'authors' } })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      let favoriteBookObj = '';
      if (profile.favoriteBook) {
        await Book.findOne({ title: profile.favoriteBook })
          .populate('authors', 'name')
          .then(book => {
            if (!book || !book.isApproved) return;
            else if (book.isApproved) {
              favoriteBookObj = {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors.map(author => author.name),
                publishedDate: new Date(book.publishedDate).getFullYear(),
                description: book.description,
                image: book.image
              };
            }
          });
      }
      res.json({
        _id: profile._id,
        user: {
          _id: profile.user._id,
          name: profile.user.name
        },
        handle: profile.handle,
        favoriteBook: profile.favoriteBook,
        favoriteBookObj,
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
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.userId })
    .populate('user', ['_id', 'name'])
    .populate({ path: 'booksRead', populate: { path: 'authors' } })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      let favoriteBookObj = '';
      if (profile.favoriteBook) {
        await Book.findOne({ title: profile.favoriteBook })
          .populate('authors', 'name')
          .then(book => {
            if (!book || !book.isApproved) return;
            else if (book.isApproved) {
              favoriteBookObj = {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors.map(author => author.name),
                publishedDate: new Date(book.publishedDate).getFullYear(),
                description: book.description,
                image: book.image
              };
            }
          });
      }
      res.json({
        _id: profile._id,
        user: {
          _id: profile.user._id,
          name: profile.user.name
        },
        handle: profile.handle,
        favoriteBook: profile.favoriteBook,
        favoriteBookObj,
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
  Profile.findOne({ handle: req.body.handle.toLowerCase() }).then(profile => {
    if (profile && !profile.user.equals(req.user._id)) {
      // check if the handle is taken, or if it is, make sure it is owned by the current user
      errors.handle = 'This handle has already been taken';
      return res.json({ errors });
    }
    if (isEmpty(errors)) {
      const updatedProfile = {
        handle: req.body.handle.toLowerCase(),
        favoriteBook: req.body.favoriteBook,
        location: req.body.location,
        bio: req.body.bio.replace(/\n\s*\n\s*\n/g, '\n\n'),
        social: {
          goodreads: req.body.goodreads ? prependHttp(req.body.goodreads) : '',
          twitter: req.body.twitter ? prependHttp(req.body.twitter) : '',
          facebook: req.body.facebook ? prependHttp(req.body.facebook) : '',
          instagram: req.body.instagram ? prependHttp(req.body.instagram) : ''
        },
        date: req.body.date
      };

      Profile.findOneAndUpdate({ user: req.user._id }, { $set: updatedProfile }, { new: true })
        .then(profile => res.json(profile))
        .catch(err => res.status(400).json(err));
    }
  });
  // .catch(err => res.status(400).json(err));
});

module.exports = router;
