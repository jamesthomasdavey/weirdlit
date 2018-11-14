const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

TagSchema.index({ name: 'text' });

module.exports = Tag = mongoose.model('tags', TagSchema);
