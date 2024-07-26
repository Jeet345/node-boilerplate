/* eslint-disable max-len */
/* eslint-disable camelcase */
const axios = require('axios').default;
const qs = require('qs');

const CONFIG = require('../../config/config');
const logger = require('../../logger');

const hiveTextModerationClient = async (textData, ctx) => {
  try {
    const options = {
      method: 'POST',
      url: CONFIG.HIVE_MODERATION.ENDPOINT,
      headers: {
        authorization: `token ${CONFIG.HIVE_MODERATION.TEXT_API_KEY}`,
      },
      data: qs.stringify({
        text_data: textData,
      }),
    };
    return await axios(options);
  } catch (error) {
    logger.error(`Error from hiveTextModerationClient > ${error}`, ctx);
    throw error;
  }
};

const hiveVisualModerationClient = async (url, ctx) => {
  try {
    const options = {
      method: 'POST',
      url: CONFIG.HIVE_MODERATION.ENDPOINT,
      headers: {
        authorization: `token ${CONFIG.HIVE_MODERATION.VISUAL_API_KEY}`,
      },
      data: qs.stringify({
        url,
      }),
    };
    return await axios(options);
  } catch (error) {
    logger.error(`Error from hiveVisualModerationClient > ${error}`, ctx);
    throw error;
  }
};

const hiveTextClasses = ['yes_bullying', 'suggestive', 'yes_incitement', 'sexual', 'violence', 'yes_hate', 'yes_spam', 'self_harm'];

const hiveVisualClasses = ['general_nsfw', 'general_suggestive', 'yes_female_underwear', 'yes_male_underwear', 'yes_sex_toy', 'yes_female_nudity', 'yes_male_nudity', 'yes_female_swimwear', 'yes_male_shirtless', 'animated_gun', 'gun_in_hand', 'knife_in_hand', 'a_little_bloody', 'very_bloody', 'yes_pills', 'yes_smoking', 'yes_nazi', 'yes_middle_finger', 'yes_terrorist', 'yes_sexual_activity', 'hanging',
];

module.exports = {
  hiveTextModerationClient,
  hiveVisualModerationClient,
  hiveTextClasses,
  hiveVisualClasses,
};
