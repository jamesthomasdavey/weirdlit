const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('./../../validation/register');
const validateLoginInput = require('./../../validation/login');
const validateAccountEditInput = require('./../../validation/account');
const isEmpty = require('./../../validation/is-empty');

// load keys
const keys = require('./../../config/keys');

// load mongoose models
const User = require('./../../models/User');
const Profile = require('./../../models/Profile');

// @route     post /api/users/register
// @desc      register new user
// @access    public
router.post('/register', (req, res) => {
  let errors = {};
  User.findOne({ email: req.body.email })
    .then(async foundUser => {
      // check if user exists
      if (foundUser) errors.email = 'Email already registered';
      // check input validation
      errors = { ...errors, ...validateRegisterInput(req.body) };
      if (!isEmpty(errors)) return res.status(400).json(errors);
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
        user: newUser._id,
        date: newUser.date,
        favoriteBook: req.body.favoriteBook
      });
      // save the new profile
      await newProfile.save();
      // output data to user
      res.json(newUser);
    })
    .catch(err => res.status(400).json(err));
});

// @route     post /api/users/login
// @desc      log in user
// @access    public
router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (!isEmpty(errors)) return res.status(400).json(errors);
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (!foundUser) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
      bcrypt
        .compare(req.body.password, foundUser.password)
        .then(isMatch => {
          if (!isMatch) {
            errors.password = 'Password is incorrect';
            return res.status(400).json(errors);
          }
          const payload = { _id: foundUser._id, name: foundUser.name, isAdmin: foundUser.isAdmin };
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
            if (!token || err) {
              errors.token = 'Unable to sign token';
              return res.status(400).json(errors);
            }
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          });
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

// @route     put /api/users/
// @desc      edit user info
// @access    private
router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  let errors = {};
  User.findById(req.user._id).then(foundUser => {
    bcrypt
      .compare(req.body.oldPassword, foundUser.password)
      .then(async isMatch => {
        errors = validateAccountEditInput(req.body);
        if (!isMatch && !errors.oldPassword) errors.oldPassword = 'Password is incorrect';
        if (req.body.email) {
          User.findOne({ email: req.body.email }).then(matchedUser => {
            if (matchedUser && !matchedUser._id.equals(req.user._id))
              errors.email = 'This email has already been taken';
          });
        }
        if (!isEmpty(errors)) return res.json({ errors });
        if (req.body.name) foundUser.name = req.body.name;
        if (req.body.email) foundUser.email = req.body.email;
        if (req.body.newPassword) {
          await bcrypt
            .genSalt(10)
            .then(salt => {
              if (!salt) throw 'Error generating salt.';
              return bcrypt.hash(req.body.newPassword, salt);
            })
            .then(hash => {
              if (!hash) throw 'Error generating hash.';
              foundUser.password = hash;
            })
            .catch(err => res.status(400).json(err));
        }
        await foundUser.save();
        res.json(foundUser);
      })
      .catch(err => res.json(err));
  });
});

// @route     get /api/users/current
// @desc      return current user info
// @access    private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  });
});

// @route     delete /api/users
// @desc      return current user info
// @access    private
router.post('/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  if (!req.body.password) {
    errors.password = 'Please enter your password';
    return res.json({ errors });
  }
  bcrypt.compare(req.body.password, req.user.password).then(isMatch => {
    if (!isMatch) {
      errors.password = 'Password is incorrect';
      return res.json({ errors });
    }
    Profile.findOneAndRemove({ user: req.user._id })
      .then(() => User.findByIdAndRemove(req.user._id))
      .then(() => res.json({ success: true }))
      .catch(err => res.status(404).json(err));
  });
});

module.exports = router;
