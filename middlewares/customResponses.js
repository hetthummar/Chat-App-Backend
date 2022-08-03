const customResponses = {

  customizedErrorOutPut(message, statusCode) {
    return this.status(statusCode).json({
      success: false,
      error: message,
    });
  },

  dataUpdateSuccess({ message = "Data Updated Successfully" } = {}) {
    return this.status(200).json({
      success: true,
      message: message,
    });
  },

  dataFetchSuccess({ data = {}, message = "Data retrieve Successfully" } = {}) {
    return this.status(200).json({
      success: true,
      data: data,
      message: message,
    });
  },

  unauthorized({ message = "unauthorized" } = {}) {
    return this.status(401).json({
      success: false,
      error: message,
    });
  },

  notFound({ message = "not found" } = {}) {
    return this.status(404).json({
      success: false,
      error: message,
    });
  },


  serverError({ message = "Internal Server Error" } = {}) {
    return this.status(500).json({
      success: false,
      error: message,
    });
  },

  validationError({ message = "Validation Error" } = {}) {
    return this.status(400).json({
      success: false,
      error: message,
    });
  },

  userAlreadyExist({ message = "User already exist" } = {}) {
    return this.status(409).json({
      success: false,
      error: message,
    });
  },
};

module.exports = (req, res, next) => {
  Object.assign(res, customResponses);
  next();
};
