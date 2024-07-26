const jwt = require('jsonwebtoken');
const { get } = require('lodash');
const { v4: uuid } = require('uuid');

const Logger = require('../../shared-lib/logger');

const logger = new Logger('default');

const addRequestMetaToCtx = ctx => {
  try {
    const token = ctx.req.headers.authorization;
    let userId = 'UNAUTHENTICATED';
    if (token && token.startsWith('Bearer ')) {
      const authToken = token.slice(7, token.length);
      const decodedToken = jwt.decode(authToken);
      userId = get(decodedToken, 'userId');
    }
    const requestMeta = {
      userId,
      clientName: ctx.req.headers['apollographql-client-name'] || 'UNKNOWN',
      reqIp: ctx.req.headers['x-forwarded-for'] || ctx.req.socket.remoteAddress || ctx.req.ip || 'NA',
      requestId: uuid(),
    };
    ctx.requestMeta = requestMeta;
  } catch (error) {
    logger.error(`Error from addRequestMetaToCtx => ${error}`, null);
  }
};

module.exports = addRequestMetaToCtx;
