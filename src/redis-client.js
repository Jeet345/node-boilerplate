const Redis = require('ioredis');

const { REDIS } = require('./config/config');
const defaultLogger = require('./logger');

const redisOptions = {
  host: REDIS.HOST,
  port: REDIS.PORT,
  password: REDIS.PASSWORD,
};

if (REDIS.TLS) {
  redisOptions.tls = {};
}

const redisClient = new Redis(redisOptions);

const purgeCacheByKey = (pattern, ctx) => new Promise((resolve, reject) => {
  const stream = redisClient.scanStream({
    match: `${pattern}*`,
  });
  stream.on('data', keys => {
    if (keys.length) {
      const pipeline = redisClient.pipeline();
      keys.forEach(key => {
        pipeline.del(key);
      });
      pipeline.exec();
    }
  });
  stream.on('end', () => {
    defaultLogger.info(`purgeCacheByKey completed for pattern ${pattern}`, ctx);
    return resolve();
  });
  stream.on('error', exec => {
    defaultLogger.error(`Error from purgeCacheByKey ${pattern} : ${exec}`, ctx);
    return reject(exec);
  });
});

const getCachedData = async key => {
  try {
    const cachedUser = await redisClient.get(key);
    if (cachedUser) {
      const cachedUserData = JSON.parse(cachedUser);
      defaultLogger.debug(`REDIS_CACHE_HIT > ${key}`, null);
      return cachedUserData;
    }
    return null;
  } catch (error) {
    defaultLogger.error(`Error getting cached data for key ${key} : ${error}`, null);
    return null;
  }
};

const setCacheData = async (key, data = {}, expiry = 3600) => {
  try {
    const payload = JSON.stringify(data);
    await redisClient.setex(key, expiry, payload);
    defaultLogger.debug(`REDIS_CACHE_WRITE > ${key}`, null);
    return null;
  } catch (error) {
    defaultLogger.error(`Error writing cach for key ${key}  : ${error}`, null);
    return null;
  }
};

module.exports = {
  redisClient,
  redisOptions,
  purgeCacheByKey,
  getCachedData,
  setCacheData,
};
