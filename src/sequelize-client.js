/* eslint-disable import/no-dynamic-require */
/* eslint-disable security/detect-non-literal-require */
const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');

const { ENV: NODE_ENV } = require('./config/config');

const basename = path.basename(__filename);
const env = NODE_ENV || 'development';

const mainServerPath = path.join(__dirname, './schema/main-server');
const config = require(`${mainServerPath}/migrations/config.js`)[env]; // READING CONFIG FILE

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// LOADING MODELs FROM MAIN-SERVER FOLDER
const mainServerModelPath = path.join(mainServerPath, '/models');

fs
  .readdirSync(mainServerModelPath)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    // eslint-disable-next-line global-require
    const model = require(path.join(mainServerModelPath, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.models = sequelize.models; // ADDING MODEL

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
