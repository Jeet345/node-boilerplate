const { GraphQLScalarType, Kind } = require('graphql');

const { QUERY_PAGING_MAX_COUNT, QUERY_PAGING_MIN_COUNT } = require('../config/config');

const parseValue = value => {
  if (typeof value === 'number') {
    // IF NEGATIVE VALUE GIVE, SET TO MINIMUM
    if (value < 0) { return QUERY_PAGING_MIN_COUNT; }
    // IF GIVEN VALUE IS LESS THAN MAX VALUE , IT'S OK
    if (value <= QUERY_PAGING_MAX_COUNT) { return value; }
    // ELSE SET TO MAX VALUE
    return QUERY_PAGING_MAX_COUNT;
  }
  return QUERY_PAGING_MAX_COUNT;
};

const parseLiteral = ast => {
  const { kind, value } = ast;
  if (kind === Kind.INT) {
    const integerValue = Number(value);
    // IF NEGATIVE VALUE GIVE, SET TO MINIMUM
    if (integerValue < 0) { return QUERY_PAGING_MIN_COUNT; }
    // IF GIVEN VALUE IS LESS THAN MAX VALUE , IT'S OK
    if (integerValue <= QUERY_PAGING_MAX_COUNT) { return integerValue; }
    // ELSE SET TO MAX VALUE
    return QUERY_PAGING_MAX_COUNT;
  }
  return QUERY_PAGING_MAX_COUNT;
};

const limitScalar = new GraphQLScalarType({
  name: 'Limit',
  description: 'Limit custom scalar type',
  serialize: value => value,
  parseValue,
  parseLiteral,
});

module.exports = limitScalar;
