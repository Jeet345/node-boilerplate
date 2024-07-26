const path = require('path');

const { getType } = require('mime');

const { IMAGE_KEYS } = require('../../../../constants/service-constants');
const awsFunctions = require('../../../../shared-lib/aws/functions');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const getProfileImageUploadSignedUrl = async (parent, args, ctx) => {
  const { requestMeta, req, localeService } = ctx;
  try {
    const { user } = req;
    const { data } = args;
    let { fileName } = data;
    if (!fileName) {
      throw new CustomGraphqlError(getMessage('MISSING_REQUIRED_FIELDS', localeService));
    }

    const mimeType = getType(fileName);
    const fileExtension = path.extname(fileName);
    fileName = `profile-image-${new Date().getTime()}${fileExtension}`;

    const userId = user.id;
    const profileImageKey = `${IMAGE_KEYS.USER_PROFILE_IMAGE}/${userId}/${fileName}`;

    const signedData = await awsFunctions.generateS3PutSignedUrl(profileImageKey, mimeType, requestMeta, 'private');
    return signedData;
  } catch (error) {
    userLogger.error(`Error from getProfileImageUploadSignedUrl > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = getProfileImageUploadSignedUrl;
