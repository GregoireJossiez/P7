const { Sequelize, DataTypes, HasOne } = require('sequelize');
const User = require("../models/user")
const Post = require("../models/post")

const sequelize = require("../db")

const Comment = sequelize.define('comment', {
  userNames: {
    type: Sequelize.DataTypes.STRING
  },
  content: {
    type: Sequelize.DataTypes.STRING
  }
},{
  
})

module.exports = sequelize.models.comment
