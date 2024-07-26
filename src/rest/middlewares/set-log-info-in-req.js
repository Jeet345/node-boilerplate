const jwt = require('jsonwebtoken');
const { get } = require('lodash');
const { v4: uuid } = require('uuid');

const setLogInfoInReq = (req, res, next) => {
  const token = get(req, 'headers.authorization');

  let userId = 'UNAUTHENTICATED';
  if (token && token.startsWith('Bearer ')) {
    const authToken = token.slice(7, token.length);
    const decodedToken = jwt.decode(authToken);
    userId = get(decodedToken, 'userId');
  }

  req.logInfo = {
    reqIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'NA',
    requestId: uuid(),
    userId,
  };

  next();
};

module.exports = setLogInfoInReq;
