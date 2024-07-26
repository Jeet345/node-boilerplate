const { S3Client } = require('@aws-sdk/client-s3');

const awsConfig = require('./index');

const s3Client = new S3Client(awsConfig);

module.exports = s3Client;
