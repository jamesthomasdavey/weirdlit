const express = require('express');
const router = express.Router();
const axios = require('axios');
const flatted = require('flatted');
const googleBooksApiKey = require('./../../config/keys').googleBooksApiKey;

// require mongoose models
const Book = require('./../../models/Book');
const Author = require('./../../models/Author');

// 2cl7AgAAQBAJ

// functions
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
  Book.findOne({ googleId: req.body.googleId }).then(book => {
    if (book) {
      res.status(400).json({ googleId: 'This book has already been registered.' });
    } else {
      axios
        .get(
          `https://www.googleapis.com/books/v1/volumes/${
            req.body.googleId
          }?key=${googleBooksApiKey}`
        )
        .then(async googleBookData => {
          const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data.volumeInfo;
          // create new book
          const newBook = new Book({
            identifiers: {
              googleId: req.body.googleId
            },
            title: volumeInfo.title,
            authors: []
          });
          // add subtitle if it exists
          newBook.subtitle = volumeInfo.subtitle ? volumeInfo.subtitle : null;
          // add isbn numbers to book if they exist
          volumeInfo.industryIdentifiers.forEach(industryIdentifier => {
            if (industryIdentifier.type === 'ISBN_10') {
              newBook.identifiers.isbn10 = industryIdentifier.identifier;
            } else if (industryIdentifier.type === 'ISBN_13') {
              newBook.identifiers.isbn13 = industryIdentifier.identifier;
            }
          });
          // add image links if they exist
          newBook.images.thumbnail = volumeInfo.imageLinks.thumbnail
            ? volumeInfo.imageLinks.thumbnail
            : '';
          newBook.images.small = volumeInfo.imageLinks.small ? volumeInfo.imageLinks.small : '';
          newBook.images.medium = volumeInfo.imageLinks.medium ? volumeInfo.imageLinks.medium : '';

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
    }
  });
});

// @route     /api/books/:bookId
// @desc      book show route
// @access    public
router.get('/:bookId', (req, res) => {
  Book.findById(req.params.bookId).then(book => res.json(book));
});

module.exports = router;
