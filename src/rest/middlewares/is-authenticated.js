const status = require('http-status');

const defaultLogger = require('../../logger');
const getUser = require('../../utils/auth/get-user');
const { getMessage } = require('../../utils/messages');
const ApiError = require('../../utils/rest/api-error');

const isAuthenticated = async (req, res, next) => {
  const { headers: { authorization } = {}, logInfo = {}, localeService } = req;
  try {
    const user = await getUser(authorization, localeService);

    if (!user) {
      throw new ApiError(getMessage('USER_NOT_FOUND', localeService), status.NOT_FOUND);
    }

    // CHECK IF USER IS BLOCKED BY ADMIN
    if (user.isActive === false) {
      throw new ApiError(getMessage('USER_IS_DEACTIVATED', localeService), status.UNAUTHORIZED);
    }

    req.user = user;
    return next();
  } catch (error) {
    defaultLogger.error(`Error from checkSecret => ${error}`, logInfo);
    return next(error);
  }
};

module.exports = isAuthenticated;

