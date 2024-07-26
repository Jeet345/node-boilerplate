const { get } = require('lodash');
const moment = require('moment');

const { JWT: JWT_CONFIG } = require('../../../config/config');
const { models: { AccessToken: AccessTokenModel } } = require('../../../sequelize-client');
const CustomGraphqlError = require('../../../shared-lib/error-handler');
const Logger = require('../../../shared-lib/logger');

const decodeToken = require('./decode-token');

const generateAccessToken = require('./generate-access-token');
const generateRefreshToken = require('./generate-refresh-token');
const generateResetToken = require('./generate-reset-token');

const logger = new Logger('jwt-utils');

class JWT {
  constructor({ secret = JWT_CONFIG.SECRET, lifeTime = JWT_CONFIG.LIFE_TIME, resetLifeTime = JWT_CONFIG.RESET_TOKEN_LIFE_TIME }) {
    this.secret = secret;
    this.lifeTime = lifeTime;
    this.resetLifeTime = resetLifeTime;
  }

  async generateResetToken(payload) {
    try {
      const expiry = `${this.resetLifeTime}h`;
      const token = await generateResetToken(payload, this.secret, expiry);
      return token;
    } catch (error) {
      logger.error(`Error from generateResetToken => ${error}`);
      const code = get(error, 'extensions.code');
      throw new CustomGraphqlError(error, code);
    }
  }

  async generateAccessToken(userId) {
    try {
      const token = await generateAccessToken(userId, this.secret, this.lifeTime);
      return token;
    } catch (error) {
      logger.error(`Error from generateAccessToken => ${error}`);
      const code = get(error, 'extensions.code');
      throw new CustomGraphqlError(error, code);
    }
  }

  async generateRefreshToken(userId) {
    try {
      const token = await generateRefreshToken(userId, this.secret);
      return token;
    } catch (error) {
      logger.error(`Error from generateRefreshToken => ${error}`);
      const code = get(error, 'extensions.code');
      throw new CustomGraphqlError(error, code);
    }
  }

  async decodeToken(token, checkExpiry = true) {
    try {
      const data = await decodeToken(token, this.secret, checkExpiry);
      return data;
    } catch (error) {
      logger.error(`Error from decodeToken => ${error}`);
      const code = get(error, 'extensions.code');
      throw new CustomGraphqlError(error, code);
    }
  }

  async saveAccessToken(userId, token, options = {}) {
    try {
      const { exp: expiryTimeInMs } = await this.decodeToken(token);
      const expiredAt = moment(expiryTimeInMs * 1000).toDate();
      await AccessTokenModel.create({
        userId: userId, token, expiredAt, tokenType: 'ACCESS', os: options.os, client: options.browser,
      });
    } catch (error) {
      logger.error(`Error from saveAccessToken => ${error}`);
    }
  }

  async saveResetToken(userId, token, options = {}) {
    try {
      const expiredAt = moment().add(this.resetLifeTime, 'hours').toDate();
      await AccessTokenModel.create({
        userId: userId, token, expiredAt, tokenType: 'RESET', os: options.os, client: options.browser,
      });
    } catch (error) {
      logger.error(`Error from saveResetToken => ${error}`);
    }
  }
}

const jwt = new JWT({ secret: JWT_CONFIG.SECRET, lifeTime: JWT_CONFIG.LIFE_TIME });

module.exports = jwt;
