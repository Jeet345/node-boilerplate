const moment = require('moment');

const { sequelize } = require('../../../../sequelize-client');
const CustomGraphqlError = require('../../../../shared-lib/error-handler');
const encryption = require('../../../../utils/auth/encryption');
const password = require('../../../../utils/auth/password');
const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const updatePassword = async (parent, args, ctx) => {
  const { requestMeta, models, localeService } = ctx;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { User: UserModel, AccessToken: AccessTokenModel } = models;

    const { data } = args;
    const { uid, token, password: inputPassword } = data;

    if (!token.trim()) {
      throw new CustomGraphqlError(getMessage('INVALID_TOKEN', localeService), 'INVALID_TOKEN');
    }

    const user = await UserModel.findByPk(uid);

    if (!user) {
      throw new CustomGraphqlError(getMessage('USER_NOT_FOUND', localeService), 'USER_NOT_FOUND');
    }

    const accessTokenData = await AccessTokenModel.findOne({ where: { userId: uid, token: encryption.encryptWithAES(token), tokenType: 'RESET' } });

    if (!accessTokenData) {
      throw new CustomGraphqlError(getMessage('INVALID_TOKEN', localeService), 'INVALID_TOKEN');
    }

    if (moment().isAfter(moment(accessTokenData.expiredAt))) {
      throw new CustomGraphqlError(getMessage('RESET_PASSWORD_LINK_EXPIRED', localeService), 'RESET_PASSWORD_LINK_EXPIRED');
    }

    const updateData = {};
    updateData.password = password.generatePassword(inputPassword);

    await UserModel.update(updateData, { where: { id: uid }, transaction });

    await accessTokenData.destroy({ transaction });

    await transaction.commit();

    const response = { message: getMessage('USER_PASSWORD_UPDATED', localeService) };
    return response;
  } catch (error) {
    if (transaction) {
      transaction.rollback();
    }
    userLogger.error(`Error from updatePassword > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = updatePassword;
