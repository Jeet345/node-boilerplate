/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const authDirectiveTransformer = require('./auth-directive');
const hasRoleDirectiveTransformer = require('./has-role-directive');
const rateLimitDirectiveTransformer = require('./rate-limit-directive');
const upperDirectiveTransformer = require('./upper-case-directive');

const directivesObj = {
  isAuthenticated: authDirectiveTransformer,
  upper: upperDirectiveTransformer,
  hasRole: hasRoleDirectiveTransformer,
  rateLimit: rateLimitDirectiveTransformer,
};

const applyDirective = schema => {
  for (const directive in directivesObj) {
    schema = directivesObj[directive](schema, directive);
  }
  return schema;
};

module.exports = applyDirective;
