var router = require('express').Router();
var User = require('../models/user');

router.post('/login', function(req, res, next) {
  if (
    req.body.email &&
    req.body.username &&
    req.body.password
  ) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        if (err.code === 11000) {
          var startStr = 'index: ';
          var endStr = '_1 dup key';
          var dupField = err.errmsg.substring(
            err.errmsg.indexOf(startStr) + startStr.length,
            err.errmsg.lastIndexOf(endStr)
          );

          return res.status(400).send({ message: dupField + ' already exists' });
        }

        // Unhandled error
        return next(err);
      }

      return res.status(200).send({ message: 'Sign-up successfull' });
    });
  } else {
    return res.status(400).send({ message: 'Invalid request body' });
  }
});

// export routes that they be used in other files
module.exports = router;
