const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// require mongoose models
const Book = require('./../../models/Book');
const Profile = require('./../../models/Profile');
const User = require('./../../models/User');

// require validation
const isEmpty = require('./../../validation/is-empty');
const validateProfileInput = require('./../../validation/profile');

// @route     /api/profile/test
// @desc      test profile route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'profile test working...' }));

// @route     get /api/profile
// @desc      get current profile
// @access    private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user._id })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        res.status(404).json(errors);
      } else {
        let favoriteBook = null;
        if (profile.favoriteBook) {
          await Book.findOne({ title: profile.favoriteBook })
            .populate('authors')
            .exec()
            .then(book => {
              if (!book || !book.isApproved) return;
              else if (book.isApproved) {
                favoriteBook = {
                  _id: book._id,
                  title: book.title,
                  subtitle: book.subtitle,
                  authors: book.authors.map(author => author.name)
                };
              }
            });
        }
        res.json({
          _id: profile._id,
          user: profile.user,
          date: profile.date,
          location: profile.location,
          favoriteBook: favoriteBook || profile.favoriteBook
        });
      }
    })
    .catch(err => res.status(404).json(err));
});

// @route     put /api/profile
// @desc      update current profile
// @access    private

router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = validateProfileInput(req.body);
  if (!isEmpty(errors)) res.status(400).json(errors);
  else {
    Profile.find({ handle: req.body.handle || '' })
      .then(profile => {
        if (req.body.handle && profile && profile.user !== req.user._id)
          res.status(400).json({ handle: 'This handle has already been taken' });
        else {
          const profileFields = { user: req.user._id, date: req.user.date };
          if (req.body.handle) profileFields.handle = req.body.handle;
          if (req.body.favoriteBook) profileFields.favoriteBook = req.body.favoriteBook;
          if (req.body.location) profileFields.location = req.body.location;
          if (req.body.bio) profileFields.bio = req.body.bio;
          profileFields.social = {};
          if (req.body.goodreads) profile.social.goodreads = req.body.goodreads;
          if (req.body.facebook) profile.social.facebook = req.body.facebook;
          if (req.body.instagram) profile.social.instagram = req.body.instagram;

          Profile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true })
            .then(profile => res.json(profile))
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  }
});

router.get('/:handle', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        res.status(404).json(errors);
      } else {
        let favoriteBook = null;
        if (profile.favoriteBook) {
          await Book.findOne({ title: profile.favoriteBook })
            .populate('authors')
            .exec()
            .then(book => {
              if (!book || !book.isApproved) return;
              else if (book.isApproved) {
                favoriteBook = {
                  _id: book._id,
                  title: book.title,
                  subtitle: book.subtitle,
                  authors: book.authors.map(author => author.name)
                };
              }
            });
        }
        res.json({
          _id: profile._id,
          user: profile.user,
          date: profile.date,
          location: profile.location,
          favoriteBook: favoriteBook || profile.favoriteBook
        });
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
