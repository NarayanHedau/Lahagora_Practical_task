const express = require("express")
const router = express.Router();
const userController = require("../controllers/userController")
const auth = require("../../helper/auth")
const validate = require("../validators/userValidator")

router.post("/register", validate.validateRegisterRequest, userController.createNewUser)
router.post("/login", validate.validateLoginRequest, userController.login)
router.patch("/changePassword/:userId",userController.changePassword)

module.exports=router