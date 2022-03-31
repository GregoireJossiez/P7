const Sauce = require("../models/sauce")
const fs = require("fs")

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }))
}

exports.createSauce = (req, res ,next) => {
  const sauceObject = JSON.parse(req.body.sauce)
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  })
  sauce.save()
    .then(() => res.status(201).json({ message: "Objet enregistré !"}))
    .catch(error => res.status(400).json({ error }))
}

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body }
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
  .then(() => res.status(200).json({message: "Objet modifié"}))
  .catch(error => res.status(400).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1]
      fs.unlink(`images/${filename}`, () => {
        Sauce.findOne({ _id: req.params.id}).then(
          (sauce) => {
            if (!sauce) {
              return res.status(404).json({
                error: new Error("Objet non trouvé")
              })
            }
            if (sauce.userId !== req.auth.userId) {
              return res.status(401).json({
                error: new Error("Requête non autorisée")
              })
            }
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Objet supprimé"}))
            .catch(error => res.status(400).json({ error }))
          }
        )
      })
    })
    .catch(error => res.status(500).json({ error }))
}

exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId
  const like = req.body.like
  if (like === 1) {
    Sauce.updateOne({ _id: req.params.id},
    {
      $inc: { likes: 1 },
      $push: { usersLiked: userId }
    })
    .then(sauce => res.status(200).json({ message: "Liked" }))
    .catch(error => res.status(404).json({ error }))
  }
  if (like === -1) {
    Sauce.updateOne({ _id: req.params.id},
    {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: userId }
    })
    .then(sauce => res.status(200).json({ message: "Disliked"}))
    .catch(error => res.status(404).json({ error }))
  }
  if (like === 0) {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne({ _id: req.params.id},
        {
          $inc: { likes: -1 },
          $pull: { usersLiked: userId }
        })
        .then(sauce => res.status(200).json({ message: "Unliked"}))
        .catch(error => res.status(400).json({ error }))
      }
      if (sauce.usersDisliked.includes(userId)) {
        Sauce.updateOne({ _id: req.params.id},
        {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: userId }
        })
        .then(sauce => res.status(200).json({ message: "Undisliked"}))
        .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(404).json({ error }))
  }
}
