const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const CONFIG = require('../../../config/config');
const awsLogger = require('../aws-logger');
const s3Client = require('../s3-client');

const generateS3PutSignedUrl = async (key, contentType, requestMeta, ACL = 'public-read') => {
  try {
    const putObjectCommand = new PutObjectCommand({
      Bucket: CONFIG.AWS.S3_BUCKET_NAME,
      Key: key,
      ACL,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600, // Expiration time in seconds
    });

    return {
      signedUrl,
      key,
    };
  } catch (error) {
    awsLogger.error(`Error from generateS3PutSignedUrl > KEY: ${key} ${error}`, requestMeta);
    throw error;
  }
};

module.exports = { generateS3PutSignedUrl };
