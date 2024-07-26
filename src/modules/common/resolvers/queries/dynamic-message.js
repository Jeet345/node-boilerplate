const { getMessage } = require('../../../../utils/messages');
const commonLogger = require('../../common-logger');

const dynamicMessage = async (parent, args, ctx) => {
  const { requestMeta, localeService } = ctx;
  try {
    const { name } = args;
    const response = {
      message: getMessage('REPLACEMENT_TEST', localeService, { name: name || 'JOHN DOE' }),
    };
    return response;
  } catch (error) {
    commonLogger.error(`Error from dynamicMessage > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = dynamicMessage;
