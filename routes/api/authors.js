const express = require('express');
const router = express.Router();

// require mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');

// @route     /api/authors/:authorId
// @desc      show author page
// @access    public
router.get('/:authorId', (req, res) => {
  Author.findById(req.params.authorId)
    .populate('books')
    .exec()
    .then(author => res.json(author))
    .catch(err => console.log(err));
});

module.exports = router;
