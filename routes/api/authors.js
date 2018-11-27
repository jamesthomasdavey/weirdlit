const express = require('express');
const router = express.Router();
const passport = require('passport');
const prependHttp = require('prepend-http');
const firstBy = require('thenby');

// load input validation
const isEmpty = require('./../../validation/is-empty');
const validateAuthorInput = require('./../../validation/author');

// load mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');

// functions
const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

// middleware
const checkAuthLevel = (req, res, next) => {
  if (!req.user.isAdmin)
    return res.status(400).json({ unauthorized: 'You are not authorized to do that' });
  next();
};

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

// @route     /api/authors/:authorId
// @desc      update author page
// @access    admin
router.put(
  '/:authorId',
  passport.authenticate('jwt', { session: false }),
  checkAuthLevel,
  (req, res) => {
    const errors = validateAuthorInput(req.body);
    if (!isEmpty(errors)) res.json({ errors });
    Author.findById(req.params.authorId).then(author => {
      author.name = req.body.name;
      author.bio = req.body.bio.replace(/\n\s*\n\s*\n/g, '\n\n');
      author.website = req.body.website ? prependHttp(req.body.website) : '';
      author.save().then(() => {
        res.json({ success: true });
      });
    });
  }
);

// @route     /api/authors/:authorId/books/latest
// @desc      get ID for author's latest book
// @access    public
router.get('/:authorId/books/latest', (req, res) => {
  Book.find({ authors: req.params.authorId, isApproved: true, isRejected: false })
    .populate('authors', ['name', '_id'])
    .then(books => {
      books
        .sort((a, b) =>
          a.publishedDate > b.publishedDate ? 1 : b.publishedDate > a.publishedDate ? -1 : 0
        )
        .reverse();
      res.json({ bookId: books[0]._id });
    });
});

// @route     /api/authors/:authorId/books
// @desc      get all books by author
// @access    public
router.get('/:authorId/books', (req, res) => {
  Book.find({ authors: req.params.authorId, isApproved: true, isRejected: false }).then(books => {
    res.json(books);
  });
});

// @route     /api/authors/:authorId/books
// @desc      get all books by author
// @access    public
router.get(
  '/:authorId/books/filter/:tags/sort/:sortMethod/:sortOrder/skip/:skipAmount',
  async (req, res) => {
    let tagIds = [];
    if (req.params.tags !== 'none') {
      tagIds = req.params.tags.split('+');
    }
    let books = [];
    if (tagIds.length > 0) {
      await Book.find({ authors: req.params.authorId, tags: tagIds[0] })
        .populate('authors', 'name')
        .then(matchingBooks => {
          matchingBooks.forEach(matchingBook => {
            let doesFit = true;
            tagIds.forEach(tagId => {
              let matchingBookTags = matchingBook.tags.map(tag => tag.toString());
              if (!matchingBookTags.includes(tagId.toString())) {
                doesFit = false;
              }
            });
            if (doesFit) {
              books.push(matchingBook);
            }
          });
        });
    } else {
      await Book.find({ authors: req.params.authorId })
        .populate('authors', 'name')
        .then(allBooks => {
          allBooks.forEach(book => {
            books.push(book);
          });
        });
    }
    if (req.params.sortMethod === 'publishedDate') {
      books.sort((a, b) => {
        a = new Date(a.publishedDate);
        b = new Date(b.publishedDate);
        return a > b ? -1 : a < b ? 1 : 0;
      });
    } else if (req.params.sortMethod === 'rating') {
      const updatedBooks = [];
      await asyncForEach(books, async book => {
        await Review.find({ book: book._id }).then(reviews => {
          const updatedBook = book;
          if (reviews.length === 0) {
            updatedBook.rating = 0;
            updatedBook.numOfReviews = 0;
          } else {
            const rating =
              reviews.reduce((acc, current) => {
                return acc + current.rating;
              }, 0) / reviews.length;
            updatedBook.rating = rating;
            updatedBook.numOfReviews = reviews.length;
          }
          updatedBooks.push(updatedBook);
        });
      });
      updatedBooks.sort(
        firstBy((a, b) => a.rating - b.rating, -1).thenBy(
          (a, b) => a.numOfReviews - b.numOfReviews,
          -1
        )
      );
      books = updatedBooks;
    } else if (req.params.sortMethod === 'pageCount') {
      books.sort((a, b) => a.pageCount - b.pageCount).reverse();
    }
    if (req.params.sortOrder === 'asc') {
      books.reverse();
    }
    const totalAvailable = books.length;
    const usableTagIds = books.reduce((accTags, currentBook) => {
      const usableTagsFromBook = currentBook.tags.reduce((acc, currentTag) => {
        if (!accTags.includes(currentTag)) {
          return [...acc, currentTag];
        } else {
          return acc;
        }
      }, []);
      return [...accTags, ...usableTagsFromBook];
    }, []);
    const skippedBooks = books.splice(req.params.skipAmount, 12);
    res.json({ totalAvailable, books: skippedBooks, usableTagIds });
  }
);

module.exports = router;
