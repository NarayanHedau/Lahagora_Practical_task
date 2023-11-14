const express = require("express")
const router = express.Router();
const auth = require("../../helper/auth")
const seriesController = require("../controllers/seriesController")
const validate = require("../validators/seriesValidator")

router.post("/", auth.verify, validate.validatePostRequest, seriesController.createSeries)
router.get("/", auth.verify, seriesController.getAllSeries)
router.get("/:seriesId", auth.verify, validate.validateGetRequest, seriesController.getSeries)
router.patch("/:seriesId", auth.verify, validate.validatePatchRequest, seriesController.updateSeries)
router.delete("/:seriesId", auth.verify, validate.validateDeleteRequest, seriesController.deleteSeries)



module.exports=router