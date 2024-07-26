const { Model } = require('sequelize');

const encryption = require('../../../utils/auth/encryption.js');

module.exports = (sequelize, DataTypes) => {
  class AccessToken extends Model {
    /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
    }
  }

  AccessToken.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
    },
    tokenType: {
      type: DataTypes.ENUM('ACCESS', 'RESET'),
      defaultValue: 'ACCESS',
    },
    token: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('token');
        const decryptedToken = encryption.decryptWithAES(rawValue);
        return decryptedToken;
      },
      set(value) {
        const encryptedToken = encryption.encryptWithAES(value);
        this.setDataValue('token', encryptedToken);
      },
    },
    client: {
      type: DataTypes.STRING,
    },
    deviceId: {
      type: DataTypes.STRING,
    },
    os: {
      type: DataTypes.STRING,
    },
    expiredAt: {
      type: DataTypes.DATE,
    },
    metaData: {
      type: DataTypes.JSONB,
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'AccessToken',
    tableName: 'access_tokens',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'token'],
      },
    ],
  });

  AccessToken.associate = models => {
    AccessToken.belongsTo(models.User, { as: 'user', foreignKey: 'userId', targetKey: 'id' });
  };

  return AccessToken;
};
