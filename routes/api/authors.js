const express = require('express');
const router = express.Router();

// load mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');

// @route     /api/authors/:authorId
// @desc      show author page
// @access    public
router.get('/:authorId', (req, res) => {
  Author.findById(req.params.authorId)
    .then(author => {
      if (!author) return res.status(404).json({ author: 'Author not found' });
      res.json(author);
    })
    .catch(err => res.status(400).json(err));
});

router.get(
  '/:authorId/books/sort/publishedDate/limit/:limitAmount/skip/:skipAmount',
  (req, res) => {
    Book.find({ authors: req.params.authorId, isApproved: true, isRejected: false })
      .sort({ publishedDate: -1 })
      .skip(parseInt(req.params.skipAmount))
      .limit(parseInt(req.params.limitAmount))
      .populate('authors', 'name')
      .then(books => {
        res.json(books);
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
