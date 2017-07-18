const router = require('express').Router();
// internal dependencies
const codes = require('../../config/codes');
// Schemas
const User = require('../../models/user');
// Thunks
const userThunks = require('../user/thunks');

/**
 * New user Registration
 */
router.post('/register', (req, res, next) => {
  if (
    req.body.email &&
    req.body.username &&
    req.body.password
  ) {
    const userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      books: {}
    };

    // use schema.create to insert data into the db
    User.create(userData, (err, user) => {
      if (err) {
        if (err.code === 11000) {
          const startStr = 'index: ';
          const endStr = '_1 dup key';
          const dupField = err.errmsg.substring(
            err.errmsg.indexOf(startStr) + startStr.length,
            err.errmsg.lastIndexOf(endStr)
          );

          return res.status(400).send({
            error: `${dupField} ${codes.COMMON.E_DUP}`,
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
router.post('/login', (req, res, next) => {
  userThunks.authenticate(
    // param
    req.body,
    // success callback
    (user) => {
      req.session.userId = user._id;

      return res.status(200).send({ message: codes.USER.S_LOGIN });
    },
    // failure callback
    (err) => {
      if (err.status && err.error) {
        return res.status(err.status).send({ error: err.error });
      }

      // unexpected error
      next(err);
    }
  );
});

/**
 * Logout
 */
router.get('/logout', (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy((err) => {
      // Unexpected DB error
      if (err) return next(err);

      res.status(200).send({ message: codes.USER.S_LOGOUT });
    });
  }
});

// export routes that they be used in other files
module.exports = router;
