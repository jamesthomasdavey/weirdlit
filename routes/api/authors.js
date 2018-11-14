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
      Book.find({ authors: req.params.authorId, isApproved: true, isRejected: false })
        .then(books => {
          res.json({
            _id: author._id,
            name: author.name,
            date: author.date,
            books: books.map(book => {
              return {
                _id: book._id,
                title: book.title,
                subtitle: book.subtitle,
                publishedDate: book.publishedDate,
                pageCount: book.pageCount
              };
            })
          });
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
