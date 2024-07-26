const jwt = require('jsonwebtoken');

const { JWT } = require('../../../config/config');
const CustomGraphqlError = require('../../../shared-lib/error-handler');
const { getMessage } = require('../../messages');

const decodeToken = (token, secret = JWT.SECRET, checkExpiry = true) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (error, decodedToken) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        return reject(new CustomGraphqlError(getMessage('SESSION EXPIRED'), 'SESSION_EXPIRED'));
      }
      return reject(error);
    }

    if (checkExpiry === true && (!decodedToken.exp || !decodedToken.iat)) {
      return reject(new CustomGraphqlError(getMessage('TOKEN_HAS_NO_EXPIRY')));
    }

    return resolve(decodedToken);
  });
});

module.exports = decodeToken;
