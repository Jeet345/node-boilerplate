/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils');
const { defaultFieldResolver } = require('graphql');

const covertUpperCase = (object, fields) => {
  fields.forEach(field => {
    object[field] = String(object[field]).toUpperCase();
  });
  return object;
};

const upperDirectiveTransformer = (schema, directiveName) => mapSchema(schema, {
  // Executes once for each object field in the schema
  [MapperKind.OBJECT_FIELD]: fieldConfig => {
    // Check whether this field has the specified directive
    const upperDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

    if (upperDirective) {
      const { resolve = defaultFieldResolver } = fieldConfig;

      fieldConfig.resolve = async (source, args, context, info) => {
        const { data } = await resolve(source, args, context, info);
        const result = data.map(ele => covertUpperCase(ele, ['text']));
        return { data: result };
      };
      return fieldConfig;
    }
  },
});

module.exports = upperDirectiveTransformer;
