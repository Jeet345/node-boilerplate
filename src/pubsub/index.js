const { RedisPubSub } = require('graphql-redis-subscriptions');
const { PubSub } = require('graphql-subscriptions');
const Redis = require('ioredis');

const defaultLogger = require('../logger');
const { redisOptions } = require('../redis-client');

let pubsub = new PubSub();

if (redisOptions.host) {
  const redisPubSub = new RedisPubSub({
    publisher: new Redis(redisOptions),
    subscriber: new Redis(redisOptions),
  });
  pubsub = redisPubSub;
  defaultLogger.debug('USING REDIS PUBSUB', {});
}

const pubsubEvents = {
  POST_CREATED: 'POST_CREATED',
};

module.exports = {
  pubsub,
  pubsubEvents,
};
