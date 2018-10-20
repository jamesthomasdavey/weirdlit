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

// @route     get /api/profile
// @desc      get current profile
// @access    private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user._id })
    .populate('user', 'name')
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      let favoriteBook = null;
      if (profile.favoriteBook) {
        await Book.findOne({ title: profile.favoriteBook })
          .populate('authors', 'name')
          .then(book => {
            if (!book || !book.isApproved) return;
            else if (book.isApproved) {
              favoriteBook = {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors
              };
            }
          });
      }
      res.json({
        _id: profile._id,
        user: profile.user,
        handle: profile.handle,
        favoriteBook: favoriteBook || profile.favoriteBook,
        location: profile.location,
        bio: profile.bio,
        social: {
          goodreads: profile.social.goodreads,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram
        },
        date: profile.date
      });
    })
    .catch(err => res.status(404).json(err));
});

// @route     get /api/profile/handle/:handle
// @desc      view specific profile from profile handle
// @access    private
router.get('/handle/:handle', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', 'name')
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      let favoriteBook = null;
      if (profile.favoriteBook) {
        await Book.findOne({ title: profile.favoriteBook })
          .populate('authors', 'name')
          .then(book => {
            if (!book || !book.isApproved) return;
            else if (book.isApproved) {
              favoriteBook = {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors
              };
            }
          });
      }
      res.json({
        _id: profile._id,
        user: profile.user,
        handle: profile.handle,
        favoriteBook: favoriteBook || profile.favoriteBook,
        location: profile.location,
        bio: profile.bio,
        social: {
          goodreads: profile.social.goodreads,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram
        },
        date: profile.date
      });
    })
    .catch(err => res.status(400).json(err));
});

// @route     get /api/profile/user/:userId
// @desc      view specific profile from user ID
// @access    private
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.userId })
    .populate('user', 'name')
    .then(async profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        return res.status(404).json(errors);
      }
      let favoriteBook = null;
      if (profile.favoriteBook) {
        await Book.findOne({ title: profile.favoriteBook })
          .populate('authors', 'name')
          .then(book => {
            if (!book || !book.isApproved) return;
            else if (book.isApproved) {
              favoriteBook = {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                authors: book.authors
              };
            }
          });
      }
      res.json({
        _id: profile._id,
        user: profile.user,
        handle: profile.handle,
        favoriteBook: favoriteBook || profile.favoriteBook,
        location: profile.location,
        bio: profile.bio,
        social: {
          goodreads: profile.social.goodreads,
          facebook: profile.social.facebook,
          instagram: profile.social.instagram
        },
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
  if (!isEmpty(errors)) return res.status(400).json(errors);
  Profile.findOne({ handle: req.body.handle.toLowerCase() })
    .then(profile => {
      if (profile && !profile.user.equals(req.user._id)) {
        // check if the id is taken, or if it is, make sure it is owned by the current user
        errors.handle = 'This handle has already been taken';
        return res.status(400).json(errors);
      }
      if (isEmpty(errors)) {
        const profileFields = {};
        if (req.body.handle) profileFields.handle = req.body.handle.toLowerCase();
        if (req.body.favoriteBook) profileFields.favoriteBook = req.body.favoriteBook;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        profileFields.social = {};
        if (req.body.goodreads) profileFields.social.goodreads = req.body.goodreads;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
        Profile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true })
          .then(profile => res.redirect('/api/profile'))
          .catch(err => res.status(400).json(err));
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
