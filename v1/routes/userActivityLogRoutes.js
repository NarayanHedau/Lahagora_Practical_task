const express = require("express")
const router = express.Router();
const auth = require("../../helper/auth")
const userActivityController = require("../controllers/userActivityLogController")
const validate = require("../validators/moviesValidator")

router.get("/", auth.verify, userActivityController.getAllActivityLogs)

router.get("/:userId", auth.verify, userActivityController.getSingleActivityLog)

module.exports=router