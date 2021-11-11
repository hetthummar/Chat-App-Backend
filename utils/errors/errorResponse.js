const httpStatusCodes = require("../../constants/httpStatusCodes");
const BaseError = require("./baseError");

const errorResponse = {
  Api400Error({
    name: name = "BAD_REQUEST",
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = "Bad Request",
    isOperational = true,
  } = {}) {
    return new BaseError({
      name: name,
      statusCode: statusCode,
      description: description,
      isOperational: isOperational,
    });
  },

  Api404Error({
    name: name = "NOT_FOUND",
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not Found",
    isOperational = true,
  } = {}) {
    return new BaseError({
      name: name,
      statusCode: statusCode,
      description: description,
      isOperational: isOperational,
    });
  },

  Api500Error({
    name: name = "INTERNAL_SERVER",
    statusCode = httpStatusCodes.INTERNAL_SERVER,
    description = "Internal Server Error",
    isOperational = true,
  } = {}) {
    return new BaseError({
      name: name,
      statusCode: statusCode,
      description: description,
      isOperational: isOperational,
    });
  },

  Api409Error({
    name: name = "USER_EXIST",
    statusCode = httpStatusCodes.USER_EXIST,
    description = "User already exist",
    isOperational = true,
  } = {}) {
    return new BaseError({
      name: name,
      statusCode: statusCode,
      description: description,
      isOperational: isOperational,
    });
  },

  idNotFoundError({
    name: name = "BAD_REQUEST",
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Id not Found",
    isOperational = true,
  } = {}) {
    return new BaseError({
      name: name,
      statusCode: statusCode,
      description: description,
      isOperational: isOperational,
    });
  },

  invalidId({
    name: name = "INVALID_ID",
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = "Id is invalid",
    isOperational = true,
  } = {}) {
    return new BaseError({
      name: name,
      statusCode: statusCode,
      description: description,
      isOperational: isOperational,
    });
  },

};

module.exports = errorResponse;
