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
  images: {
    thumbnail: {
      type: String
    },
    small: {
      type: String
    },
    medium: {
      type: String
    }
  },
  authors: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
      }
    }
  ],
  creator: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  reviews: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    }
  ],
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
