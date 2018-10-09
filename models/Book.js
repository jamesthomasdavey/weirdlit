const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  authors: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author"
      }
    }
  ],
  creator: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  reviews: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Book = mongoose.model("books", BookSchema);
