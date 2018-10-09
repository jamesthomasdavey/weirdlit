const mongoose = require("mongoose");
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
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  book: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book"
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Review = mongoose.model("reviews", ReviewSchema);
