const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('./../../validation/register');
const validateLoginInput = require('./../../validation/login');
const isEmpty = require('./../../validation/is-empty');

// load keys
const keys = require('./../../config/keys');

// load mongoose models
const User = require('./../../models/User');
const Profile = require('./../../models/Profile');

// @route     /api/users/test
// @desc      test users route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'users test working...' }));

// @route     /api/users/register
// @desc      register new user
// @access    public
router.post('/register', (req, res) => {
  const errors = validateRegisterInput(req.body);
  User.findOne({ email: req.body.email })
    .then(async foundUser => {
      if (foundUser) errors.email = 'Email already registered';
      if (!isEmpty(errors)) res.status(400).json(errors);
      else {
        // create new user
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        // use bcrypt to encrypt the password
        await bcrypt
          .genSalt(10)
          .then(salt => {
            if (!salt) throw 'Error generating salt.';
            return bcrypt.hash(newUser.password, salt);
          })
          .then(hash => {
            if (!hash) throw 'Error generating hash.';
            newUser.password = hash;
          })
          .catch(err => res.status(400).json(err));
        // save the new user
        await newUser.save();
        // create a new profile
        const newProfile = new Profile({
          user: newUser._id
        });
        newProfile.favoriteBook = req.body.favoriteBook ? req.body.favoriteBook : '';
        // save the new profile
        await newProfile.save();
        // output data to user
        res.json(newUser);
      }
    })
    .catch(err => res.status(400).json(err));
});

// @route     /api/users/login
// @desc      log in user
// @access    public
router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (!isEmpty(errors)) res.status(400).json(errors);
  else {
    User.findOne({ email: req.body.email })
      .then(foundUser => {
        if (!foundUser) {
          errors.email = 'User not found';
          res.status(404).json(errors);
        } else {
          bcrypt
            .compare(req.body.password, foundUser.password)
            .then(isMatch => {
              if (!isMatch) {
                errors.password = 'Password is incorrect';
                res.status(404).json(errors);
              } else {
                const payload = { _id: foundUser._id };
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                  if (!token || err) throw 'Unable to sign token';
                  res.json({
                    success: true,
                    token: `Bearer ${token}`
                  });
                });
              }
            })
            .catch(err => res.status(400).json(err));
        }
      })
      .catch(err => res.status(400).json(err));
  }
});

// @route     /api/users/current
// @desc      return current user info
// @access    private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
});

// @route     /api/users/:userId
// @desc      view user page
// @access    public
router.get('/:userId', (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) res.status(404).json({ user: 'User not found' });
      else {
        res.json(user);
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
