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

// User.belongsToMany(Post,{
//   through: Like
// });
// Post.belongsToMany(User,{
//   through: Like
// });

// Like.sync({ alter: true }).then((data) => {
//   console.log("Table and model synced successfully !");
// }).catch((err) => {
//   console.log("Error syncing the table and model !");
//   console.log(err);
// })

module.exports = sequelize.models.like
