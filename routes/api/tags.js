// package
const express = require('express');
const router = express.Router();

// mongoose model
const Tag = require('./../../models/Tag');

// middleware
const checkAuthLevel = (req, res, next) => {
  if (req.user && !req.user.isAdmin)
    return res.status(400).json({ unauthorized: 'You are not authorized to do that' });
  next();
};

// @route     get /api/tags
// @desc      view all possible tags
// @access    public
router.get('/', (req, res) => {
  Tag.find().then(tags => {
    res.json(tags);
  });
});

// @route     post /api/tags
// @desc      add a new tag
// @access    admin
router.post('/', checkAuthLevel, (req, res) => {
  Tag.create({ name: req.body.tag.toLowerCase() }).then(() => res.json({ success: 'true' }));
});

module.exports = router;
