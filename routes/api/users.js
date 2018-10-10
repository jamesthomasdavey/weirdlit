const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// load user model
const User = require("./../../models/User");

// @route     /api/users/test
// @desc      test users route
// @access    public
router.get("/test", (req, res) => res.json({ msg: "users test working..." }));

// @route     /api/users/register
// @desc      register new user
// @access    public
router.post("/register", (req, res) => {
  // check if username is taken
  User.findOne({ username: req.body.username })
    .then(user => {
      // if taken, send message and throw error
      if (user) {
        res.status(400).json({
          username: "Username has already been registered."
        });
        throw "Username has already been registered.";
      }
    })
    // if not, check if email is taken
    .then(() => User.findOne({ email: req.body.email }))
    .then(user => {
      // if taken, send message and throw error
      if (user) {
        res.status(400).json({
          email: "Email has already been registered."
        });
        throw "Email has already been registered.";
      }
    })
    // if not, create a new user
    .then(() => {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      // generate salt
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // replace password value with hash and save
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
