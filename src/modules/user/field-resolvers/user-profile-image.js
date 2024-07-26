const { IMAGE_KEYS } = require('../../../constants/service-constants');
const awsFunctions = require('../../../shared-lib/aws/functions');
const userLogger = require('../user-logger');

// eslint-disable-next-line consistent-return
const userProfileImage = async (parent, args, ctx) => {
  const { requestMeta } = ctx;
  try {
    const { profileImage } = parent;
    if (profileImage) {
      if (profileImage.startsWith(IMAGE_KEYS.USER_PROFILE_IMAGE)) {
        const url = await awsFunctions.generateGetCloudFrontSignedUrl(profileImage, requestMeta);
        return url;
      }
      return profileImage;
    }
    return null;
  } catch (error) {
    userLogger.error(`Error from userProfileImage > ${error}`, requestMeta);
  }
};

module.exports = userProfileImage;
