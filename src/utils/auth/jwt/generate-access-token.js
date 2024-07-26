const jwt = require('jsonwebtoken');

const { JWT } = require('../../../config/config');

const generateAccessToken = (userId, secret = JWT.SECRET, lifeTime = JWT.LIFE_TIME) => new Promise((resolve, reject) => {
  jwt.sign({ userId }, secret, { expiresIn: lifeTime }, (error, token) => {
    if (error) {
      return reject(error);
    }
    return resolve(token);
  });
});

module.exports = generateAccessToken;
