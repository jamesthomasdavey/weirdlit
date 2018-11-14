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
      type: String
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
      type: Schema.Types.ObjectId,
      ref: 'authors'
    }
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isRejected: {
    type: Boolean,
    default: false
  },
  publishedDate: {
    type: Date
  },
  pageCount: {
    type: Number
  },
  rating: {
    type: Number
  },
  ratingDisplay: {
    type: Boolean,
    default: false
  },
  description: {
    type: String
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'tags'
    }
  ],
  image: {
    original: {
      type: String
    },
    smallSquare: {
      type: String
    },
    bigSqure: {
      type: String
    },
    smallThumbnail: {
      type: String
    },
    mediumThumbnail: {
      type: String
    },
    largeThumbnail: {
      type: String
    },
    hugeThumbnail: {
      type: String
    }
  }
});

BookSchema.index({ title: 'text', subtitle: 'text' });

module.exports = Book = mongoose.model('books', BookSchema);
