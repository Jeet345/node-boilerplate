const userProfileImage = require('../field-resolvers/user-profile-image');

const forgotPassword = require('./mutations/forgot-password');
const loginUser = require('./mutations/login-user');
const refreshToken = require('./mutations/refresh-token');
const signUp = require('./mutations/sign-up');
const updatePassword = require('./mutations/update-password');
const updateUser = require('./mutations/update-user');
const getProfileImageUploadSignedUrl = require('./queries/get-profile-image-upload-signed-url');
const me = require('./queries/me');

const resolvers = {
  Mutation: {
    signUp,
    loginUser,
    updateUser,
    forgotPassword,
    updatePassword,
    refreshToken,
  },
  Query: {
    me,
    getProfileImageUploadSignedUrl,
  },
  User: {
    profileImage: userProfileImage,
  },
};

module.exports = resolvers;
