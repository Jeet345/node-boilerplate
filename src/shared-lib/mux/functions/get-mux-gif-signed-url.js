const { JWT } = require('@mux/mux-node');

const CONFIG = require('../../../config/config');

const getMuxGIFSignedURL = (playbackId, gifURL) => {
  const baseOptions = {
    keyId: CONFIG.MUX.SIGNING_KEY,
    keySecret: CONFIG.MUX.SIGNING_SECRET,
  };

  const token = JWT.sign(playbackId, {
    ...baseOptions, type: 'gif', expiration: '1d',
  });

  if (token) {
    return `${gifURL}?token=${token}`;
  }

  return null;
};

module.exports = getMuxGIFSignedURL;
