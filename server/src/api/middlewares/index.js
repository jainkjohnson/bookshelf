var codes = require('../../config/codes');

module.exports = {
  requiresLogin: function(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    } else {
      // HTTP 401 Unauthorized
      return res.status(401).send({ error: codes.USER.E_AUTH });
    }
  }
};
