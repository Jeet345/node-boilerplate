const basicAuth = require('express-basic-auth');

const { BASIC_AUTH_CONFIG } = require('../../config/config');

const basicAuthorizer = async (username, password, cb) => {
  const userMatches = basicAuth.safeCompare(username, BASIC_AUTH_CONFIG.USERNAME);
  const passwordMatches = basicAuth.safeCompare(password, BASIC_AUTH_CONFIG.PASSWORD);

  const result = userMatches && passwordMatches;
  if (result) {
    return cb(null, true);
  }

  return cb(null, false);
};

// Middleware to implement basic authentication
const basicAuthMiddleware = basicAuth({
  authorizer: basicAuthorizer,
  authorizeAsync: true,
  challenge: true,
});

module.exports = basicAuthMiddleware;
