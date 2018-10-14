const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  text: {
    type: String,
    required: true
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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Review = mongoose.model('reviews', ReviewSchema);
