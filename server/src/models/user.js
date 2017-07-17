var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var codes = require('../config/codes');

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
    required: true
  },
  books: {}
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  })
});

/**
 * Authenticate user credentials against database
 */
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        // Wrong email
        return callback(codes.USER.E_EMAIL);
      }

      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          // Wrong password
          return callback(codes.USER.E_PWD);
        }
      })
    });
}

/**
 * The model variable created here is used inside the method
 * UserSchema.statics.authenticate (hoisted); [TODO] rethink
 */
var User = mongoose.model('User', UserSchema);
module.exports = User;
