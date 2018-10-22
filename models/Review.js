const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  rating: {
    type: Number,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'books'
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date
  }
});

module.exports = Review = mongoose.model('reviews', ReviewSchema);
