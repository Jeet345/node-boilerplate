const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const moment = require('moment');

const CONFIG = require('../../../config/config');
const { getCachedData, setCacheData } = require('../../../redis-client');
const awsLogger = require('../aws-logger');

const generateGetCloudFrontSignedUrl = async (s3FileKey, requestMeta) => {
  try {
    let signedUrl = await getCachedData(s3FileKey);
    if (!signedUrl) {
      const today = moment();
      const signedUrlExpiry = moment().add(1, 'days'); // 1 day
      const redisKeyExpiry = signedUrlExpiry.subtract(300, 'seconds').diff(today, 'seconds');

      const signedUrlOptions = {
        url: `${CONFIG.AWS.CLOUDFRONT_PRIVATE_DOMAIN}/${s3FileKey}`,
        keyPairId: CONFIG.AWS.CLOUDFRONT_PRIVATE_ID,
        privateKey: CONFIG.AWS.CLOUDFRONT_PRIVATE_KEY,
        dateLessThan: signedUrlExpiry,
      };

      signedUrl = getSignedUrl({
        ...signedUrlOptions,
      });

      setCacheData(s3FileKey, signedUrl, redisKeyExpiry);
    }
    return signedUrl;
  } catch (error) {
    awsLogger.error(`Error From generateGetCloudFrontSignedUrl KEY: ${s3FileKey} > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = {
  generateGetCloudFrontSignedUrl,
};
