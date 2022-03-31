const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = new Sequelize('GROUPOMANIA_DB', 'root', 'toor', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

const sequelize = require("../db")

const User = sequelize.define('user', {
  // Model attributes are defined here
  username: {
    type:  Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.DataTypes.STRING
  }
  }, {
  // Other model options go here
})

User.sync().then((data) => {
  console.log("Table and model synced successfully !");
}).catch((err) => {
  console.log("Error syncing the table and model !");
  console.log(err);
})

// User.sync().then((data) => {
//   return User.findOne()
// }).then((data) => {
//   console.log(data.toJSON());
// }).catch((err) => {
//   console.log(err);
// })

module.exports = sequelize.models.user
