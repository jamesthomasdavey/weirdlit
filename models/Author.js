const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  books: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Author = mongoose.model("authors", AuthorSchema);
