const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const Sequelize = require("sequelize")

const sequelize = require("../db")

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        name: req.body.name,
        familyName: req.body.familyName,
        password: hash
      })
      user.save()
        .then(() => {
          User.findOne({ where : { email: req.body.email }})
            .then(user => {
              if (!user) {
                return res.status(401).json({ error: "Utilisateur non trouvé" })
              }
              bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                  if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect"})
                  }
                  res.status(200).json({
                    userId: user.id,
                    name: user.name,
                    familyName: user.familyName,
                    avatar: user.avatar,
                    admin: user.admin,
                    token: jwt.sign(
                      { userId: user.id,
                      admin: user.admin },
                      "RANDOM_TOKEN_SECRET",
                      { expiresIn: "24h" }
                    )
                  })
                })
                .catch(error => res.status(500).json({ error }))
            })
            .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res ,next) => {
  User.findOne({ where : { email: req.body.email }})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé" })
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect"})
          }
          res.status(200).json({
            userId: user.id,
            name: user.name,
            familyName: user.familyName,
            avatar: user.avatar,
            admin: user.admin,
            token: jwt.sign(
              { userId: user.id,
              admin: user.admin },
              "RANDOM_TOKEN_SECRET",
              { expiresIn: "24h" }
            )
          })
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
