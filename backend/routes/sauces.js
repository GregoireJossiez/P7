const express = require("express")
const router = express.Router()

const multer = require("../middleware/multer-config")
const saucesCtrl = require("../controllers/sauces")
const auth = require("../middleware/auth")

router.get('/', auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce)
router.post("/", auth, multer, saucesCtrl.createSauce)
router.put("/:id", auth, multer, saucesCtrl.modifySauce)
router.delete("/:id", auth, saucesCtrl.deleteSauce)
router.post("/:id/like", auth, saucesCtrl.likeSauce)

module.exports = router
