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

module.exports = sequelize.models.user
