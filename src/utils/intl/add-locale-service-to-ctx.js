const { get } = require('lodash');

const { ACCEPT_LANGUAGES, ENGLISH } = require('../../constants/language-constants');
const Logger = require('../../shared-lib/logger');

const logger = new Logger('default');

const addLocaleServiceToCtx = (ctx, localeService) => {
  try {
    let acceptLanguage = get(ctx, 'req.headers.accept-language', ENGLISH);
    if (!ACCEPT_LANGUAGES.includes(acceptLanguage)) {
      acceptLanguage = ENGLISH;
    }
    localeService.setLocale(acceptLanguage);
    ctx.localeService = localeService;
  } catch (err) {
    logger.error(`Error from addLocaleServiceToCtx => ${err}`, null);
  }
};

module.exports = addLocaleServiceToCtx;
