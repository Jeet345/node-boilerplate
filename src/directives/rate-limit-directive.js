/* eslint-disable consistent-return */
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');
const { getGraphQLRateLimiter, InMemoryStore, RedisStore } = require('graphql-rate-limit');

const CONFIG = require('../config/config');
const { redisClient } = require('../redis-client');
const CustomGraphqlError = require('../shared-lib/error-handler');
const { getMessage } = require('../utils/messages');

let rateLimitStore = new InMemoryStore();

if (CONFIG.REDIS.HOST) {
  rateLimitStore = new RedisStore(redisClient);
}

const rateLimitConfig = {
  identifyContext: context => context.req.headers['x-forwarded-for'] || context.req.socket.remoteAddress || context.req.ip, // TODO: change identifyContext according to your usage
  formatError: () => getMessage('RATE_LIMIT'),
  store: rateLimitStore,
};

const rateLimiter = getGraphQLRateLimiter(rateLimitConfig);

const rateLimitDirectiveTransformer = (schema, directiveName) => mapSchema(schema, {
  // Executes once for each object field in the schema
  [MapperKind.OBJECT_FIELD]: fieldConfig => {
    // Check whether this field has the specified directive
    const rateLimitDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

    if (rateLimitDirective) {
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        const { localeService } = context;

        const error = await rateLimiter({
          source, args, context, info,
        }, { max: rateLimitDirective.max, window: rateLimitDirective.window });

        if (error) {
          throw new CustomGraphqlError(getMessage('RATE_LIMIT', localeService), 'TO_MANY_REQUESTS');
        }
        return resolve(source, args, context, info);
      };
      return fieldConfig;
    }
  },
});

module.exports = rateLimitDirectiveTransformer;
