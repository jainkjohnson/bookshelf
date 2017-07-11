// requiring express routes
var router = require('express').Router();
var shortid = require('shortid');

// require our book Schema
var Book = require('../models/book');

// GET all books
router.get('/books', function(req, res, next) {
  Book.find({}).exec(function(err, books) {
    // return an error when it occurs
    if (err) return next(err);
    // return the books object
    res.send(books);
  });
});

// POST or add a new book
router.post('/add', function(req, res, next) {
  // create a new book instance
  var newBook = new Book();

  // get the submitted book attributes
  newBook.title = req.body.title;
  newBook.author = req.body.author;
  newBook.category = req.body.category;
  newBook.rating = req.body.rating;
  newBook._id = shortid.generate(); // Custom short UID

  newBook.save(function(err, book) {
    // incase of an error return it
    if (err) return next(err);
    // return success feedback
    res.status(200).send({
      message: 'Book successfully added',
      _id: newBook._id
    });
  });
});

router.put('/update/:id', function(req, res, next) {
  // find a book to update
  Book.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        category: req.body.category,
        rating: req.body.rating
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

router.delete('/delete/:id', function(req, res, next) {
  Book.findOneAndRemove(
    { _id: req.params.id },
    function(err, book) {
      if (err) return next(err);

      res.status(200).send({
        message: 'Book successfully deleted'
      });
    }
  );
});

// export routes that they be used in other files
module.exports = router;
