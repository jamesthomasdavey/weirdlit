const express = require("express");
const router = express.Router();
const axios = require("axios");
const flatted = require("flatted");
const googleBooksApiKey = require("./../../config/keys").googleBooksApiKey;

// require book model
const Book = require("./../../models/Book");
const Author = require("./../../models/Author");

// 2cl7AgAAQBAJ

const asyncForEach = async (arr, callback) => {
  for (let i = 0; i < arr.length; i++) {
    await callback(arr[i], i, arr);
  }
};

// @route     /api/books/test
// @desc      test books route
// @access    public
router.get("/test", (req, res) => res.json({ msg: "books test working..." }));

// @route     /api/books/register
// @desc      register book route
// @access    private
router.post("/register", (req, res) => {
  Book.findOne({ googleID: req.body.googleID })
    .then(book => {
      if (book) {
        res.status(400).json({
          googleID: "This book has already been registered."
        });
        throw "This book has already been registered.";
      }
    })
    .then(() => {
      // return the book information from google books
      return axios.get(
        `https://www.googleapis.com/books/v1/volumes/${
          req.body.googleID
        }?key=${googleBooksApiKey}`
      );
    })
    .then(async googleBookData => {
      const volumeInfo = flatted.parse(flatted.stringify(googleBookData)).data
        .volumeInfo;
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
        if (industryIdentifier.type === "ISBN_10") {
          newBook.isbn10 = industryIdentifier.identifier;
        } else if (industryIdentifier.type === "ISBN_13") {
          newBook.isbn13 = industryIdentifier.identifier;
        }
      });
      // check if authors exist. if not, create them.
      // await asyncForEach(volumeInfo.authors, async authorName => {
      //   await Author.findOne({ name: authorName }).then(async foundAuthor => {
      //     if (!foundAuthor) {
      //       await Author.create({ name: authorName }).then(createdAuthor => {
      //         newBook.authors.push(createdAuthor._id);
      //       });
      //     } else {
      //       newBook.authors.push(foundAuthor._id);
      //     }
      //   });
      // });

      await volumeInfo.authors.forEach(authorName => {
        Author.findOne({ name: authorName }).then(foundAuthor => {
          if (!foundAuthor) {
            Author.create({ name: authorName }).then(createdAuthor => {
              newBook.authors.push(createdAuthor._id);
            });
          } else {
            newBook.authors.push(foundAuthor._id);
          }
        });
      });

      return newBook.save();
    })
    .then(async newBook => {
      res.json(newBook);
      await newBook.authors.forEach(authorID => {
        Author.findById(authorID).then(foundAuthor => {
          foundAuthor.books.push(newBook._id);
          foundAuthor.save();
        });
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
