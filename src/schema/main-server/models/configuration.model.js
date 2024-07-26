const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Configuration extends Model {
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

  Configuration.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    key: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.ENUM('DURATION', 'INT', 'FLOAT', 'STRING'),
    },
  }, {
    sequelize,
    underscored: true,
    paranoid: true,
    timestamps: true,
    modelName: 'Configuration',
    tableName: 'configurations',
  });

  return Configuration;
};
