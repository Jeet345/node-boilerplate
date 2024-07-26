const { default: rateLimit, MemoryStore } = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

const { RATE_LIMIT, REDIS } = require('../../config/config');
const { redisClient } = require('../../redis-client');

const rateLimitMiddleware = (max = RATE_LIMIT.MAX_REQUESTS_PER_WINDOW, windowMs = RATE_LIMIT.DEFAULT_WINDOW_IN_MS) => {
  const rateLimitObj = {
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: req => {
      const { baseUrl, method } = req;
      const ip = req.headers['x-forwarded-for'] || req?.socket?.remoteAddress || req.ip || 'NA';
      const key = `${method}_${baseUrl}_${ip}`;
      return key;
    },
  };

  if (REDIS && REDIS.HOST) {
    rateLimitObj.store = new RedisStore({ sendCommand: (...args) => redisClient.call(...args) });
  } else {
    rateLimitObj.store = new MemoryStore();
  }

  const rateLimiter = rateLimit(rateLimitObj);
  return rateLimiter;
};

module.exports = rateLimitMiddleware;
