const userActivityModel = require("../models/activityLogModel");

exports.userActivityLog = async (userId, method, resource) => {
  let action;
  if (method == "POST") {
    action = "Create";
  } else if (method == "PATCH") {
    action = "Update";
  } else if (method == "DELETE") {
    action = "Delete";
  }
  const data = {
    userId: userId,
    action: action,
    resource: resource,
  };
  let activityStore = new userActivityModel(data);
  return await activityStore.save();
};

