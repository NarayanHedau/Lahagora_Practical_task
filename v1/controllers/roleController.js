const userModel = require("../../models/usersModel");
const roleModel = require("../../models/roleModel");
const { commonResponse } = require("../../helper");
const { StatusCodes } = require('http-status-codes');


const createNewRole = async (req, res) => {
  try {
    const roleData = req.body;

    const userData = await userModel.findById(roleData.userId);
    console.log(userData);
    if (!userData) {
      return commonResponse.customResponse(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const findRole = await roleModel.findOne({ userId: roleData.userId });
    console.log("findRole data", findRole);
    if (findRole) {
      return commonResponse.customResponse(res, "USER_ALREADY_HAS_ROLE", StatusCodes.NOT_FOUND);
    }

    if (userData.roles === "User") {
      let permissionsObj = {};
      for (const key of roleData.permissions) {
        let entity_name = key.entityName;
        permissionsObj[entity_name] = key.access;
      }

      const newRole = new roleModel({
        entityName: roleData.entityName,
        userId: roleData.userId,
        permissions: permissionsObj,
      });

      await newRole.save();
      userData.roleId = newRole._id
      await userData.save();

      const response = {
        entityName: newRole.entityName,
        userId: newRole.userId,
        permissions: newRole.permissions,
      };

      return commonResponse.success(
        res,
        "ROLE_CREATED_SUCCESSFULLY",
        StatusCodes.CREATED,
        response
      );
    }
  } catch (error) {
    console.log(error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllRole = async (req, res) => {
  try {
    let {page, limit } = req.query;

    page = parseInt(page) > 0 ? parseInt(page) : 1;
    limit = parseInt(limit) > 0 ? parseInt(limit) : 20;
    let skip = (page - 1) * limit;

    const result = await roleModel.find().skip(skip).limit(limit)
    return commonResponse.success(
      res,
      "ROLE_FETCHED",
      StatusCodes.OK,
      result
    );
  } catch (error) {
    console.log(error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

const getRole = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const role = await roleModel.findById(roleId).populate("userId", {password:0, updatedAt:0, createdAt:0, __v:0});

    if (!role) {
      return commonResponse.customResponse(res, "ROLE_NOT_FOUND", StatusCodes.NOT_FOUND);
    }
    return commonResponse.success(
      res,
      "ROLE_FETCHED",
      StatusCodes.OK,
      role
    );

  } catch (error) {
    console.log(error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

const updateRole = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const roleData = req.body;

    const findUser = await userModel.findById(roleData.userId);

    if (!findUser) {
      return commonResponse.customResponse(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    const role = await roleModel.findById(roleId);

    if (!role) {
      return commonResponse.customResponse(res, "ROLE_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    role.permissions=roleData.permissions

    await role.save();

    return commonResponse.success( res,"ROLE_UPDATED_SUCCESSFULLY", StatusCodes.OK, role);
  } catch (error) {
    console.error("Error:", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteRole = async (req, res) =>{
  try {
    const roleId = req.params.roleId;
    const role = await roleModel.findById(roleId);

    if (!role) {
      return commonResponse.customResponse(res, "ROLE_NOT_FOUND", StatusCodes.NOT_FOUND);
    }

    if (role.userId) {
      const findUser = await userModel.findById(role.userId);

      if (!findUser) {
        return commonResponse.customResponse(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND);
      }
      findUser.roleId = null
      await findUser.save();
    }

    const result = await roleModel.deleteOne({ _id: roleId });
    return commonResponse.success(res, "ROLE_DELETED", StatusCodes.OK, result);
  } catch (error) {
    console.error("Error:", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  createNewRole,
  getAllRole,
  getRole,
  updateRole,
  deleteRole
};
