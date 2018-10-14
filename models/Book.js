const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  identifiers: {
    googleId: {
      type: String,
      required: true
    },
    isbn10: {
      type: String
    },
    isbn13: {
      type: String
    }
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'authors'
    }
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'reviews'
    }
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

module.exports = Book = mongoose.model('books', BookSchema);
