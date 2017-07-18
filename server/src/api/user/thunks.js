const bcrypt = require('bcrypt');
const config = require('../../config');
const codes = require('../../config/codes');
const User = require('../../models/user');
const utils = require('../../utils');

/**
 * Authenticate user credentials against database
 * @param {Object} reqBody
 * @param {String} reqBody.email
 * @param {String} reqBody.password
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function authenticate(reqBody, onSuccess, onFailure) {
  User.findOne(
    { email: reqBody.email }
  ).exec((err, user) => {
    // Unexpected DB error
    if (err) return onFailure(err);

    if (!user) {
      // No user record found for that email
      return onFailure({
        // HTTP 401 Unauthorized
        status: 401,
        error: codes.USER.E_EMAIL
      });
    }

    bcrypt.compare(reqBody.password, user.password, (bcryptErr, result) => {
      // Unexpected DB error
      if (bcryptErr) return onFailure(bcryptErr);

      if (result === true) {
        // Password validation succeeded
        return onSuccess(user);
      }

      // Wrong password
      onFailure({
        // HTTP 401 Unauthorized
        status: 401,
        error: codes.USER.E_PWD
      });
    });
  });
}

/**
 * Update user's Bookshelf with new book details.
 * @param {Object} params
 * @param {String} params.bookId
 * @param {Object} params.reqBody
 * @param {Object} params.reqSession
 * @param {Boolean} params.overwrite
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function updateUserBookShelf(params, onSuccess, onFailure) {
  const bookId = params.bookId;
  const reqBody = params.reqBody;
  const reqSession = params.reqSession;
  const overwrite = params.overwrite || false;

  return User.findOne(
    { _id: reqSession.userId },
    (userFindErr, user) => {
      // Unexpected DB error
      if (userFindErr) return onFailure(userFindErr);

      const userBooks = user.books || {};

      if (!overwrite && userBooks[bookId]) {
        // The same book already exists in user's Bookshelf.
        // HTTP 409 Conflict
        onFailure({
          status: 409,
          error: codes.BOOK.E_BOOKSHELF_DUP
        });
      } else {
        userBooks[bookId] = utils.getObjOwnProps(
          config.USER_BOOK_SCHEMA_PROPS,
          reqBody,
          userBooks[bookId]
        );

        return User.findOneAndUpdate(
          { _id: reqSession.userId },
          { $set: { books: userBooks } },
          (updateErr) => {
            // Unexpected DB error
            if (updateErr) return onFailure(updateErr);

            onSuccess(bookId, userBooks[bookId]);
          }
        );
      }
    }
  );
}

/**
 * Get all books in user's Bookshelf
 * @param {Object} reqSession
 * @param {String} reqSession.userId
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function getUserBooks(reqSession, onSuccess, onFailure) {
  return User.findOne({ _id: reqSession.userId }, (err, user) => {
    // Unexpected error
    if (err) return onFailure(err);

    onSuccess(user.books || {});
  });
}

module.exports = {
  updateUserBookShelf,
  getUserBooks,
  authenticate
};
