const express = require('express');
const router = express.Router();
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;

// require book model
const Book = require('./../../models/Book');
const Author = require('./../../models/Author');

// 2cl7AgAAQBAJ

const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

// @route     /api/books
// @desc      view approved books
// @access    public
router.get('/', (req, res) => {
  Book.find({ isApproved: true }).then(books => res.json(books));
});

// @route     /api/books/pending
// @desc      view pending books
// @access    private
router.get('/pending', (req, res) => {
  Book.find({ isApproved: false }).then(books => res.json(books));
});

// @route     /api/books/register
// @desc      register book route
// @access    private
router.post('/register', (req, res) => {
  Book.findOne({ googleID: req.body.googleID })
    .then(book => {
      if (book) {
        res.status(400).json({ googleID: 'This book has already been registered.' });
        throw 'This book has already been registered.';
      }
      return axios.get(
        `https://www.googleapis.com/books/v1/volumes/${req.body.googleID}?key=${googleBooksApiKey}`
      );
    })
    .then(async googleBookData => {
      const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
      // create new book
      const newBook = new Book({
        googleID: req.body.googleID,
        title: volumeInfo.title,
        authors: []
      });
      // add subtitle if it exists
      if (volumeInfo.subtitle) newBook.subtitle = volumeInfo.subtitle;
      // add isbn numbers to book
      volumeInfo.industryIdentifiers.forEach(industryIdentifier => {
        if (industryIdentifier.type === 'ISBN_10') {
          newBook.isbn10 = industryIdentifier.identifier;
        } else if (industryIdentifier.type === 'ISBN_13') {
          newBook.isbn13 = industryIdentifier.identifier;
        }
      });
      // check if authors exist. if not, create them.
      await asyncForEach(volumeInfo.authors, async authorName => {
        await Author.findOne({ name: authorName }).then(async foundAuthor => {
          if (!foundAuthor) {
            await Author.create({ name: authorName }).then(createdAuthor => {
              newBook.authors.push(createdAuthor._id);
            });
          } else {
            newBook.authors.push(foundAuthor._id);
          }
        });
      });
      // save new book
      await newBook.save();
      // add reference for book to each author
      await asyncForEach(newBook.authors, async authorID => {
        await Author.findById(authorID).then(async foundAuthor => {
          foundAuthor.books.push(newBook._id);
          await foundAuthor.save();
        });
      });
      // send data
      res.json(newBook);
    })
    .catch(err => console.log(err));
});

// @route     /api/books/id
// @desc      book show route
// @access    public
router.get('/:id', (req, res) => {
  Book.findById(req.params.id).then(book => res.json(book));
});

module.exports = router;
