const jwt = require("jsonwebtoken");
const config = require("../config.json");
const { commonResponse } = require("../helper");
const roleModel = require("../models/roleModel");
const { error } = require("./commonResponse");

module.exports = {
  verify: async (req, res, next) => {
    try {
      const reqMethod = req.method;
      const entity = req.baseUrl;

      let splitEntity = entity.split("/api/v1/")[1];

      let method = {
        create: "POST",
        read: "GET",
        update: "PATCH",
        delete: "DELETE",
      };

      let storeKey;
      for (let [key, value] of Object.entries(method)) {
        if (reqMethod == value) {
          storeKey = key;
        }
        console.log(value)
      }
      const header = req.headers.authorization;
      if (!header) {
        return res.status(401).send({
          success: false,
          message: "Please provide token",
          statusCode: 401,
        });
      }
      const token = header.split(" ")[1];
      const isVerified = jwt.verify(token, config.secrete);
      if (isVerified) {
        req["userId"] = isVerified._id;
        if (isVerified.roles === "Admin") {
          return next();
        }
        req["roleId"] = isVerified.roleId;
        const role = await roleModel.findById(isVerified.roleId);
        if (!role) {
          return res.status(404).send({
            success: false,
            message: "Role Not found! First you need to be assign the role.",
            statusCode: 404,
          });
        }
        const hasPermission = Object.keys(role.permissions).some((entityKey) => {
          const permissions = role.permissions[entityKey];
          return (
            entityKey.toLowerCase() === splitEntity.toLowerCase() &&
            permissions.includes(storeKey)
          );
        });
        if (hasPermission) {
          return next();
        } else {
          return res.status(401).send({
            success: true,
            message: "Unauthorized Access",
            statusCode: 401,
          });
        }
      } else {
        return res.status(401).send({
          error: true,
          message: "Unauthorized Access",
          statusCode: 401,
        });
      }
    
    } catch (error) {
      console.log(error);
    }
  },
};
