const { Op } = require('sequelize');

const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const passwordUtils = require('../../../../utils/auth/password');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const signUp = async (parent, args, ctx) => {
  const { requestMeta, models, localeService } = ctx;
  try {
    const { data } = args;

    const { User: UserModel } = models;

    const {
      email, password, firstName, lastName,
    } = data;

    if (!email || !password) {
      throw new CustomGraphqlError(getMessage('MISSING_REQUIRED_FIELDS', localeService));
    }

    const userWhere = {
      email: {
        [Op.iLike]: `${email}`,
      },
    };

    const userExist = await UserModel.count({ where: userWhere });
    if (userExist) {
      throw new CustomGraphqlError(getMessage('EMAIL_ALREADY_EXIST', localeService));
    }

    const createUserData = {
      email,
      firstName,
      lastName,
      password: passwordUtils.generatePassword(password),
    };

    await UserModel.create(createUserData);

    // TODO: CAN SEND EMAIL TO VERIFY EMAIL ADDRESS, if REQUIRED

    const response = {
      message: getMessage('ACCOUNT_CREATED_PLEASE_LOGIN', localeService),
    };

    return response;
  } catch (error) {
    userLogger.error(`Error from signUp > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = signUp;
