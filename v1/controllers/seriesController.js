const seriesModel = require("../../models/seriesModel");
const userModel = require("../../models/usersModel");
const { commonResponse } = require("../../helper");
const file = require("../../helper/uploadFile");
const activityLog = require("../../helper/helper");
const { StatusCodes } = require('http-status-codes');

const createSeries = async (req, res) => {
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

    const series = await seriesModel.findOne({
      title: reqBody.title,
      name: reqBody.name,
    });
    if (series) {
      return commonResponse.success(res, "SERIES_ALREADY_EXIST", StatusCodes.CONFLICT);
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
    const result = await seriesModel(reqObj).save();

    if (result) {
      await activityLog.userActivityLog(req.userId, method, resource);
    }
    return commonResponse.success(res, "SERIES_CREATED", StatusCodes.CREATED, result);
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllSeries = async (req, res) => {
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

    const totalCountPipeline = [{ $match: query }, { $count: "totalSeries" }];

    const [totalCountResult] = await seriesModel.aggregate(totalCountPipeline);

    const totalSeries = totalCountResult ? totalCountResult.totalSeries : 0;

    const seriesPipeline = [
      { $match: query },
      { $skip: skip },
      { $limit: limit },
      { $sort: { createdAt: -1 } },
    ];

    const series = await seriesModel.aggregate(seriesPipeline);

    return commonResponse.success(res, "SERIES_FETCHED_SUCCESSFULLY", StatusCodes.OK, {
      series,
      totalSeries,
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

const getSeries = async (req, res) => {
  try {
    const seriesId = req.params.seriesId;
    const result = await seriesModel.findById(seriesId, {
      createdAt: 0,
      updatedAt: 0,
      __v: 0,
    });
    if (!result) {
      return commonResponse.CustomError(res, "SERIES_NOT_FOUND", 404);
    }
    return commonResponse.success(
      res,
      "SERIES_FETCHED_SUCCESSFULLY",
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

const updateSeries = async (req, res) => {
  try {
    const method = req.method;
    const baseUrl = req.baseUrl;
    let splitEntity = baseUrl.split("/api/v1/")[1];
    let resource = splitEntity.charAt(0).toUpperCase() + splitEntity.slice(1);
    const seriesId = req.params.seriesId;
    const reqData = req.body;

    const user = await userModel.findById(req.userId);
    if (!user) {
      return commonResponse.success(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const series = await seriesModel.findById(seriesId);
    if (!series) {
      return commonResponse.success(res, "SERIES_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const seriesExist = await seriesModel.findOne({ name: reqData.name });

    if (seriesExist) {
      return commonResponse.success(res, "SERIES_NAME_ALREADY_EXIST", StatusCodes.CONFLICT);
    }
    series.name = reqData.name || series.name;
    series.genre = reqData.genre || series.genre;
    series.releaseYear = parseInt(reqData.releaseYear) || series.releaseYear;
    series.director = reqData.director || series.director;
    series.duration = parseInt(reqData.duration) || series.duration;
    series.description = reqData.description || series.description;
    if (req.files && req.files.poster) {
      series.poster = await file.upload(req.files.poster);
    }
    await series.save();
    if (series) {
        await activityLog.userActivityLog(req.userId, method, resource);
      }
    return commonResponse.success(res, "SERIES_UPDATED", StatusCodes.OK, series);
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteSeries = async (req, res) => {
  try {
    const method = req.method;
    const baseUrl = req.baseUrl;
    let splitEntity = baseUrl.split("/api/v1/")[1];
    let resource = splitEntity.charAt(0).toUpperCase() + splitEntity.slice(1);
    const seriesId = req.params.seriesId;
    const user = await userModel.findById(req.userId);
    if (!user) {
      return commonResponse.success(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }
    const series = await seriesModel.findById(seriesId);
    if (!series) {
      return commonResponse.success(res, "SERIES_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const result = await seriesModel.deleteOne({ _id: seriesId });
    if (result) {
        await activityLog.userActivityLog(req.userId, method, resource);
      }
    return commonResponse.success(res, "SERIES_DELETED", StatusCodes.OK, result);
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
  createSeries,
  getAllSeries,
  getSeries,
  updateSeries,
  deleteSeries,
};
