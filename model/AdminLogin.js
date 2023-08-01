const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/config');



const User =  sequelize.define('AdminLogin', {
  // Model attributes are defined here
  Username: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  Email: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
  Password: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },
 
  Roll: {
    type: DataTypes.STRING
    // allowNull defaults to true
  },

}, {
  // Other model options go here
});
User.sync({ force: false });

User.Sequelize = Sequelize;
User.sequelize = sequelize;



  //  User.sync({ force: true }).then(async ()=>{
  //    for (let i = 0; i < 500000; i++) {
  //      const user = {
  //        firstName:`sonu${i}`,
  //        user_id:`kumar${i}`,
  //        Mobile:`628097472${i}`,
  //        UPI_NO:`628097${i}724@upi`,
  //        Amount:`1200${i}`,
  //        Status:true
  //      }
  //      await User.create(user);
    
  //    }
  //  })

// `sequelize.define` also returns the model

module.exports = User