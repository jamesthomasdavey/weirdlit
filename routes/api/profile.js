const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// require mongoose models
const Book = require('./../../models/Book');
const Profile = require('./../../models/Profile');
const User = require('./../../models/User');

// @route     /api/profile/test
// @desc      test profile route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'profile test working...' }));

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

module.exports = router;
