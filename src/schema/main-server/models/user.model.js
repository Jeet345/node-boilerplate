const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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

  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    profileImage: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('USER', 'ADMIN', 'SUPER_ADMIN'),
      defaultValue: 'USER',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastActiveOn: {
      type: DataTypes.DATE,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: true,
    paranoid: true,
    modelName: 'User',
    tableName: 'users',
  });

  // TODO: ADD ASSOCIATIONS HERE
  User.associate = models => {
  };

  return User;
};
