const User = require("../models/user")
const Post = require("../models/post")
const Like = require("../models/like")
const Sequelize = require("sequelize")
const sequelize = require("../db")
const fs = require("fs")

// exports.getAllPosts = (req, res, next) => {
//   Post.findAll({
//     order: [
//       ['id', 'DESC']
//     ]
//   })
//     .then(posts => res.status(200).json(posts))
//     .catch(error => res.status(400).json({ error }))
// }

exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [
      ['id', 'DESC']
    ],
    include: {
      model: User
    }
  })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(400).json({ error }))
}

exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id }})
  .then(user => res.status(200).json(user))
  .catch(error => res.status(404).json({ error }))
}

// exports.createSauce = (req, res ,next) => {
//   const sauceObject = JSON.parse(req.body.sauce)
//   const sauce = new Sauce({
//     ...sauceObject,
//     imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
//     likes: 0,
//     dislikes: 0,
//     usersLiked: [],
//     usersDisliked: []
//   })
//   sauce.save()
//     .then(() => res.status(201).json({ message: "Objet enregistré !"}))
//     .catch(error => res.status(400).json({ error }))
// }

// exports.createPost = (req, res ,next) => {
//   const post = new Post({
//     content: req.body.content,
//     userId: req.body.userId,
//     authorName: req.body.name,
//     authorFamilyName: req.body.familyName,
//     imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
//     likes: 0
//   })
//   post.save()
//     .then(() => res.status(201).json({ message: "Post enregistré !"}))
//     .catch(error => res.status(400).json({ error }))
// }

exports.createPost = (req, res ,next) => {
  const postObject = JSON.parse(req.body.post)
  const post = new Post({
    ...postObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0
  })
  post.save()
    .then(() => res.status(201).json({ message: "Post enregistré !"}))
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
  const postId = req.body.postId
  const like = req.body.like
  if (like === 1) {
    Post.updateOne({ where : { id: req.body.postId }},
    {
      $inc: { likes: 1 },
      $push: { usersLiked: userId }
    })
    .then(post => res.status(200).json({ message: "Liked" }))
    .catch(error => res.status(404).json({ error }))
  }
  if (like === -1) {
    Post.updateOne({ _id: req.params.id},
    {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: userId }
    })
    .then(post => res.status(200).json({ message: "Disliked"}))
    .catch(error => res.status(404).json({ error }))
  }
  if (like === 0) {
    Post.findOne({ _id: req.params.id})
    .then(post => {
      if (sauce.usersLiked.includes(userId)) {
        Post.updateOne({ _id: req.params.id},
        {
          $inc: { likes: -1 },
          $pull: { usersLiked: userId }
        })
        .then(post => res.status(200).json({ message: "Unliked"}))
        .catch(error => res.status(400).json({ error }))
      }
      if (post.usersDisliked.includes(userId)) {
        Post.updateOne({ _id: req.params.id},
        {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: userId }
        })
        .then(post => res.status(200).json({ message: "Undisliked"}))
        .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(404).json({ error }))
  }
}

// exports.likePost = (req, res, next) => {
//   Post.increment({ likes: 1}, { where: { id: req.body.postId }})
//   .then(post => res.status(200).json({ message: "Liked" }))
//   .catch(error => res.status(404).json({ error }))
// }

// exports.likePost = (req, res, next) => {
//   Like.findAll({ where: {
//     postId: req.body.postId,
//     userId: req.body.userId
//   }})
//   .then(post => {
//     let hasLiked = post.hasLiked
//     const like = new Like({
//       hasLiked: 1,
//       userId: req.body.userId,
//       postId: req.body.postId,
//       userNames: req.body.userNames
//     })
//     like.save()
//     .then(() => res.status(201).json({ message: "Post liked"}))
//     .catch(error => res.status(400).json({ error }))
//   })
//   .catch(error => res.status(404).json({ error }))
// }

// exports.likePost = (req, res, next) => {
//   Like.findAll({ where: {
//     postId: req.body.postId,
//     userId: req.body.userId
//   }})
//   .then((post) => {
//     if (!post.length) {
//       return res.status(404).json({ message: "No data" })
//     } else {
//       return res.status(200).json({ post })
//     }
//   })
//   .catch(error => res.status(404).json({ error }))
// }

// exports.getLike = (req, res, next) => {
//   Like.findOne({ where: {
//     postId: req.params.id,
//     userId: req.params.userid
//   }})
//   .then(data => res.status(200).json(data))
//   .catch(error => res.status(400).json({ error }))
// }

exports.likePost = (req, res, next) => {
  const like = req.body.like
  Like.findAll({ where: {
    postId: req.body.postId,
    userId: req.body.userId
  }})
  .then(data => {
    if (!data.length) {
      let hasLiked = data.hasLiked
      const like = new Like({
        hasLiked: 1,
        userId: req.body.userId,
        postId: req.body.postId,
        userNames: req.body.userNames
      })
      like.save()
      Post.increment({ likes: 1}, { where: { id: req.body.postId }})
      .then(() => res.status(201).json({ message: "Post liked"}))
      .catch(error => res.status(400).json({ error }))
    }else {
      if (like === 0) {
        Like.update({ hasLiked: 0 }, {
          where: {
            postId: req.body.postId,
            userId: req.body.userId
          }
        })
        Post.increment({ likes: -1}, { where: { id: req.body.postId }})
        .then(data => res.status(200).json({ message: "Unliked" }))
        .catch(error => res.status(400).json({ error }))
      } else {
        Like.update({ hasLiked: 1 }, {
          where: {
            postId: req.body.postId,
            userId: req.body.userId
          }
        })
        Post.increment({ likes: 1}, { where: { id: req.body.postId }})
        .then(data => res.status(200).json({ message: "Liked" }))
        .catch(error => res.status(400).json({ error }))
      }
    }
  })
  .catch(error => res.status(404).json({ error }))
}
