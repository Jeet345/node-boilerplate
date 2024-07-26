const jwt = require('jsonwebtoken');

const CONFIG = require('../../config/config');
const CustomGraphqlError = require('../../shared-lib/error-handler');

const { getMessage } = require('../messages');

const JWT_SECRET = CONFIG.JWT.SECRET;

const getDecodedToken = (token, localeService) => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, (error, decodedToken) => {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        return reject(new CustomGraphqlError(getMessage('SESSION_EXPIRED', localeService), 'SESSION_EXPIRED'));
      }
      return reject(new CustomGraphqlError(error));
    }

    if (!decodedToken.exp || !decodedToken.iat) {
      return reject(new CustomGraphqlError('Token had no \'exp\' or \'iat\' payload'));
    }
    return resolve(decodedToken);
  });
});

module.exports = getDecodedToken;
