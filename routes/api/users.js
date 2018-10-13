const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// load keys
const keys = require('./../../config/keys');

// load user model
const User = require('./../../models/User');

// @route     /api/users/test
// @desc      test users route
// @access    public
router.get('/test', (req, res) => res.json({ msg: 'users test working...' }));

// @route     /api/users/register
// @desc      register new user
// @access    public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (foundUser) {
        res.status(400).json({ email: 'Email already registered.' });
        throw 'Email already registered.';
      }
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      return bcrypt.genSalt(10).then(salt => {
        if (!salt) throw 'Error generating salt.';
        return bcrypt.hash(newUser.password, salt).then(hash => {
          if (!hash) throw 'Error generating hash.';
          newUser.password = hash;
          return newUser.save();
        });
      });
    })
    .then(newUser => res.json(newUser))
    .catch(err => console.log(err));
});

// @route     /api/users/login
// @desc      log in user
// @access    public
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (!foundUser) {
        res.status(404).json({ email: 'User not found.' });
        throw 'User not found.';
      }
      return foundUser;
    })
    .then(foundUser => {
      return bcrypt.compare(req.body.password, foundUser.password).then(isMatch => {
        if (!isMatch) {
          res.status(400).json({ password: 'Password is incorrect.' });
          throw 'Password is incorrect.';
        }
        return foundUser;
      });
    })
    .then(foundUser => {
      const payload = {
        _id: foundUser._id
      };
      return jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 });
    })
    .then(token => {
      if (!token) throw 'Unable to sign token';
      res.json({
        success: true,
        token: `Bearer ${token}`
      });
    })
    .catch(err => console.log(err));
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
  User.findById(req.params.userId).then(user => res.json(user));
});

module.exports = router;
