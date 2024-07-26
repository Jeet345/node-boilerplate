const limitScalar = require('../../../scalars/limit-scalar');

const dynamicMessage = require('./queries/dynamic-message');

const resolvers = {
  Limit: limitScalar,
  Query: {
    dynamicMessage,
  },
};

module.exports = resolvers;
