const moviesModel = require("../../models/moviesModel");
const userModel = require("../../models/usersModel");
const activityModel = require("../../models/activityLogModel")
const { commonResponse } = require("../../helper");
const file = require("../../helper/uploadFile");
const activityLog = require("../../helper/helper");
const { StatusCodes } = require('http-status-codes');

const getAllActivityLogs = async (req, res) => {
    try {
      const activityLogs = await activityModel.find();
  
      const summary = {};
      activityLogs.forEach((log) => {
        const { resource, action } = log;
        if (!summary[resource]) {
          summary[resource] = {
            createCount: 0,
            updateCount: 0,
            deleteCount: 0,
          };
        }
  
        switch (action) {
          case "Create":
            summary[resource].createCount++;
            break;
          case "Update":
            summary[resource].updateCount++;
            break;
          case "Delete":
            summary[resource].deleteCount++;
            break;
        }
      });
  
      return commonResponse.success(res, "USER_ACTIVITY_LOG_FETCHED_SUCCESSFULLY", StatusCodes.OK, {
        summary: summary,
        data: activityLogs,
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
  const getSingleActivityLog = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findById(userId);
  
      if (!user) {
        return commonResponse.success(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
      }
  
      const activityLogs = await activityModel.find({ userId: user._id });
  
      if (!activityLogs || activityLogs.length === 0) {
        return commonResponse.success(res, "ACTIVITY_LOG_NOT_FOUND", StatusCodes.NOT_FOUND);
      }
  
      const summary = {};
      activityLogs.forEach((log) => {
        const { resource, action } = log;
        if (!summary[resource]) {
          summary[resource] = {
            createCount: 0,
            updateCount: 0,
            deleteCount: 0,
          };
        }
  
        switch (action) {
          case "Create":
            summary[resource].createCount++;
            break;
          case "Update":
            summary[resource].updateCount++;
            break;
          case "Delete":
            summary[resource].deleteCount++;
            break;
        }
      });
  
      return commonResponse.success(res, "USER_ACTIVITY_LOG_FETCHED_SUCCESSFULLY", StatusCodes.OK, {
        summary: summary,
        data: activityLogs,

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
  

module.exports = {getAllActivityLogs, getSingleActivityLog};
  