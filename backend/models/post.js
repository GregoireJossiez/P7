// const mongoose = require("mongoose")
//
// const sauceSchema = mongoose.Schema({
//   userId: { type: String, required: true},
//   name: { type: String, required: true},
//   manufacturer: { type: String, required: true},
//   description: { type: String, required: true},
//   mainPepper: { type: String, required: true},
//   imageUrl: { type: String, required: true},
//   heat: { type: Number, required: true},
//   likes: { type: Number, required: true},
//   dislikes: { type: Number, required: true},
//   usersLiked: { type: [String], required: true},
//   usersDisliked: { type: [String], required: true},
// })
//
// module.exports = mongoose.model("sauce", sauceSchema)

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

// User.hasMany(Post);
// Post.belongsTo(User);

User.belongsToMany(Post,{
  through: Like
});
Post.belongsToMany(User,{
  through: Like
});

// sequelize.sync({ alter: true }).then((data) => {
//   console.log("Table and model synced successfully !");
// }).catch((err) => {
//   console.log("Error syncing the table and model !");
//   console.log(err);
// })

// sequelize.sync({ alter: true }).then((data) => {
//   Like.create({ hasLiked: true, userId: '12', postId: '46', userNames: "Mario Bros" });
// }).catch((err) => {
//   console.log("Error syncing the table and model !");
//   console.log(err);
// })

module.exports = sequelize.models.post
