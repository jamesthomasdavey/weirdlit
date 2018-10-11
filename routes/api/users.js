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
  User.findOne({ email: req.body.email }).then(foundUser => {
    if (foundUser) {
      return res.status(400).json({ email: "Email already registered" });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(400).json({ msg: "Error generating salt" });
      }
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          return res.status(400).json({ msg: "Error generating hash" });
        }
        newUser.password = hash;
        return newUser
          .save()
          .then(newUser => res.json(newUser))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route     /api/users/login
// @desc      log in user
// @access    public
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if (!foundUser) {
        return res.status(404).json({ email: "User not found" });
      }
      return foundUser;
    })
    .then(foundUser => {
      return bcrypt
        .compare(req.body.password, foundUser.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({ password: "Password is incorrect" });
          }
          return foundUser;
        });
    })
    .then(foundUser => {
      const payload = {
        name: foundUser.name,
        email: foundUser.email
      };
      res.json(payload);
    });
});

module.exports = router;
