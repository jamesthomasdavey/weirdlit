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
      let favoriteBook = {};
      if (req.body.favoriteBook.id) {
        favoriteBook = req.body.favoriteBook;
      } else if (req.body.favoriteBook.title) {
        favoriteBook = { title: req.body.favoriteBook.title };
      }
      const newProfile = new Profile({
        user: newUser._id,
        date: newUser.date,
        favoriteBook
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
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (!foundUser && !errors.email) errors.email = 'User not found';
      if (!isEmpty(errors)) return res.status(400).json(errors);
      bcrypt
        .compare(req.body.password, foundUser.password)
        .then(isMatch => {
          if (!isMatch) {
            errors.password = 'Password is incorrect';
            return res.status(400).json(errors);
          }
          const payload = { _id: foundUser._id, name: foundUser.name, isAdmin: foundUser.isAdmin };
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 604800 }, (err, token) => {
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

// @route     post /api/users/:userId/notifications
// @desc      notify a user
// @access    private
router.post(
  '/:userId/notifications',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.params.userId).then(user => {
      if (!user) return res.status(404).json({ user: 'User not found' });
      user.notifications.push({
        content: req.body.content,
        link: req.body.link
      });
      user.save().then(user => res.json({ msg: 'Success' }));
    });
  }
);

// @route     get /api/users/notifications
// @desc      get notifications for a user
// @access    private
router.get('/notifications', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id).then(user => {
    if (!user.notifications.length === 0 || !user.notifications)
      return res.json({ notifications: [] });
    return res.json({ notifications: user.notifications });
  });
});

// @route     get /api/users/notifications/count
// @desc      get number of unread notifications for a user
// @access    private
router.get('/notifications/count', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id).then(user => {
    if (user.notifications.length === 0) return res.json({ notificationsCount: 0 });
    const notificationsCount = user.notifications.reduce((acc, current) => {
      if (!current.read) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
    res.json({ notificationsCount });
  });
});

// @route     put /api/users/notifications/:notificationId
// @desc      read a notification
// @access    private
router.put(
  '/notifications/:notificationId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id).then(user => {
      const newNotifications = user.notifications.map(notification => {
        if (notification._id.equals(req.params.notificationId)) {
          notification.read = true;
          return notification;
        } else {
          return notification;
        }
      });
      user.notifications = newNotifications;
      user.save().then(user => res.json({ msg: 'success' }));
    });
  }
);

// @route     delete /api/users/notifications/:notificationId
// @desc      delete a notification
// @access    private
router.delete(
  '/notifications/:notificationId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findById(req.user._id).then(user => {
      let deleteNotificationIndex;
      user.notifications.forEach((notification, index) => {
        if (notification._id.equals(req.params.notificationId)) {
          deleteNotificationIndex = index;
        }
      });
      user.notifications.splice(deleteNotificationIndex, 1);
      user.save().then(user => {
        res.json({ msg: 'success' });
      });
    });
  }
);

// @route     delete /api/users/notifications
// @desc      delete all notifications
// @access    private
router.delete('/notifications', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.user._id).then(user => {
    user.notifications = [];
    user.save();
    res.json({ msg: 'Success' });
  });
});

//
module.exports = router;
