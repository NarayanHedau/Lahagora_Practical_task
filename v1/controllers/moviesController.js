const moviesModel = require("../../models/moviesModel");
const userModel = require("../../models/usersModel");
const { commonResponse } = require("../../helper");
const file = require("../../helper/uploadFile");
const activityLog = require("../../helper/helper");
const { StatusCodes } = require('http-status-codes');

const createNewMovie = async (req, res) => {
  try {
    const reqBody = req.body;
    const method = req.method;
    const baseUrl = req.baseUrl;
    let splitEntity = baseUrl.split("/api/v1/")[1];
    let resource = splitEntity.charAt(0).toUpperCase() + splitEntity.slice(1);

    const user = await userModel.findById(req.userId);
    if (!user) {
      return commonResponse.success(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const movies = await moviesModel.findOne({
      title: reqBody.title,
      name: reqBody.name,
    });
    if (movies) {
      return commonResponse.success(res, "MOVIE_ALREADY_EXIST", StatusCodes.CONFLICT);
    }

    let poster;
    if (req.files && req.files.poster) {
      poster = await file.upload(req.files.poster);
    }
    const reqObj = {
      title: reqBody.title,
      name: reqBody.name,
      genre: reqBody.genre,
      releaseYear: reqBody.releaseYear,
      director: reqBody.director,
      duration: reqBody.duration,
      description: reqBody.description,
      poster: poster,
    };
    const result = await moviesModel(reqObj).save();

    if (result) {
      await activityLog.userActivityLog(req.userId, method, resource);
    }
    return commonResponse.success(res, "MOVIE_CREATED", StatusCodes.CREATED, result);
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllMovie = async (req, res) => {
  try {
    let { title, genre, page, limit } = req.query;

    page = parseInt(page) > 0 ? parseInt(page) : 1;
    limit = parseInt(limit) > 0 ? parseInt(limit) : 20;
    let skip = (page - 1) * limit;

    const query = {
      $or: [
        {
          title: { $regex: title ? new RegExp(title, "i") : "", $options: "i" },
        },
        {
          genre: { $regex: genre ? new RegExp(genre, "i") : "", $options: "i" },
        },
      ],
    };

    const totalCountPipeline = [{ $match: query }, { $count: "totalMovies" }];

    const [totalCountResult] = await moviesModel.aggregate(totalCountPipeline);

    const totalMovies = totalCountResult ? totalCountResult.totalMovies : 0;

    const moviesPipeline = [
      { $match: query },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    ];

    const movies = await moviesModel.aggregate(moviesPipeline);

    return commonResponse.success(res, "MOVIE_FETCHED_SUCCESSFULLY", StatusCodes.OK, {
      movies,
      totalMovies,
    });
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const result = await moviesModel.findById(movieId, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!result) {
      return commonResponse.CustomError(res, "MOVIE_NOT_FOUND", 404);
    }
    return commonResponse.success(
      res,
      "MOVIE_FETCHED_SUCCESSFULLY",
      StatusCodes.OK,
      result
    );
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const updateMovie = async (req, res) => {
  try {
    const method = req.method;
    const baseUrl = req.baseUrl;
    let splitEntity = baseUrl.split("/api/v1/")[1];
    let resource = splitEntity.charAt(0).toUpperCase() + splitEntity.slice(1);
    const movieId = req.params.movieId;
    const reqData = req.body;

    const user = await userModel.findById(req.userId);
    if (!user) {
      return commonResponse.success(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const movies = await moviesModel.findById(movieId);
    if (!movies) {
      return commonResponse.success(res, "MOVIE_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const movieExist = await moviesModel.findOne({ name: reqData.name });

    if (movieExist) {
      return commonResponse.success(res, "MOVIE_NAME_ALREADY_EXIST", StatusCodes.CONFLICT);
    }
    movies.name = reqData.name || movies.name;
    movies.genre = reqData.genre || movies.genre;
    movies.releaseYear = parseInt(reqData.releaseYear) || movies.releaseYear;
    movies.director = reqData.director || movies.director;
    movies.duration = parseInt(reqData.duration) || movies.duration;
    movies.description = reqData.description || movies.description;
    if (req.files && req.files.poster) {
      movies.poster = await file.upload(req.files.poster);
    }
    await movies.save();
    if (movies) {
      await activityLog.userActivityLog(req.userId, method, resource);
    }
    return commonResponse.success(res, "MOVIE_UPDATED", StatusCodes.OK, movies);
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteMovie = async (req, res) => {
  try {
    const method = req.method;
    const baseUrl = req.baseUrl;
    let splitEntity = baseUrl.split("/api/v1/")[1];
    let resource = splitEntity.charAt(0).toUpperCase() + splitEntity.slice(1);
    const movieId = req.params.movieId;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return commonResponse.success(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }
    const movies = await moviesModel.findById(movieId);
    if (!movies) {
      return commonResponse.success(res, "MOVIE_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const result = await moviesModel.deleteOne({ _id: movieId });
    if (result) {
      await activityLog.userActivityLog(req.userId, method, resource);
    }
    return commonResponse.success(res, "MOVIE_DELETED", StatusCodes.OK, result);
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  createNewMovie,
  getAllMovie,
  getMovie,
  updateMovie,
  deleteMovie,
};
