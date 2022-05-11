const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require("../db")

const User = sequelize.define('user', {
  // Model attributes are defined here
  email: {
    type: Sequelize.DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type:  Sequelize.DataTypes.STRING,
    allowNull: false
  },
  familyName: {
    type:  Sequelize.DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.DataTypes.STRING
  },
  avatar: {
    type: Sequelize.DataTypes.STRING,
    defaultValue: "http://localhost:3000/images/default-avatar-1.jpeg"
  },
  admin: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false
  }
  }, {
  // Other model options go here
})

// User.sync({ alter: true }).then((data) => {
//   console.log("Table and model synced successfully !");
// }).catch((err) => {
//   console.log("Error syncing the table and model !");
//   console.log(err);
// })

// User.sync().then((data) => {
//   return User.findOne()
// }).then((data) => {
//   console.log(data.toJSON());
// }).catch((err) => {
//   console.log(err);
// })

module.exports = sequelize.models.user
