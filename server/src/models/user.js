var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  books: {
    haveRead: Array,
    toBuy: Array,
    toRead: Array
  },
});

module.exports = mongoose.model('User', UserSchema);
