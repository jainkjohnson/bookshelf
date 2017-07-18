const router = require('express').Router();
// internal dependencies
const codes = require('../../config/codes');
// Thunks
const userThunks = require('../user/thunks');

/**
 * New user Registration
 * @name registerUser
 *
 *    method: POST
 *    endpoint: '/user/register'
 *    request.body:
 *      {
 *        email: 'email@domain.com'
 *        username: 'unique-username'
 *        password: 'is_A_secret'
 *      }
 *    response:
 *      {
 *        message: "..."
 *      }
 */
router.post('/register', (req, res, next) => {
  userThunks.registerUser(
    // param
    req.body,
    // success callback
    (userId) => {
      req.session.userId = userId;
      res.status(200).send({ message: codes.USER.S_REG });
    },
    // error callback
    (err) => {
      if (err.status && err.error) {
        return res.status(err.status).send({ error: err.error });
      }

      // Unexpected DB error
      next(err);
    }
  );
});

/**
 * New user Registration
 * @name registerUser
 *
 *    method: POST
 *    endpoint: '/user/login'
 *    request.body:
 *      {
 *        email: 'email@domain.com' || username: 'unique-username'
 *        password: 'is_A_secret'
 *      }
 *    response:
 *      {
 *        message: "..."
 *      }
 */
router.post('/login', (req, res, next) => {
  userThunks.authenticateUser(
    // param
    req.body,
    // success callback
    (user) => {
      req.session.userId = user._id;
      res.status(200).send({ message: codes.USER.S_LOGIN });
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
 * New user Registration
 * @name registerUser
 *
 *    method: GET
 *    endpoint: '/user/logout'
 *    response:
 *      {
 *        message: "..."
 *      }
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
