const { PutObjectCommand } = require('@aws-sdk/client-s3');

const CONFIG = require('../../../config/config');
const awsLogger = require('../aws-logger');
const s3Client = require('../s3-client');

const s3PutObject = async (key, content, contentType, requestMeta, ACL = 'public-read') => {
  try {
    const putObject = new PutObjectCommand({
      Bucket: CONFIG.AWS.S3_BUCKET_NAME,
      Key: key,
      ACL,
      ContentType: contentType,
      Body: content,
    });

    await s3Client.send(putObject);
  } catch (error) {
    awsLogger.error(`Error from s3PutObject > KEY: ${key} ${error}`, requestMeta);
    throw error;
  }
};

module.exports = s3PutObject;
