const { generateGetCloudFrontSignedUrl } = require('./generate-get-signed-url');
const { generateS3PutSignedUrl } = require('./generate-put-signed-url');

module.exports = {
  generateGetCloudFrontSignedUrl,
  generateS3PutSignedUrl,
};
