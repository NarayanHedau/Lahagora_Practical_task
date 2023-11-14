
const userModel = require("../../models/usersModel");
const { commonResponse } = require("../../helper");
const bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const config = require("../../config.json");
const roleModel = require("../../models/roleModel");
const { StatusCodes } = require('http-status-codes');

const createNewUser = async (req, res) => {
  try {
    let query = { email: req.body.email }
    const userData = await userModel.findOne(query)
    if (userData) {
        return commonResponse.customResponse(res, "USER_ALREADY_EXIST", StatusCodes.CONFLICT)
    }else{
        let data = req.body;
        bcrypt.genSalt(config.saltRounds, async function (err, salt) {
            bcrypt.hash(data.password, salt, async function (err, hash) {
                data["password"] = hash;
                let user = await userModel.create(data)
                if (user) {
                    return commonResponse.success(res, "USER_REGISTER_SUCCESSFULLY", StatusCodes.OK, user)
                } else {
                    return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", StatusCodes.INTERNAL_SERVER_ERROR);
                }
            })
        });
    }
  } catch (error) {
    console.log("error", error);
    return commonResponse.CustomError(
      res,
      "DEFAULT_INTERNAL_SERVER_ERROR",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const login = async (req, res) => {
  try {
    const { email, password} = req.body;
    let query = { email: email }
    let findUser = await userModel.findOne(query)

    if (!findUser) {
      return commonResponse.customResponse(res, "USER_NOT_FOUND", StatusCodes.NOT_FOUND)
    } else {
      findUser = JSON.parse(JSON.stringify(findUser));
      let matchPasword = await bcrypt.compare(password, findUser.password);
      console.log(">>>>>>>matchPasword", matchPasword);
      if (matchPasword) {
          let token = await jwt.sign(findUser,config.secrete, {
            expiresIn: "24h",
          });

          findUser["token"] = `Bearer ${token}`;
          let response = {
            _id:findUser._id,
            username:findUser.username,
            email:findUser.email,
            roles:findUser.roles,
            token:findUser.token
          }
          return commonResponse.success(res, "USER_LOGIN_SUCCESSFULLY", StatusCodes.OK, response)
        } else {
          return commonResponse.CustomError(res, "INCORRECT_CREDENTIAL", StatusCodes.INTERNAL_SERVER_ERROR,);
        } 
      }
   } catch (error) {
    console.log("error ", error);
    return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log(req.body)
    const userId = req.params.userId; 

    const user = await userModel.findById(userId);
    console.log("user",user)
    if (!user) {
      return commonResponse.CustomError(res, 'USER_NOT_FOUND', StatusCodes.NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("passwordToMatch",passwordMatch)
    if (!passwordMatch) {
      return commonResponse.CustomError(res, 'INCORRECT_PASSWORD', StatusCodes.UNAUTHORIZED);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    console.log("user data",user)
    return commonResponse.success(res, 'PASSWORD_CHANGED_SUCCESSFULLY', StatusCodes.OK);
  } catch (error) {
    console.log('error ', error);
    return commonResponse.CustomError(res, 'DEFAULT_INTERNAL_SERVER_ERROR', StatusCodes.INTERNAL_SERVER_ERROR);
  }
};



module.exports = {
  createNewUser,
  login,
  changePassword
};

