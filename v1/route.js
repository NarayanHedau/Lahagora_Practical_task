const express = require('express');

const router = express.Router();
const userRouter = require("../v1/routes/userRouter");
router.use('/user', userRouter);

const roleRoute = require("../v1/routes/roleRoutes")
router.use('/role', roleRoute);

const movieRoute = require("./routes/moviesRoutes")
router.use('/movies', movieRoute);

const seriesRoute = require("./routes/seriesRoutes")
router.use('/series', seriesRoute);

const userActivityLogRoutes = require("./routes/userActivityLogRoutes")
router.use('/userActivityLog', userActivityLogRoutes);

module.exports=router