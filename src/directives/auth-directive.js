/* eslint-disable import/no-extraneous-dependencies */
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');

const { get } = require('lodash');

const defaultLogger = require('../logger');
const CustomGraphqlError = require('../shared-lib/error-handler');
const getUser = require('../utils/auth/get-user');
const { getMessage } = require('../utils/messages');

const authDirectiveTransformer = (schema, directiveName) => mapSchema(schema, {
  [MapperKind.OBJECT_FIELD]: fieldConfig => {
    const authDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
    if (authDirective) {
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        try {
          const { localeService, req } = context;
          const authToken = get(context, 'req.headers.authorization');

          const user = await getUser(authToken, localeService);
          if (!user) {
            throw new CustomGraphqlError(getMessage('UNAUTHORIZED', localeService), 'UNAUTHORIZED');
          }

          // CHECK IF USER IS BLOCKED BY ADMIN
          if (user.isActive === false) {
            throw new CustomGraphqlError(getMessage('USER_IS_DEACTIVATED', localeService), 'USER_DEACTIVATED');
          }

          req.user = user;
          return await resolve(source, args, context, info);
        } catch (err) {
          defaultLogger.error(`Error from auth/authDirectiveTransformer -> ${err}`);
          throw err;
        }
      };
    }
  },
});

module.exports = authDirectiveTransformer;
