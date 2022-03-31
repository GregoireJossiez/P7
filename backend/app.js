const express = require("express")
const app = express()
const Sequelize = require("sequelize")
const path = require("path")
const sequelize = require("./db")

const saucesRoutes = require("./routes/sauces")
const userRoutes = require("./routes/user")

// const sequelize = new Sequelize('GROUPOMANIA_DB', 'root', 'toor', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

sequelize.authenticate().then(() => {
  console.log("Connexion successful !");
}).catch((err) => {
  console.log("Error connection to database !");
});

// user model

// const User = sequelize.define('user', {
//   // Model attributes are defined here
//   username: {
//     type:  Sequelize.DataTypes.STRING,
//     allowNull: false
//   },
//   password: {
//     type: Sequelize.DataTypes.STRING
//   }
//   }, {
//   // Other model options go here
// })
//
// User.sync().then((data) => {
//   console.log("Table and model synced successfully !");
// }).catch((err) => {
//   console.log("Error syncing the table and model !");
//   console.log(err);
// })
//
// User.sync().then((data) => {
//   return User.findOne()
// }).then((data) => {
//   console.log(data.toJSON());
// }).catch((err) => {
//   console.log(err);
// })

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")))

app.use(express.json())

app.use("/api/sauces", saucesRoutes)
app.use("/api/auth", userRoutes)

module.exports = app
