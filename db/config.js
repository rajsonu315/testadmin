const { Sequelize } = require('sequelize');
 const {DB_HOST,DB_USER,DB_PASSWORD,DB_DATABSENAME} = process.env;


const sequelize = new Sequelize(DB_DATABSENAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
  });

  try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }






   module.exports = sequelize;