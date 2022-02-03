
const mysql = require('mysql');
const config = require('./environment')

const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.dbConfig.db, config.dbConfig.user, config.dbConfig.pw, {
  host: 'localhost',
  dialect: 'mysql' 
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database , For more detail ',err.stack);
  });
exports.sequelize = sequelize;