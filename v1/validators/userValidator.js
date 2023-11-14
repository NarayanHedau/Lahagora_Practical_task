const { validateRequest } = require("../../helper/validate");
const Joi = require("joi");



const validateRegisterRequest = async (req, res, next) => {
    const validateSchema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      roles: Joi.string().required(),
    }).options({ allowUnknown: false });
  
    validateRequest(validateSchema, req.body, res, next);
  };

const validateLoginRequest = async (req, res, next) => {
    const validateSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }).options({ allowUnknown: false });
  
    validateRequest(validateSchema, req.body, res, next);
  };
module.exports.validateRegisterRequest = validateRegisterRequest;
module.exports.validateLoginRequest = validateLoginRequest;
