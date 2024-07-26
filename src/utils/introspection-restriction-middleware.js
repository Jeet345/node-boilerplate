const { get } = require('lodash');

const { GRAPHQL_INTROSPECTION_RESTRICTION } = require('../config/config');

const introspectionRestrictionMiddleware = (req, res, next) => {
  const query = req.query.query || req.body.query || '';
  const introspectionHeader = get(req, 'headers.x-introspection-restriction-secret');
  if (query.includes('__schema') && introspectionHeader !== GRAPHQL_INTROSPECTION_RESTRICTION.SECRET) {
    return res.send({});
  }
  return next();
};

module.exports = introspectionRestrictionMiddleware;

