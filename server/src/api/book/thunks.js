const shortid = require('shortid');
const Book = require('../../models/book');

/**
 * A callback function that should be executed if everything goes right.
 * @callback onSuccessCallback
 * @param {*}
 */

/**
 * A callback function that should be executed if something goes wrong.
 * @callback onFailureCallback
 * @param {*}
 */

/**
 * Searches `books` collection for books with specified Ids
 * @param {Object[]} bookIds
 * @param {onSuccessCallback} onSuccess
 * @param {onFailureCallback} onFailure
 */
function getBooksById(bookIds, onSuccess, onFailure) {
  Book.find({
    _id: { $in: bookIds }
  }).exec((err, books = []) => {
    // Unexpected DB error
    if (err) return onFailure(err);

    onSuccess(books);
  });
}

/**
 * Create a new book record in the `books` collection
 * @param {Object} reqBody
 * @param {onSuccessCallback} onSuccess
 * @param {onFailureCallback} onFailure
 */
function addNewBook(reqBody, onSuccess, onFailure) {
  const newBook = new Book();

  newBook.title = reqBody.title;
  newBook.author = reqBody.author;
  newBook.category = reqBody.category;
  newBook._id = shortid.generate();

  newBook.save((err, book) => {
    // Unexpected DB error
    if (err) return onFailure(err);

    onSuccess(book._id);
  });
}

/**
 * Update an existing book record in the `books` collection
 * If it doesn't exists, new record is created.
 * @param {Object} params
 * @param {Object} params.reqBody
 * @param {Object} params.reqParams
 * @param {onSuccessCallback} onSuccess
 * @param {onFailureCallback} onFailure
 */
function updateBook(params, onSuccess, onFailure) {
  const reqBody = params.reqBody;
  const reqParams = params.reqParams;

  // find a book to update
  Book.findOneAndUpdate(
    { _id: reqParams.id },
    {
      $set: {
        title: reqBody.title,
        author: reqBody.author,
        category: reqBody.category,
      }
    },
    {
      upsert: true,
      new: true,
    },
    (err, newBook) => {
      if (err) return onFailure(err);

      onSuccess(newBook);
    }
  );
}

/**
 * Check if a book exists in the `books` collection.
 * Tries to find a book that matches the below criteria:
 *  - Matches `reqBody._id`
 *      OR
 *  - Matches `reqBody.title` && `reqBody.author`
 * @param {Object} reqBody
 * @param {string} reqBody._id
 * @param {string} reqBody.title
 * @param {string} reqBody.author
 * @param {onSuccessCallback} onSuccess
 * @param {onFailureCallback} onFailure
 */
function checkIfBookExists(reqBody, onSuccess, onFailure) {
  Book.findOne(
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
    (err, book) => {
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
  getBooksById,
  updateBook
};
