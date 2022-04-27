const User = require("../models/user")
const Post = require("../models/post")
const Like = require("../models/like")
const Sequelize = require("sequelize")
const sequelize = require("../db")
const fs = require("fs")

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

// exports.deleteUser = (req, res, next) => {
//   User.findOne({ where: { id: req.params.id }})
//   .then(user => {
//     if (!user) {
//       return res.status(404).json({
//         error: new Error("User non trouvé")
//       })
//     }
//     if (user.id !== req.auth.userId) {
//       return res.status(401).json({
//         error: new Error("Requête non autorisée")
//       })
//     }
//     User.findOne({ where: { id: req.params.id }})
//     // Post.destroy({ where: { userId: req.params.id }})
//     .then((user) => res.status(200).json({user}))
//     .catch(error => res.status(400).json({ error }))
//   })
//   .catch(error => res.status(500).json({ error }))
// }

exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id }})
  .then(user => {
    if (!user) {
      return res.status(404).json({
        error: new Error("User non trouvé")
      })
    }
    if (user.id !== req.auth.userId) {
      return res.status(401).json({
        error: new Error("Requête non autorisée")
      })
    }
    User.destroy({ where: { id: req.params.id }})
    .then(() => {
      Post.findAll({ where: { userId: req.params.id}})
      .then((posts) => {
        posts.forEach((post) => {
          console.log(post.id);
          if (post.imageUrl != null) {
            const filename = post.imageUrl.split("/images/")[1]
            fs.unlink(`images/${filename}`, () => {
            })
          }
        })
        Post.destroy({ where: { userId: req.params.id }})
        .then(() => res.status(200).json({ message: "Objet supprimé" }))
        .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
  })
  .catch(error => res.status(500).json({ error }))
}

exports.createPost = (req, res ,next) => {
if (!req.file) {
  const post = new Post({
    content: req.body.content,
    userId: req.body.userId,
    authorName: req.body.name,
    authorFamilyName: req.body.familyName,
    imageUrl: null,
    likes: 0
  })
  post.save()
    .then(() => res.status(201).json({ message: "Post enregistré !"}))
    .catch(error => res.status(400).json({ error }))
} else {
  const post = new Post({
    content: req.body.content,
    userId: req.body.userId,
    authorName: req.body.name,
    authorFamilyName: req.body.familyName,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0
  })
  post.save()
    .then(() => res.status(201).json({ message: "Post enregistré !"}))
    .catch(error => res.status(400).json({ error }))
}
}

// exports.modifyPost = (req, res, next) => {
//   const postImage = req.file ?
//     {
//       ...JSON.parse(req.body.sauce),
//       imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
//     } : { ...req.body }
//   Post.updateOne({ where: { id: req.params.id }}, {...postImage, where: { id: req.params.id }})
//   .then(() => res.status(200).json({message: "Objet modifié"}))
//   .catch(error => res.status(400).json({ error }))
// }

// exports.modifyPost = (req, res, next) => {
//   const postImage = req.file ?
//     {
//       content: req.body.content,
//       userId: req.body.userid,
//       authorName: req.body.name,
//       authorFamilyName: req.body.familyName,
//       imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
//     } : { ...req.body }
//   Post.update({ where: { id: req.params.id }}, {...postImage, where: { id: req.params.id }})
//   .then(() => res.status(200).json({message: "Objet modifié"}))
//   .catch(error => res.status(400).json({ error }))
// }

exports.modifyPost = (req, res, next) => {
  if (!req.file) {
    if (req.body.imgRemoved === "true") {
      const filename = req.body.imageUrl.split("/images/")[1]
      fs.unlink(`images/${filename}`, () => {
        Post.update({
          content: req.body.content,
          imageUrl: null
        }, {
          where: {
            id: req.params.id
          }})
        .then(() => res.status(200).json({message: "Objet modifié - imgRemoved1" + " " + filename}))
        .catch(error => res.status(400).json({ error }))
      })
    } else {
      Post.update({
        content: req.body.content,
      }, {
        where: {
          id: req.params.id
        }})
      .then(() => res.status(200).json({message: "Objet modifié - ONLY TEXT"}))
      .catch(error => res.status(400).json({ error }))
      }
    } else {
      if (req.body.imgRemoved == true) {
        Post.update({
          content: req.body.content,
          imageUrl: null
        }, {
          where: {
            id: req.params.id
          }})
        .then(() => res.status(200).json({message: "Objet modifié - imgRemoved2"}))
        .catch(error => res.status(400).json({ error }))
      } else {
        Post.update({
          content: req.body.content,
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        }, {
          where: {
            id: req.params.id
          }})
        .then(() => res.status(200).json({message: "Objet modifié"}))
        .catch(error => res.status(400).json({ error }))
      }
  }
}

exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id }})
    .then(post => {
      if (!post) {
        return res.status(404).json({
          error: new Error("Objet non trouvé")
        })
      }
      if (post.userId !== req.auth.userId) {
        return res.status(401).json({
          error: new Error("Requête non autorisée")
        })
      }
      if (post.imageUrl != null) {
        const filename = post.imageUrl.split("/images/")[1]
        fs.unlink(`images/${filename}`, () => {
          // Post.findOne({ where: { id: req.params.id }}).then(
          //   (post) => {
          //     if (!post) {
          //       return res.status(404).json({
          //         error: new Error("Objet non trouvé")
          //       })
          //     }
          //     if (post.userId !== req.auth.userId) {
          //       return res.status(401).json({
          //         error: new Error("Requête non autorisée")
          //       })
          //     }
          //     Post.destroy({ where: { id: req.params.id }})
          //     .then(() => res.status(200).json({message: "Objet supprimé"}))
          //     .catch(error => res.status(400).json({ error }))
          //   }
          // )
        })
      }
      Post.destroy({ where: { id: req.params.id }})
      .then(() => res.status(200).json({message: "Objet supprimé"}))
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}

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
