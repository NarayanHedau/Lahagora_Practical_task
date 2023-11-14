const { commonResponse } = require("../helper");
const { StatusCodes } = require('http-status-codes');


const validateRequest = (schema, data, res, next) => {
    const { error } = schema.validate(data);
    if (error) {
        const validationParameter = error.details[0].path[0];
        const validationType = error.details[0].type;

        const validationIdentifier = validationParameter + '.' + validationType

        const validationIdentifierKey = validationIdentifier.toUpperCase().replace(/\./g, '_');

        const validationError= commonResponse.CustomError( res,validationIdentifierKey, StatusCodes.INTERNAL_SERVER_ERROR);
        returnError(validationError, next);

    }
    return next();
};

function returnError(error, next) {
    next(error);
  }

  
module.exports = {
    validateRequest
}
