const { default: axios } = require('axios');

const Logger = require('../../../logger');

const logger = new Logger('mail-monkey');

const sendEmail = async (emailData, config = {}, options = {}, requestMeta = {}) => {
  try {
    const { receiverEmails, template, data } = emailData;
    const { host, applicationId, secretKey } = config;
    const { fromEmail, fromName } = options;

    const payload = {
      fromEmailName: fromName,
      fromEmailAddress: fromEmail,
      toEmailAddresses: receiverEmails,
      templateKey: template,
      data: [data],
      applicationId,
      secretKey,
    };

    logger.info(`Sending email from mail-monkey > ${JSON.stringify(payload)}`, requestMeta);

    const response = await axios.post(`${host}/email/send`, payload);
    const { data: responseData } = response;

    logger.info(`Sent email from mail-monkey > ${JSON.stringify(responseData)}`, requestMeta);

    return responseData;
  } catch (error) {
    logger.error(`Error from mail-monkey sendEmail > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = sendEmail;
