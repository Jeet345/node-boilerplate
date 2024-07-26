const defaultLogger = require('../../logger');
const { models: { User: UserModel, AccessToken: AccessTokenModel } } = require('../../sequelize-client');
const CustomGraphqlError = require('../../shared-lib/error-handler');
const { getMessage } = require('../messages');

const encryption = require('./encryption');
const getDecodedToken = require('./get-decoded-token');

const getUser = async (token, localeService) => {
  if (!token) {
    throw new CustomGraphqlError(getMessage('NOT_LOGGEDIN', localeService), 'LOGIN_REQUIRED');
  }

  if (!token.startsWith('Bearer ')) {
    throw new CustomGraphqlError(getMessage('INVALID_TOKEN', localeService), 'INVALID_TOKEN');
  }

  const authToken = token.slice(7, token.length);
  try {
    const decodedToken = await getDecodedToken(authToken, localeService);
    const accessToken = await AccessTokenModel.findOne({
      where: { token: encryption.encryptWithAES(authToken), userId: decodedToken.userId },
      include: { model: UserModel, as: 'user' },
    });

    if (!accessToken) {
      throw new CustomGraphqlError(getMessage('UNAUTHENTICATED', localeService), 'UNAUTHENTICATED');
    }
    const user = JSON.parse(JSON.stringify(accessToken.user));
    return user;
  } catch (error) {
    defaultLogger.error(`Error from getUser > ${error}`, null);
    throw error;
  }
};

module.exports = getUser;
