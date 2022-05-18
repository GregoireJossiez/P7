const { Sequelize, DataTypes, HasOne } = require('sequelize');
const User = require("../models/user")
const Like = require("../models/like")
const Comment = require("../models/comment")

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

Post.hasMany(Comment)
Comment.belongsTo(Post)
User.hasMany(Comment, {
  onDelete: 'CASCADE'
})
Comment.belongsTo(User)

sequelize.sync({ alter: true }).then((data) => {
  console.log("Table and model synced successfully !");
}).catch((err) => {
  console.log("Error syncing the table and model !");
  console.log(err);
})

module.exports = sequelize.models.post
