const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  website: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

AuthorSchema.index({ name: 'text' });

module.exports = Author = mongoose.model('authors', AuthorSchema);
