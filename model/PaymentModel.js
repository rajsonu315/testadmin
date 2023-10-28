const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/config');



const User =  sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  Mobile: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  UPI_NO: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  Amount: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false
  },

}, {
  // Other model options go here
});
//User.sync({ force: false });

User.Sequelize = Sequelize;
User.sequelize = sequelize;



// User.sync({ force: true }).then(async () => {
//   for (let i = 0; i < 500000; i++) {
//     const user = {
//       firstName: `sonu${i}`,
//       user_id: `kumar${i}`,
//       Mobile: `628097472${i}`,
//       UPI_NO: `628097${i}724@upi`,
//       Amount: `1200${i}`,
//       Status: Math.random() < 0.5, // Randomly set to true or false
//     };
//     await User.create(user);
//   }
// });


// `sequelize.define` also returns the model

module.exports = User