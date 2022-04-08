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
  likes: {
    type: Sequelize.DataTypes.INTEGER
  },
  dislikes: {
    type: Sequelize.DataTypes.INTEGER
  },
  usersLiked: {
    type: Sequelize.DataTypes.INTEGER
  },
  usersDisliked: {
    type: Sequelize.DataTypes.INTEGER
  },
  }, {
  // Other model options go here
})

User.hasMany(Post);
Post.belongsTo(User);

Post.sync({ alter: true }).then((data) => {
  console.log("Table and model synced successfully !");
}).catch((err) => {
  console.log("Error syncing the table and model !");
  console.log(err);
})

module.exports = sequelize.models.post
