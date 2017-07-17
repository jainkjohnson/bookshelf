var shortid = require('shortid');
var codes = require('../../config/codes');
var Book = require('../../models/book');

/**
 * Searches `books` collection for books with specified Ids
 * @param {Array} bookIds
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function getBooksById(bookIds, onSuccess, onFailure) {
  return Book.find({
    _id: { $in: bookIds }
  }).exec(function(err, books = []) {
    // Unexpected DB error
    if (err) return onFailure(err);

    onSuccess(books);
  });
}

/**
 * Create a new book record in the `books` collection
 * @param {Object} reqBody
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function addNewBook(reqBody, onSuccess, onFailure) {
  var newBook = new Book();
  newBook.title = reqBody.title;
  newBook.author = reqBody.author;
  newBook.category = reqBody.category;
  newBook._id = shortid.generate();

  newBook.save(function(err, book) {
    // Unexpected DB error
    if (err) return onFailure(err);

    onSuccess(newBook._id);
  });
}

/**
 * Check if a book exists in the `books` collection.
 * Tries to find a book that matches the below criteria:
 *  - Matches `reqBody._id`
 *      OR
 *  - Matches `reqBody.title` && `reqBody.author`
 *
 * @param {Object} reqBody
 * @param {String} reqBody._id
 * @param {String} reqBody.title
 * @param {String} reqBody.author
 * @param {Function} onSuccess
 * @param {Function} onFailure
 */
function checkIfBookExists(reqBody, onSuccess, onFailure) {
  return Book.findOne(
    {
      $or: [
        { _id: reqBody._id },
        {
          $and: [
            { title: reqBody.title },
            { author: reqBody.author }
          ]
        }
      ]
    },
    function(err, book) {
      // Unexpected DB error
      if (err) return onFailure(err);

      // Invokes success callback with book ID if book exists
      onSuccess(book && book._id);
    }
  );
}

module.exports = {
  checkIfBookExists,
  addNewBook,
  getBooksById
};
