const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  notifications: [
    {
      message: {
        type: String,
        required: true
      },
      link: {
        type: String
      },
      category: {
        type: String,
        required: true
      },
      book: {
        type: Schema.Types.ObjectId,
        ref: 'books'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = User = mongoose.model('users', UserSchema);
