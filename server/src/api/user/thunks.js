const bcrypt = require('bcrypt');
const config = require('../../config');
const codes = require('../../config/codes');
const User = require('../../models/user');
const utils = require('../../utils');

/**
 * Register new user:
 * Create a new record under `users` collection
 * @param {Object} reqBody
 * @param {String} reqBody.email
 * @param {String} reqBody.username
 * @param {String} reqBody.password
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function registerUser(reqBody, onSuccess, onFailure) {
  const email = reqBody.email;
  const username = reqBody.username;
  const password = reqBody.password;

  if (email && username && password) {
    // [TODO]: Move the below code block to a 'pre' save hook
    bcrypt.hash(password, config.HASH_SALT_ROUNDS, (err, hash) => {
      // Unexpected BCrypt error
      if (err) return onFailure(err);

      // use schema.create to insert data into the db
      User.create(
        { email, username, password: hash, books: {} },
        (createErr, user) => {
          if (err) {
            // Handle known errors here
            if (err.code === 11000) {
              const startStr = 'index: ';
              const endStr = '_1 dup key';
              const dupField = err.errmsg.substring(
                err.errmsg.indexOf(startStr) + startStr.length,
                err.errmsg.lastIndexOf(endStr)
              );

              // HTTP 400 Bad Request
              return onFailure({
                status: 400,
                error: `${dupField} ${codes.COMMON.E_DUP}`
              });
            }

            // Unhandled error
            return onFailure(createErr);
          }

          onSuccess(user._id);
        }
      );
    });
  } else {
    // At least one of the required fields in `reqBody` was not good
    // HTTP 400 Bad Request
    onFailure({
      status: 400,
      error: codes.COMMON.E_REQ_BODY
    });
  }
}

/**
 * Authenticate user credentials against database
 * @param {Object} reqBody
 * @param {String} reqBody.email
 * @param {String} reqBody.username
 * @param {String} reqBody.password
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function authenticateUser(reqBody, onSuccess, onFailure) {
  const email = reqBody.email;
  const username = reqBody.username;
  const password = reqBody.password;

  if ((email || username) && password) {
    User.findOne(
      {
        $or: [{ email }, { username }]
      }
    ).exec((err, user) => {
      // Unexpected DB error
      if (err) return onFailure(err);

      if (!user) {
        // No user record found for that email
        return onFailure({
          // HTTP 401 Unauthorized
          status: 401,
          error: email ? codes.USER.E_EMAIL : codes.USER.E_USRNAME
        });
      }

      bcrypt.compare(password, user.password, (bcryptErr, result) => {
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
  } else {
    // At least one of the required fields in `reqBody` was not good
    // HTTP 400 Bad Request
    onFailure({
      status: 400,
      error: codes.COMMON.E_REQ_BODY
    });
  }
}

/**
 * Update user's Bookshelf with new book details.
 * @param {Object} params
 * @param {String} params.bookId
 * @param {Object} params.reqBody
 * @param {Object} params.reqSession
 * @param {Boolean} params.add - set this `true` to 'add' new book
 * @param {Boolean} params.overwrite - set this `true` to 'update' existing book
 * @param {Boolean} params.remove - set this `true` to 'delete' existing book
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function updateUserBookShelf(params, onSuccess, onFailure) {
  const bookId = params.bookId;
  const reqBody = params.reqBody;
  const reqSession = params.reqSession;
  const overwrite = params.overwrite || false;
  const remove = params.remove || false;
  const add = params.add || true;

  return User.findOne(
    { _id: reqSession.userId },
    (userFindErr, user) => {
      // Unexpected DB error
      if (userFindErr) return onFailure(userFindErr);

      const userBooks = user.books || {};

      // Check if the bookId already exists in user's bookshelf
      if (utils.isObject(userBooks[bookId])) {
        if (remove === true) {
          // If there is an existing book and `remvove` flag is true
          delete userBooks[bookId];
        } else if (overwrite === true) {
          userBooks[bookId] = utils.getObjOwnProps(
            config.USER_BOOK_SCHEMA_PROPS,
            // new values for book obj properties
            reqBody,
            // keep old values if new values are not specified
            userBooks[bookId]
          );
        } else {
          // Both `overwrite` and `remove` flags are `false` implies that
          // user is trying to 'add' an existing book in user's bookshelf.
          // But same bookId already exists in user's Bookshelf.
          // HTTP 409 Conflict
          return onFailure({
            status: 409,
            error: codes.BOOK.E_BOOKSHELF_DUP
          });
        }
      } else if (remove === true) {
        // Return error if no book matched `req.params.id`
        // HTTP 404 Not Found
        return onFailure({
          status: 404,
          error: codes.BOOK.E_NOT_FOUND
        });
      } else if (add === true) {
        // bookId does not exists in user's bookshelf, hence create it
        userBooks[bookId] = utils.getObjOwnProps(
          config.USER_BOOK_SCHEMA_PROPS,
          reqBody,
          {}
        );
      }

      // bookId has been added or delete
      User.findOneAndUpdate(
        { _id: reqSession.userId },
        { $set: { books: userBooks } },
        (updateErr) => {
          // Unexpected DB error
          if (updateErr) return onFailure(updateErr);

          onSuccess(bookId, userBooks[bookId]);
        }
      );
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
  authenticateUser,
  registerUser
};
