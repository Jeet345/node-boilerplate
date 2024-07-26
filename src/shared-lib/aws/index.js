const CONFIG = require('../../config/config');

const awsConfig = {
  region: CONFIG.AWS.REGION,
  credentials: {
    accessKeyId: CONFIG.AWS.ACCESS_ID,
    secretAccessKey: CONFIG.AWS.SECRET_KEY,
  },
};

module.exports = awsConfig;
