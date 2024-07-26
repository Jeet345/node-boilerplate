const moment = require('moment');
const { Op } = require('sequelize');

const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const jwt = require('../../../../utils/auth/jwt');
const passwordUtils = require('../../../../utils/auth/password');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const loginUser = async (parent, args, ctx) => {
  const {
    req: { useragent = {} }, requestMeta, models, localeService,
  } = ctx;
  try {
    const { data } = args;

    const { User: UserModel } = models;

    const {
      email, password,
    } = data;

    if (!email || !password) {
      throw new CustomGraphqlError(getMessage('MISSING_REQUIRED_FIELDS', localeService));
    }

    const userWhere = {
      email: {
        [Op.iLike]: `${email}`,
      },
    };

    const user = await UserModel.findOne({ where: userWhere });
    if (!user) {
      throw new CustomGraphqlError(getMessage('EMAIL_DOES_NOT_EXIST', localeService));
    }

    const passwordMatch = passwordUtils.comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new CustomGraphqlError(getMessage('INVALID_CREDENTIALS', localeService));
    }

    if (!user.isActive) {
      throw new CustomGraphqlError(getMessage('USER_IS_DEACTIVATED', localeService));
    }

    const accessToken = await jwt.generateAccessToken(user.id);
    await jwt.saveAccessToken(user.id, accessToken, useragent);

    if (!user.refreshToken) {
      const refreshToken = await jwt.generateRefreshToken(user.id);
      await user.update({ refreshToken });
    }

    const lastActiveOn = moment();
    await user.update({ lastActiveOn });

    return {
      message: getMessage('LOGIN_SUCCESSFULLY', localeService),
      data: user,
      accessToken,
      refreshToken: user.refreshToken,
    };
  } catch (error) {
    userLogger.error(`Error from loginUser > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = loginUser;
