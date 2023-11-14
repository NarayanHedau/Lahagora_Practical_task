const { validateRequest } = require("../../helper/validate");
const Joi = require("joi");

const validatePostRequest = async (req, res, next) => {
    const validateSchema = Joi.object({
      permissions: Joi.array().required(),
      userId: Joi.string().required(),
    }).options({ allowUnknown: false });
  
    validateRequest(validateSchema, req.body, res, next);
  };

const validateGetRequest = async (req, res, next) => {
  const validateSchema = Joi.object({
    roleId: Joi.string().required(),
  }).options({ allowUnknown: false });

  validateRequest(validateSchema, req.params, res, next);
};

const validatePatchRequest = async (req, res, next) => {
  const validateSchema = Joi.object({
    roleId: Joi.string().required(),
    permissions: Joi.object(),
    userId: Joi.string(),
  }).options({ allowUnknown: false });

  validateRequest(validateSchema, {...req.body, ...req.params}, res, next);
};

const validateDeleteRequest = async (req, res, next) => {
    const validateSchema = Joi.object({
        roleId: Joi.string().required(),
    }).options({ allowUnknown: false });
  
    validateRequest(validateSchema, req.params, res, next);
  };
module.exports.validatePostRequest = validatePostRequest;
module.exports.validateGetRequest = validateGetRequest;
module.exports.validatePatchRequest = validatePatchRequest;
module.exports.validateDeleteRequest = validateDeleteRequest
