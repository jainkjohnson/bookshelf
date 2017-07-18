const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// creating the book schema with 3 properties
const BookSchema = new Schema({
  title: String,
  author: String,
  category: String,
  // Custom Id overrides mongo's native ObjectId
  _id: String
});

// export our model to use in other files
module.exports = mongoose.model('Book', BookSchema);
