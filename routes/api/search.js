const express = require('express');
const router = express.Router();
const arrayToSentence = require('array-to-sentence');

const isEmpty = require('./../../validation/is-empty');

const Author = require('./../../models/Author');
const Book = require('./../../models/Book');

// @route     /api/search/suggest
// @desc      search suggestions
// @access    public
router.post('/suggest', (req, res) => {
  Book.find({ $text: { $search: req.body.searchQuery }, isApproved: true, isRejected: false })
    .limit(5)
    .populate('authors')
    .then(books => {
      const booksResults = books.map(book => ({
        title: book.title,
        description: arrayToSentence(book.authors.map(author => author.name), {
          lastSeparator: ' & '
        }),
        link: `/books/${book._id}`
      }));
      Author.find({ $text: { $search: req.body.searchQuery } })
        .limit(5)
        .then(authors => {
          const authorsResults = authors.map(author => ({
            title: author.name,
            link: `/authors/${author._id}`
          }));
          res.json({ books: booksResults, authors: authorsResults });
        });
    });
});

module.exports = router;
