const jwt = require('jsonwebtoken');

const { JWT } = require('../../../config/config');

const generateRefreshToken = (userId, secret = JWT.SECRET) => new Promise((resolve, reject) => {
  jwt.sign({ userId }, secret, (error, token) => {
    if (error) {
      return reject(error);
    }
    return resolve(token);
  });
});

module.exports = generateRefreshToken;
