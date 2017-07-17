// 3rd-party dependencies
var mongoose = require('mongoose');
var router = require('express').Router();
var shortid = require('shortid');
// internal dependencies
var codes = require('../../config/codes');
var mw = require('../middlewares')
// Schemas
var Book = require('../../models/book');
var User = require('../../models/user');
// Thunks
var bookThunks = require('./thunks');
var userThunks = require('../user/thunks');

// GET all books
router.get('/all_books', function(req, res, next) {
  Book.find({}).exec(function(err, books) {
    // return an error when it occurs
    if (err) return next(err);
    // return the books object
    res.send(books);
  });
});

// GET all user books
router.get('/my_books', mw.requiresLogin, function(req, res, next) {
  var successCallback = function(userBooks) {
    var bookIds = Object.keys(userBooks);

    return bookThunks.getBooksById(
      bookIds,
      // onSuccess callback
      function(books) {
        var conjoinedBooks = books.map(function(book) {
          // book.toJSON() is called to filter out inherited properties
          // of 'book' (as it is a mongo collection object)
          return Object.assign({}, userBooks[book._id], book.toJSON());
        });

        res.send(conjoinedBooks);
      },
      // onFailure callback
      next
    );
  };

  return userThunks.getUserBooks(req.session, successCallback, next);
});

router.post('/add', mw.requiresLogin, function(req, res, next) {
  var successCallback = function(bookId) {
    userThunks.updateUserBookShelf(
      // params
      {
        reqBody: req.body,
        reqSession: req.session,
        bookId: bookId
      },
      // success callback
      function(bookshelfBookId) {
        res.status(200).send({
          message: codes.BOOK.S_ADD,
          _id: bookshelfBookId
        });
      },
      // failure callback
      function(err) {
        if (err.status && err.error) {
          return res.status(err.status).send({ error: err.error });
        }

        // Unexpected error
        next(err);
      }
    );
  };

  return bookThunks.checkIfBookExists(
    // param
    req.body,
    // success callback
    function(bookId) {
      // Book with id already exists
      if (bookId) return successCallback(bookId);

      // Book does not exists, hence add new book record
      bookThunks.addNewBook(req.body, successCallback, next);
    },
    // Failure callback
    next
  );
});

router.put('/update/:id', mw.requiresLogin, function(req, res, next) {
  // find a book to update
  Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
      }
    },
    {
      upsert: true,
      new: true,
    },
    function(err, newBook) {
      if (err) return next(err);

      res.status(200).send({
        success: 'Book successfully updated',
        book: newBook
      });
    }
  );
});

router.delete('/delete/:id', mw.requiresLogin, function(req, res, next) {
  Book.findOneAndRemove(
    { _id: req.params.id },
    function(err, book) {
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
