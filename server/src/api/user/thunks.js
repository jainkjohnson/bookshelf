var codes = require('../../config/codes');
var User = require('../../models/user');

var utils = require('../../utils');

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
  var bookId = params.bookId;
  var reqBody = params.reqBody;
  var reqSession = params.reqSession;
  var overwrite = params.overwrite || false;

  return User.findOne(
    { _id: reqSession.userId },
    function(err, user) {
      // Unexpected DB error
      if (err) return onFailure(err);

      var userBooks = user.books || {};
      if (!overwrite && userBooks[bookId]) {
        // The same book already exists in user's Bookshelf.
        // HTTP 409 Conflict
        onFailure({
          status: 409,
          error: codes.BOOKSHELF.E_BOOK_DUP
        })
      } else {
        userBooks[bookId] = {
          toRead: utils.getObjOwnProp('toRead', reqBody, userBooks[bookId]),
          haveRead: utils.getObjOwnProp('haveRead', reqBody, userBooks[bookId]),
          toBuy: utils.getObjOwnProp('toBuy', reqBody, userBooks[bookId]),
          nowReading: utils.getObjOwnProp('nowReading', reqBody, userBooks[bookId]),
          rating: utils.getObjOwnProp('rating', reqBody, userBooks[bookId]),
        };

        return User.findOneAndUpdate(
          { _id: reqSession.userId },
          { $set: { books: userBooks } },
          function(err) {
            // Unexpected DB error
            if (err) return onFailure(err);

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
  return User.findOne({ _id: reqSession.userId }, function(err, user) {
    // Unexpected error
    if (err) return onFailure(err);

    onSuccess(user.books || {});
  });
}

module.exports = {
  updateUserBookShelf,
  getUserBooks
};
