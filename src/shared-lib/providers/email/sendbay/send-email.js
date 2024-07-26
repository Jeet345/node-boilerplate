const { default: axios } = require('axios');

const Logger = require('../../../logger');

const logger = new Logger('sendbay');

// eslint-disable-next-line consistent-return
const sendEmail = async (emailData, config = {}, options = {}, requestMeta = {}) => {
  try {
    const { receiverEmails, template, data } = emailData;
    const { host, apiKey, secretKey } = config;
    const { fromEmail, fromName, emailEndpoint } = options;

    const payload = {
      fromEmailName: fromName,
      fromEmail,
      toEmail: receiverEmails,
      templateKey: template,
      type: 'HTML',
      data,
      apiKey,
      secretKey,
    };

    logger.debug(`Sending email from sendbay > ${JSON.stringify(payload)}`, requestMeta);

    const response = await axios.post(`${host}${emailEndpoint}`, payload);
    const { data: responseData } = response;

    logger.info(`Sent email from sendbay > ${JSON.stringify(responseData)}`, requestMeta);

    return responseData;
  } catch (error) {
    logger.error(`Error from sendbay sendEmail > ${error}`, requestMeta);
  }
};

module.exports = sendEmail;
