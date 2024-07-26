const { JWT } = require('@mux/mux-node');

const CONFIG = require('../../../config/config');

const getMuxThumbnailSignedURL = (playbackId, thumbnailURL) => {
  const baseOptions = {
    keyId: CONFIG.MUX.SIGNING_KEY,
    keySecret: CONFIG.MUX.SIGNING_SECRET,
  };

  const token = JWT.sign(playbackId, {
    ...baseOptions, type: 'thumbnail', expiration: '1d',
  });

  if (token) {
    return `${thumbnailURL}?token=${token}`;
  }

  return null;
};

module.exports = getMuxThumbnailSignedURL;
