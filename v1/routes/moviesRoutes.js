const express = require("express")
const router = express.Router();
const auth = require("../../helper/auth")
const moviesController = require("../controllers/moviesController")
const validate = require("../validators/moviesValidator")

router.post("/", auth.verify, validate.validatePostRequest, moviesController.createNewMovie)
router.get("/", auth.verify, moviesController.getAllMovie)
router.get("/:movieId", auth.verify, validate.validateGetRequest, moviesController.getMovie)
router.patch("/:movieId", auth.verify, validate.validatePatchRequest, moviesController.updateMovie)
router.delete("/:movieId", auth.verify, validate.validateDeleteRequest, moviesController.deleteMovie)



module.exports=router