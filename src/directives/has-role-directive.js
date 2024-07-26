/* eslint-disable import/no-extraneous-dependencies */
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');

const { get } = require('lodash');

const defaultLogger = require('../logger');
const CustomGraphqlError = require('../shared-lib/error-handler');
const getUser = require('../utils/auth/get-user');
const { getMessage } = require('../utils/messages');

const hasRoleDirectiveTransformer = (schema, directiveName) => mapSchema(schema, {
  [MapperKind.OBJECT_FIELD]: fieldConfig => {
    const hasRoleDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
    if (hasRoleDirective) {
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        try {
          const { localeService, req } = context;

          const { roles } = hasRoleDirective;

          const authToken = get(context, 'req.headers.authorization');

          const user = await getUser(authToken, localeService);
          if (!user) {
            throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService), 'USER_NOT_FOUND');
          }

          // CHECK IF USER IS BLOCKED BY ADMIN
          if (user.isActive === false) {
            throw new CustomGraphqlError(getMessage('USER_IS_DEACTIVATED', localeService), 'USER_DEACTIVATED');
          }

          if (roles.includes(user.role)) {
            req.user = user;
            return await resolve(source, args, context, info);
          }
          throw new CustomGraphqlError(getMessage('UNAUTHORIZED', localeService), 'UNAUTHORIZED');
        } catch (err) {
          defaultLogger.error(`Error from auth/hasRoleDirectiveTransformer -> ${err}`);
          throw err;
        }
      };
    }
  },
});

module.exports = hasRoleDirectiveTransformer;
