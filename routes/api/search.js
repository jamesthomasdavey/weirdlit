const express = require('express');
const router = express.Router();
const arrayToSentence = require('array-to-sentence');

const isEmpty = require('./../../validation/is-empty');

//models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');
const Tag = require('./../../models/Tag');

// functions
const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

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
      Author.find({ $text: { $search: req.body.searchQuery } }).then(async authors => {
        let authorList = [];
        await asyncForEach(authors, async author => {
          await Book.find({ authors: author._id, isApproved: true, isRejected: false }).then(
            books => {
              if (books.length > 0) {
                authorList.push(author);
              }
            }
          );
        });
        const authorsResults = authorList
          .map(author => ({
            title: author.name,
            link: `/authors/${author._id}`
          }))
          .splice(0, 5);
        Tag.find({ $text: { $search: req.body.searchQuery } })
          .limit(5)
          .then(tags => {
            const tagResults = tags.map(tag => ({
              title: tag.name,
              link: `/books/filter/${tag.name}`
            }));
            res.json({ books: booksResults, authors: authorsResults, tags: tagResults });
          });
      });
    });
});

// @route     /api/search/authors
// @desc      author suggestions
// @access    public
router.post('/addAuthor', (req, res) => {
  Author.find({ $text: { $search: req.body.searchQuery } }).then(async authors => {
    let authorList = [];
    await asyncForEach(authors, async author => {
      await Book.find({ authors: author._id, isApproved: true, isRejected: false }).then(books => {
        if (books.length > 0) {
          authorList.push(author);
        }
      });
    });
    const authorsResults = authorList.map(author => ({
      title: author.name,
      _id: author._id
    }));
    res.json(authorsResults);
  });
});

// @route     /api/search/books
// @desc      book suggestions
// @access    public
router.post('/favoriteBook', (req, res) => {
  Book.find({ $text: { $search: req.body.searchQuery }, isApproved: true, isRejected: false })
    .limit(5)
    .populate('authors')
    .then(books => {
      const booksResults = books.map(book => ({
        title: book.title,
        description: arrayToSentence(book.authors.map(author => author.name), {
          lastSeparator: ' & '
        }),
        _id: book._id
      }));
      res.json(booksResults);
    });
});

module.exports = router;
