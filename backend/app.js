const express = require("express")
const app = express()
const Sequelize = require("sequelize")
const path = require("path")
const sequelize = require("./db")

const postRoutes = require("./routes/post")
const userRoutes = require("./routes/user")

sequelize.authenticate().then(() => {
  console.log("Connexion successful !");
}).catch((err) => {
  console.log("Error connection to database !");
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")))

app.use(express.json())

app.use("/api/post", postRoutes)
app.use("/api/auth", userRoutes)

module.exports = app
