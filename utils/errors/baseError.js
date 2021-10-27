"use strict";

class BaseError extends Error {
  constructor({
    statusCode,
    description,
    name = "",
    isOperational = false,
  } = {}) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

module.exports = BaseError;
