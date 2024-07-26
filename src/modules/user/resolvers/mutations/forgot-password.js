const randomstring = require('randomstring');
const { Op } = require('sequelize');

const CONFIG = require('../../../../config/config');
const providers = require('../../../../providers');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const jwt = require('../../../../utils/auth/jwt');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const forgotPassword = async (parent, args, ctx) => {
  const {
    req: { useragent = {} }, requestMeta, models, localeService,
  } = ctx;
  const { os, browser } = useragent;
  try {
    const { User: UserModel } = models;

    const { data } = args;
    const { email } = data;

    if (!email.trim()) {
      throw new CustomGraphqlError(getMessage('MISSING_REQUIRED_FIELDS', localeService));
    }

    const userWhere = {
      email: {
        [Op.iLike]: `${email}`,
      },
    };

    const user = await UserModel.findOne({ where: userWhere });
    if (!user) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService));
    }

    const token = randomstring.generate(128);
    await jwt.saveResetToken(user.id, token, { os, browser });

    const sendMailData = {
      receiverEmails: [user.email],
      template: 'USER_RESET_PASSWORD', // FIXME: CHANGE TEMPLATE KEY from EMAIL PROVIDER
      data: {
        firstName: user.firstName,
        url: `${CONFIG.APP_URL}/reset-password?uid=${user.id}&token=${token}`,
      },
    };

    providers.email.sendEmail(sendMailData);

    const response = {
      message: getMessage('RESET_PASSWORD_LINK_SENT_SUCCESSFUL', localeService),
    };

    return response;
  } catch (error) {
    userLogger.error(`Error from forgotPassword > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = forgotPassword;
