const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// require mongoose models
const Profile = require('./../../models/Profile');
const User = require('./../../models/User');

// @route     /api/profile/test
// @desc      test profile route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'profile test working...' }));

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user._id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No profile found';
        res.status(404).json(errors);
      } else {
        res.json(profile);
      }
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
