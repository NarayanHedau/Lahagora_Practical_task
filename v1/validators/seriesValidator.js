const { validateRequest } = require("../../helper/validate");
const Joi = require("joi");

const validatePostRequest = async (req, res, next) => {
  const validateSchema = Joi.object({
    title: Joi.string().required(),
    name: Joi.string().required(),
    genre: Joi.string().required(),
    releaseYear: Joi.number().integer().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    description: Joi.string().required(),
    poster: Joi.string().allow(""),
  }).options({ allowUnknown: false });

  validateRequest(validateSchema, req.body, res, next);
};

const validateGetRequest = async (req, res, next) => {
  const validateSchema = Joi.object({
    seriesId: Joi.string().required(),
  }).options({ allowUnknown: false });

  validateRequest(validateSchema, req.params, res, next);
};

const validatePatchRequest = async (req, res, next) => {
  const validateSchema = Joi.object({
    seriesId: Joi.string().required(),
    title: Joi.string(),
    name: Joi.string(),
    genre: Joi.string(),
    releaseYear: Joi.number().integer(),
    director: Joi.string(),
    duration: Joi.number().integer(),
    description: Joi.string(),
    poster: Joi.string().allow(""),
  }).options({ allowUnknown: false });

  validateRequest(validateSchema, {...req.body, ...req.params}, res, next);
};

const validateDeleteRequest = async (req, res, next) => {
    const validateSchema = Joi.object({
        seriesId: Joi.string().required(),
    }).options({ allowUnknown: false });
  
    validateRequest(validateSchema, req.params, res, next);
  };
module.exports.validatePostRequest = validatePostRequest;
module.exports.validateGetRequest = validateGetRequest;
module.exports.validatePatchRequest = validatePatchRequest;
module.exports.validateDeleteRequest = validateDeleteRequest
