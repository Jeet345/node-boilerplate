const CONFIG = require('../../config/config');

const getImgixUrlForPath = key => `${CONFIG.IMGIX_SOURCE_DOMAIN}/${key}`;

const getKeyForImgixUrl = url => url.replace(`${CONFIG.IMGIX_SOURCE_DOMAIN}/`, '');

module.exports = { getImgixUrlForPath, getKeyForImgixUrl };
