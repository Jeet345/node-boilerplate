/* eslint-disable eslint-plugin/require-meta-schema */
/* eslint-disable eslint-plugin/require-meta-type */
/* eslint-disable eslint-plugin/require-meta-docs-url */
/* eslint-disable eslint-plugin/require-meta-docs-description */
/* eslint-disable eslint-plugin/prefer-message-ids */
/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

const SentryLogsPlugin = {
  create: Sentry => ({
    requestDidStart() {
      return {
        didEncounterErrors(ctx) {
          // If we couldn't parse the operation (usually invalid queries)
          if (!ctx.operation) {
            return;
          }

          for (const error of ctx.errors) {
            const { extensions: { type } } = error;
            if (type === 'CUSTOM_GRAPHQL_ERROR') {
              continue;
            }
            Sentry.captureException(error);
          }
        },
      };
    },
  }),
};

module.exports = SentryLogsPlugin;
