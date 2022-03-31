const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Sequelize = require("sequelize")

const sequelize = require("../db")

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        username: req.body.username,
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé' }))
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res ,next) => {
  User.findOne({ where : { username: req.body.username }})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" })
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect"})
            console.log(valid);
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            )
          })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

// exports.login = (req, res, next) => {
//   User.findOne({ where: { username: req.body.username }})
//   .then((data) => {
//     return res.status(200).json({ data })
//   }).catch(error => res.status(500).json({ error }))
// }

// exports.login = (req, res, next) => {
//   User.findOne({ where: { username: req.body.username }})
//   .then(data => {
//     if (data != null) {
//       return res.status(200).json({ data })
//     } else {
//       return res.status(404).json({ error: "User not found" })
//     }
//   }).catch(error => res.status(500).json({ error }))
// }

// exports.login = (req, res, next) => {
//   User.sync().then(() => {
//     return User.findOne();
//   }).then((data) => {
//     console.log(data.toJSON());
//   }).catch((err) => {
//     console.log(err);
//   });
// }

// User.sync().then((data) => {
//   return User.findOne()
// }).then((data) => {
//   console.log(data.toJSON());
// }).catch((err) => {
//   console.log(err);
// })

// Find all users
// const users = await User.findAll();
// console.log(users.every(user => user instanceof User)); // true
// console.log("All users:", JSON.stringify(users, null, 2));

// async function login() {
//     // Find all users
//   await User.findAll();
//   console.log(users.every(user => user instanceof User)); // true
//   console.log("All users:", JSON.stringify(users, null, 2));
// }

// User.sync().then(() => {
//   return User.findOne({ where: { username: "francis" }});
// }).then((user) => {
//   console.log(user.password);
// }).catch((err) => {
//   console.log(err);
// });
