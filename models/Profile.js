const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    max: 40
  },
  favoriteBook: {
    type: String
  },
  location: {
    type: String
  },
  bio: {
    type: String
  },
  hasRead: [
    {
      type: Schema.Types.ObjectId,
      ref: 'books'
    }
  ],
  social: {
    goodreads: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
