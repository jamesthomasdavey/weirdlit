const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeaturedSchema = new Schema({
  featuredDate: {
    type: Number
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'books'
  }
});

module.exports = Featured = mongoose.model('featured', FeaturedSchema);
