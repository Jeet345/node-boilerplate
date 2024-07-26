const jwt = require('jsonwebtoken');

const { JWT } = require('../../../config/config');

const generateResetToken = (payload, secret = JWT.SECRET, lifeTime = JWT.RESET_TOKEN_LIFE_TIME) => new Promise((resolve, reject) => {
  jwt.sign(payload, secret, { expiresIn: lifeTime }, (error, token) => {
    if (error) {
      return reject(error);
    }
    return resolve(token);
  });
});

module.exports = generateResetToken;
