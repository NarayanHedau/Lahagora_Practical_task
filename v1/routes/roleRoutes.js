const express = require("express")
const router = express.Router();
const roleController = require("../controllers/roleController")
const auth = require("../../helper/auth")
const validate = require("../validators/roleValidator")


router.post("/", auth.verify, validate.validatePostRequest, roleController.createNewRole)
router.get("/", auth.verify, roleController.getAllRole)
router.get("/:roleId", auth.verify, validate.validateGetRequest, roleController.getRole)
router.patch("/:roleId", auth.verify, validate.validatePatchRequest, roleController.updateRole)
router.delete("/:roleId", auth.verify, validate.validateDeleteRequest, roleController.deleteRole)


module.exports=router