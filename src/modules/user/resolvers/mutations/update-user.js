const { getMessage } = require('../../../../utils/messages');
const userLogger = require('../../user-logger');

const updateUser = async (parent, args, ctx) => {
  const { requestMeta, req, localeService } = ctx;
  try {
    const { user } = req;
    const { data } = args;

    const updateUserData = {
      firstName: data.firstName,
      lastName: data.lastName,
      profileImage: data.profileImage,
    };
    await user.update(updateUserData);

    const response = {
      data: user,
      message: getMessage('USER_UPDATE_SUCCESS', localeService),
    };

    return response;
  } catch (error) {
    userLogger.error(`Error from updateUser > ${error}`, requestMeta);
    throw error;
  }
};

module.exports = updateUser;
