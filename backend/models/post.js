const { Sequelize, DataTypes, HasOne } = require('sequelize');
const User = require("../models/user")
const Like = require("../models/like")

const sequelize = require("../db")

const Post = sequelize.define('post', {
  // Model attributes are defined here
  authorName: {
    type: Sequelize.DataTypes.STRING
  },
  authorFamilyName: {
    type: Sequelize.DataTypes.STRING
  },
  content: {
    type: Sequelize.DataTypes.STRING
  },
  imageUrl: {
    type: Sequelize.DataTypes.STRING
  },
  likes: {
    type: Sequelize.DataTypes.INTEGER
  },
  userId: {
    type: Sequelize.DataTypes.INTEGER
  }
  }, {
  // Other model options go here
})

User.belongsToMany(Post,{
  through: Like
});
Post.belongsToMany(User,{
  through: Like
});

sequelize.sync().then((data) => {
  console.log("Table and model synced successfully !");
}).catch((err) => {
  console.log("Error syncing the table and model !");
  console.log(err);
})

module.exports = sequelize.models.post
