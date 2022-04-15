const express = require("express")
const router = express.Router()

const multer = require("../middleware/multer-config")
const postCtrl = require("../controllers/post")
const auth = require("../middleware/auth")

router.get('/', auth, postCtrl.getAllPosts);
router.get("/user/:id", auth, postCtrl.getOneUser)
// router.put("/user/:id", auth, multer, postCtrl.modifyUser)
router.post("/", auth, multer, postCtrl.createPost)
router.put("/:id", auth, multer, postCtrl.modifySauce)
router.delete("/:id", auth, postCtrl.deleteSauce)
router.post("/like", auth, postCtrl.likePost)

module.exports = router
