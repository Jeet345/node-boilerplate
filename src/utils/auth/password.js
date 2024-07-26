const crypto = require('crypto');

const { ENCRYPTION } = require('../../config/config');

const Logger = require('../../shared-lib/logger');

const logger = new Logger('password');

class Password {
  constructor(salt = ENCRYPTION.PASSWORD_SALT, iterations = ENCRYPTION.PASSWORD_ITERATIONS) {
    this.salt = salt;
    this.iterations = iterations;
  }

  generatePassword(passwordString) {
    try {
      const hash = crypto.pbkdf2Sync(passwordString, this.salt, this.iterations, 64, 'sha512').toString('hex');
      return hash;
    } catch (error) {
      logger.error(`Error from generatePassword => ${error}`, {});
      throw error;
    }
  }

  comparePassword(password, hashedPassword) {
    try {
      const encryptedPassword = crypto.pbkdf2Sync(password, this.salt, this.iterations, 64, 'sha512').toString('hex');
      return encryptedPassword === hashedPassword;
    } catch (error) {
      logger.error(`Error from comparePassword => ${error}`, {});
      throw error;
    }
  }
}

const password = new Password();

module.exports = password;
