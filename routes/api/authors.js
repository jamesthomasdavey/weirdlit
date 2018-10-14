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
      if (!author) res.status(404).json({ author: 'Author not found' });
      else {
        Book.find({ authors: req.params.authorId }).then(books => {
          if (!books || books.length === 0) res.json({ books: 'No books found' });
          else {
            const approvedBooks = [];
            books.forEach(book => {
              if (book.isApproved) {
                approvedBooks.push(book);
              }
            });
            if (approvedBooks.length === 0) res.json({ books: 'No approved books found' });
            else {
              res.json({ author, books: approvedBooks });
            }
          }
        });
      }
    })
    .catch(err => res.status(400).json(err));
});

module.exports = router;
