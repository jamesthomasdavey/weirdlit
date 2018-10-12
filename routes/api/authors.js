const express = require('express');
const router = express.Router();

// require mongoose models
const Author = require('./../../models/Author');
const Book = require('./../../models/Book');

// functions
const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i]);
  }
};

// @route     /api/authors/:authorId
// @desc      show author page
// @access    public
router.get('/:authorId', (req, res) => {
  Author.findById(req.params.authorId)
    .then(async author => {
      const books = [];
      await asyncForEach(author.books, async book => {
        await Book.findById(book._id).then(foundBook => {
          books.push(foundBook);
        });
      });
      res.json(author);
    })
    .catch(err => console.log(err));
});

module.exports = router;
