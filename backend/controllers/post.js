const User = require("../models/user")
const Post = require("../models/post")
const Like = require("../models/like")
const Comment = require("../models/comment")
const Sequelize = require("sequelize")
const sequelize = require("../db")
const fs = require("fs")
const bcrypt = require("bcrypt")

exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [
      ['id', 'DESC']
    ],
    include: [
      {
        model: User
      },
      {
        model: Comment
      }
    ]
  })
  .then((posts) => {
    User.findAll()
    .then((users) => {
      posts.forEach((post) => {
        users.forEach((user) => {
          if (user.dataValues.id === post.dataValues.userId) {
            post.dataValues.userAvatar = user.dataValues.avatar
          }
          post.dataValues.comments.forEach((comment) => {
            if (user.dataValues.id === comment.dataValues.userId) {
              comment.dataValues.userAvatar = user.dataValues.avatar
            }
          });
        });
      });

      return res.status(200).json(posts)
    })
    .catch(error => res.status(400).json({ error }))
  })
  .catch(error => res.status(400).json({ error }))
}

exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id }})
  .then(user => res.status(200).json(user))
  .catch(error => res.status(404).json({ error }))
}

exports.modifyUser = (req, res, next) => {
  // Change AVATAR
  if (req.file) {
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
      const filename = user.avatar.split("/images/")[1]
      if (filename != "default-avatar-1.jpeg") {
        fs.unlink(`images/${filename}`, () => {
        })
      }
      User.update({
        avatar: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      }, {
        where: {
        id: req.params.id
      }})
      .then(() => res.status(200).json({ message: "Avatar changed" + " " + req.file.filename }))
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
  }

  // Change NAMES & EMAIL
  if (req.body.function === "names") {
    User.update({
    name: req.body.name,
    familyName: req.body.familyName,
    email: req.body.email
  }, {
    where: {
      id: req.params.id
    }})
    .then(() => {
      Post.update({
        authorName: req.body.name,
        authorFamilyName: req.body.familyName
      }, {
      where: {
        userId: req.params.id
      }})
      // .then(() => res.status(200).json({ message: "User info updated" }))
      .then(() => {
        Comment.update({
          userNames: req.body.name + " " + req.body.familyName
        }, {
          where: {
            userId: req.params.id
          }})
          .then(() => res.status(200).json({ message: "User info updated" }))
          .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(400).json({ error }))
  }

  // Change PASSWORD
  if (req.body.function === "password") {
    User.findOne({ where: { id: req.params.id }})
    .then(user => {
      bcrypt.compare(req.body.currentPassword, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: "Incorrect password"})
        }
        bcrypt.hash(req.body.newPassword, 10)
        .then(hash => {
          User.update({
            password: hash
          }, {
            where: {
              id: req.params.id
          }})
          .then(() => res.status(200).json({ message: "Password changed" }))
          .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(404).json({ error }))
  }
}

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
    Comment.destroy({ where: { userId: req.params.id }})
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
      if (!req.admin) {
        if (post.userId !== req.auth.userId) {
          return res.status(401).json({
            error: new Error("Requête non autorisée")
          })
        }
      }
      if (post.imageUrl != null) {
        const filename = post.imageUrl.split("/images/")[1]
        fs.unlink(`images/${filename}`, () => {

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

exports.postComment = (req, res, next) => {
  const comment = new Comment({
    userNames: req.body.userNames,
    content: req.body.content,
    postId: req.body.postId,
    userId: req.body.userId
  })
  comment.save()
    .then(() => res.status(201).json({ message: "Comment posted !"}))
    .catch(error => res.status(400).json({ error }))
}

exports.modifyComment = (req, res, next) => {
  Comment.update({
    content: req.body.content
  }, {
    where: {
      id: req.params.id
    }})
  .then(() => res.status(200).json({message: "Comment modifed"}))
  .catch(error => res.status(400).json({ error }))
}

exports.deleteComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id }})
    .then(comment => {
      if (!comment) {
        return res.status(404).json({
          error: new Error("Objet non trouvé")
        })
      }
      if (!req.admin) {
        if (comment.userId !== req.auth.userId) {
          return res.status(401).json({
            error: new Error("Requête non autorisée")
          })
        }
      }
      Comment.destroy({ where: { id: req.params.id }})
      .then(() => res.status(200).json({message: "Objet supprimé"}))
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
}
