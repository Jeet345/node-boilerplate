const userLogger = require('../../user-logger');

const me = async (parent, args, ctx) => {
  const { requestMeta, req = {} } = ctx;
  try {
    const { user } = req;
    return user;
  } catch (error) {
    userLogger.error(`Error from me > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = me;
