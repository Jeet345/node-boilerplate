const { JWT } = require('@mux/mux-node');

const CONFIG = require('../../../config/config');

const getMuxJWTSignedURL = playbackId => {
  const baseOptions = {
    keyId: CONFIG.MUX.SIGNING_KEY,
    keySecret: CONFIG.MUX.SIGNING_SECRET,
  };

  const token = JWT.sign(playbackId, {
    ...baseOptions,
    type: 'video',
    expiration: '1d',
    params: {
      // eslint-disable-next-line camelcase
      add_audio_only: true,
    },
  });

  if (token) {
    return `https://${CONFIG.MUX.VIDEO_PLAYBACK_DOMAIN}/${playbackId}.m3u8?token=${token}`;
  }
  return null;
};

module.exports = getMuxJWTSignedURL;
