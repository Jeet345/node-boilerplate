const Sentry = require('@sentry/node');
const status = require('http-status');

const { getMessage } = require('../../utils/messages');
const ApiError = require('../../utils/rest/api-error');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { localeService } = req;
  const { statusCode = status.INTERNAL_SERVER_ERROR, message = getMessage('INTERNAL_SERVER_ERROR', localeService) } = err;
  const response = { statusCode, message };

  if (err instanceof ApiError) {
    return res.status(statusCode).send(response);
  }

  Sentry.captureException(err);
  response.message = getMessage('INTERNAL_SERVER_ERROR', localeService);
  return res.status(statusCode).send(response);
};

module.exports = errorHandler;
