// 3rd-party dependencies
const router = require('express').Router();
// internal dependencies
const codes = require('../../config/codes');
const midWare = require('../middlewares');
// Schemas
const Book = require('../../models/book');
// Thunks
const bookThunks = require('./thunks');
const userThunks = require('../user/thunks');

// GET all books
router.get('/all_books', (req, res, next) => {
  Book.find({}).exec((err, books) => {
    // return an error when it occurs
    if (err) return next(err);
    // return the books object
    res.send(books);
  });
});

 /**
 * Get all books in user's Bookshelf
 * @name getMyBooks
 *
 *    method: GET
 *    endpoint: '/book/my_books'
 *    requiresLogin: yes
 *    response:
 *      {
 *        result: [
 *          { _id: "bookId123", ...},
 *          ...
 *        ]
 *      }
 */
router.get('/my_books', midWare.requiresLogin, (req, res, next) => {
  const successCallback = (userBooks) => {
    const bookIds = Object.keys(userBooks);

    bookThunks.getBooksById(
      bookIds,
      // onSuccess callback
      (books) => {
        const conjoinedBooks = books.map((book) =>
          // book.toJSON() is called to filter out inherited properties
          // of 'book' (as it is a mongo collection object)
          Object.assign({}, book.toJSON(), userBooks[book._id])
        );

        res.send(conjoinedBooks);
      },
      // onFailure callback
      next
    );
  };

  userThunks.getUserBooks(req.session, successCallback, next);
});

 /**
 * Add book to `books` collection as well as user's Bookshelf
 * @name addBook
 *
 *    method: POST
 *    endpoint: '/book/add'
 *    requiresLogin: yes
 *    response:
 *      {
 *        message: "...",
 *        result: "bookId123"
 *      }
 */
router.post('/add', midWare.requiresLogin, (req, res, next) => {
  const successCallback = (bookId) => {
    userThunks.updateUserBookShelf(
      // params
      {
        reqBody: req.body,
        reqSession: req.session,
        bookId
      },
      // success callback
      (bookshelfBookId) => {
        res.status(200).send({
          message: codes.BOOK.S_ADD,
          result: bookshelfBookId
        });
      },
      // failure callback
      (err) => {
        if (err.status && err.error) {
          return res.status(err.status).send({ error: err.error });
        }

        // Unexpected error
        next(err);
      }
    );
  };

  bookThunks.checkIfBookExists(
    // param
    req.body,
    // success callback
    (bookId) => {
      // Book with id already exists
      if (bookId) return successCallback(bookId);

      // Book does not exists, hence add new book record
      bookThunks.addNewBook(req.body, successCallback, next);
    },
    // Failure callback
    next
  );
});

 /**
 * Add book to `books` collection as well as user's Bookshelf
 * @name updateBook
 *
 *    method: PUT
 *    endpoint: '/book/update/:id'
 *    requiresLogin: yes
 *    response:
 *      {
 *         message: "...",
 *         result: { _id: "bookId123", ...}
 *      }
 */
router.put('/update/:id', midWare.requiresLogin, (req, res, next) => {
  const successCallback = (newBook) => {
    userThunks.updateUserBookShelf(
      {
        reqBody: req.body,
        reqSession: req.session,
        bookId: newBook._id,
        overwrite: true
      },
      (bookId, newUserBook) => {
        res.status(200).send({
          message: codes.BOOK.S_UPD,
          result: Object.assign({}, newBook.toJSON(), newUserBook)
        });
      },
      next
    );
  };

  bookThunks.updateBook(
    {
      reqBody: req.body,
      reqParams: req.params
    },
    // success callback
    successCallback,
    // failure callback
    next
  );
});

router.delete('/delete/:id', midWare.requiresLogin, (req, res, next) => {
  Book.findOneAndRemove(
    { _id: req.params.id },
    (err, book) => {
      if (err) return next(err);

      if (!book) {
        // Return 404 error if no book matched `req.params.id`
        return res.status(404).send({
          error: codes.BOOK.E_NOT_FOUND
        });
      }

      // book successfully deleted
      return res.status(200).send({
        message: codes.BOOK.S_BOOK_DEL
      });
    }
  );
});

// export routes that they be used in other files
module.exports = router;
