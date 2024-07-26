const { GraphQLError } = require('graphql');

class CustomGraphqlError extends GraphQLError {
  constructor(message, code = 'CUSTOM_GRAPHQL_ERROR') {
    super(message, { extensions: { code } });
    this.extensions.code = code;
    this.extensions.type = 'CUSTOM_GRAPHQL_ERROR';
  }
}

module.exports = CustomGraphqlError;
