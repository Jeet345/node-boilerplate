const winston = require('winston');

const CONFIG = require('../../config/config');

const { format, transports } = winston;

// TODO: ADD DATADOG AGENT OR IMPLEMENT AGENTLESS LOGGING
const defaultLoggerConfig = {
  level: CONFIG.LOG_LEVEL,
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
  ],
};

const loggerObj = winston.createLogger({
  ...defaultLoggerConfig,
});

class Logger {
  constructor(service) {
    this.service = service;
  }

  log(message, ctx = {}, level = 'info') {
    loggerObj.child({
      requestId: ctx?.requestId,
      reqIp: ctx?.reqIp,
      userId: ctx?.userId,
      clientName: ctx?.clientName,
      service: this.service,
    })[level](message);
  }

  info(message, ctx = {}) {
    this.log(message, ctx, 'info');
  }

  error(message, ctx = {}) {
    this.log(message, ctx, 'error');
  }

  debug(message, ctx = {}) {
    this.log(message, ctx, 'debug');
  }
}

module.exports = Logger;
