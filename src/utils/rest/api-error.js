const status = require('http-status');

class ApiError extends Error {
  constructor(message, statusCode = status.INTERNAL_SERVER_ERROR, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
