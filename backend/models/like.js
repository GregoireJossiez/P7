const { Sequelize, DataTypes, HasOne } = require('sequelize');
const User = require("../models/user")
const Post = require("../models/post")

const sequelize = require("../db")

const Like = sequelize.define('like', {
  userNames: {
    type: Sequelize.DataTypes.STRING
  },
  hasLiked: {
    type: Sequelize.DataTypes.BOOLEAN,
    defaultValue: false
  }
},{
    timestamps: false
})

module.exports = sequelize.models.like
