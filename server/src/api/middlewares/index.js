const codes = require('../../config/codes');

module.exports = {
  requiresLogin: (req, res, next) => {
    if (req.session && req.session.userId) {
      // Authentication successfull
      return next();
    }

    // HTTP 401 Unauthorized
    res.status(401).send({ error: codes.USER.E_AUTH });
  }
};
