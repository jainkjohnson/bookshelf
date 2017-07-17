var router = require('express').Router();
var codes = require('../../config/codes');
var User = require('../../models/user');

/**
 * New user Registration
 */
router.post('/register', function(req, res, next) {
  if (
    req.body.email &&
    req.body.username &&
    req.body.password
  ) {
    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      books: {}
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

          return res.status(400).send({
            error: dupField + ' ' + codes.COMMON.E_DUP,
          });
        }

        // Unhandled error
        return next(err);
      }

      req.session.userId = user._id;
      return res.status(200).send({ message: codes.USER.S_REG });
    });
  } else {
    return res.status(400).send({ error: codes.COMMON.E_REQ_BODY });
  }
});

/**
 * Existing user Login
 */
router.post('/login', function(req, res, next) {
  User.authenticate(req.body.email, req.body.password, function (error, user) {
    if (error || !user) {
      return res.status(401).send({
        error: error || codes.USER.E_EMAIL + ' or ' + codes.USER.E_PWD
      });
    } else {
      req.session.userId = user._id;
      return res.status(200).send({ message: codes.USER.S_LOGIN });
    }
  });
})

/**
 * Logout
 */
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.status(200).send({ message: codes.USER.S_LOGOUT });
      }
    });
  }
});

// export routes that they be used in other files
module.exports = router;
