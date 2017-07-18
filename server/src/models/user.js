const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config');

const UserSchema = new mongoose.Schema({
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
    required: true
  },
  books: {}
});

// hashing a password before saving it to the database
UserSchema.pre('save', (next) => {
  bcrypt.hash(this.password, config.HASH_SALT_ROUNDS, (err, hash) => {
    // Unexpected BCrypt error
    if (err) return next(err);

    this.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
