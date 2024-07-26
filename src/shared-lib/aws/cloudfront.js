const { CloudFrontClient } = require('@aws-sdk/client-cloudfront');

const awsConfig = require('./index');

const cloudFrontClient = new CloudFrontClient(awsConfig);

module.exports = cloudFrontClient;
