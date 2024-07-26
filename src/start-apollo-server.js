const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} = require('@apollo/server/plugin/landingPage/default');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const Sentry = require('@sentry/node');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');

const packageJson = require('../package.json');

const { ALLOW_INTROSPECTION } = require('./config/config');

const CONFIG = require('./config/config');
const applyDirective = require('./directives');
const logger = require('./logger');
const { resolvers, typeDefs } = require('./modules');
const sequelizeClient = require('./sequelize-client');
const CustomGraphqlError = require('./shared-lib/error-handler');
const queryComplexityPlugin = require('./shared-lib/graphql/plugins/query-complexity-plugin');
const sentryLogsPlugin = require('./shared-lib/graphql/plugins/sentry-logs-plugin');
const depthLimitRule = require('./shared-lib/graphql/validation-rules/depth-limit-rule');
const addRequestMetaToCtx = require('./utils/auth/add-request-meta-to-ctx');
const getUser = require('./utils/auth/get-user');
const addLocaleServiceToCtx = require('./utils/intl/add-locale-service-to-ctx');
const { getMessage } = require('./utils/messages');

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = applyDirective(schema);

Sentry.init({
  dsn: CONFIG.SENTRY_DSN,
  environment: CONFIG.ENV || 'development',
  release: packageJson.version,
});

async function startApolloServer(app, httpServer, localeService) {
  try {
    const GRAPHQL_ENDPOINT = `/${CONFIG.API_PREFIX_ROUTE}/graphql`;

    const wsServer = new WebSocketServer({
      server: httpServer,
      path: GRAPHQL_ENDPOINT,
    });

    const wsServerCleanup = useServer({
      schema,
      context: async ctx => {
        const { connectionParams } = ctx;
        if (connectionParams && (connectionParams.Authorization || connectionParams.authorization)) {
          return { connection: ctx.connectionParams, user: ctx.user };
        }
        return ctx;
      },
      onConnect: async ctx => {
        if (CONFIG.ENV === 'development') {
          logger.debug('------------onConnect---------------');
        }
        const { connectionParams } = ctx;
        try {
          // Check authentication every time a client connects.
          const user = await getUser(connectionParams.authorization || connectionParams.Authorization, localeService);
          ctx.user = user;
          return user;
        } catch (error) {
          return new CustomGraphqlError(getMessage('UNAUTHORIZED', localeService), 'UNAUTHORIZED');
        }
      },
      onDisconnect: () => {
        if (CONFIG.ENV === 'development') {
          logger.debug('------------onDisconnect---------------');
        }
      },
    }, wsServer);

    const server = new ApolloServer({
      schema,
      introspection: ALLOW_INTROSPECTION,
      playground: ALLOW_INTROSPECTION,
      plugins: [
        queryComplexityPlugin(schema),
        sentryLogsPlugin.create(Sentry),
        ALLOW_INTROSPECTION === true
          ? ApolloServerPluginLandingPageLocalDefault()
          : ApolloServerPluginLandingPageProductionDefault(),
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await wsServerCleanup.dispose();
              },
            };
          },
        },
      ],
      formatError: error => {
        let message = error.message.replace('SequelizeValidationError: ', '').replace('Validation error: ', '');

        if (error.extensions.code === 'GRAPHQL_VALIDATION_FAILED') {
          return { ...error, message };
        }

        const { extensions: { type } } = error;

        if (type !== 'CUSTOM_GRAPHQL_ERROR') {
          if (error.message === getMessage('RATE_LIMIT')) {
            message = error.message;
            return { message };
          }
          message = getMessage('INTERNAL_SERVER_ERROR'); // FOR SERVER ERRORS
          return { message };
        }

        return { ...error, message };
      },
      validationRules: [depthLimitRule(CONFIG.DEPTH_LIMIT_CONFIG)],
    });

    await server.start();

    app.use(GRAPHQL_ENDPOINT, expressMiddleware(server, {
      context: async ctx => {
        if (ctx.connection) {
          return { connection: ctx.connection, user: ctx.user };
        }
        addLocaleServiceToCtx(ctx, localeService);
        addRequestMetaToCtx(ctx);
        return {
          ...ctx,
          req: ctx.req,
          res: ctx.res,
          models: sequelizeClient.models,
        };
      },
    }));
  } catch (error) {
    logger.error(`ERROR STARTING APOLLO SERVER >> ${error}`);
    throw error;
  }
}

module.exports = startApolloServer;
