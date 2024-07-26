/* eslint-disable indent */
const CONFIG = require('../config/config');
const logger = require('../logger');
const Email = require('../shared-lib/providers/email');

const getEmailProviderConfig = () => {
  let config = {
    provider: CONFIG.PROVIDERS.EMAIL,
    providerConfig: {},
    options: {},
  };

  switch (CONFIG.PROVIDERS.EMAIL) {
    case 'SENDBAY':
      config = {
        provider: CONFIG.PROVIDERS.EMAIL,
        providerConfig: {
          apiKey: CONFIG.SENDBAY.API_KEY,
          secretKey: CONFIG.SENDBAY.SECRET_KEY,
          host: CONFIG.SENDBAY.HOST,
        },
        options: {
          fromEmail: CONFIG.SENDBAY.FROM_EMAIL,
          fromName: CONFIG.SENDBAY.FROM_NAME,
          emailEndpoint: CONFIG.SENDBAY.EMAIL_ENDPOINT,
        },
      };
      break;

    case 'MAIL_MONKEY':
      config = {
        provider: CONFIG.PROVIDERS.EMAIL,
        providerConfig: {
          applicationId: CONFIG.MAIL_MONKEY.APPLICATION_ID,
          secretKey: CONFIG.MAIL_MONKEY.SECRET_KEY,
          host: CONFIG.MAIL_MONKEY.HOST,
        },
        options: {
          fromName: CONFIG.MAIL_MONKEY.FROM_NAME,
          fromEmail: CONFIG.MAIL_MONKEY.FROM_EMAIL,
        },
      };
      break;
    default:
      console.error('ERROR EMAIL PROVIDER NOT FOUND IN CONFIG');
      break;
  }

  logger.info(`USING ${CONFIG.PROVIDERS.EMAIL} as EMAIL PROVIDER`);
  return config;
};

const emailProviderConfig = getEmailProviderConfig();

const emailProvider = new Email(emailProviderConfig);

module.exports = emailProvider;
