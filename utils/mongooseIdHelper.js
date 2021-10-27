const mongoose = require("mongoose");

const mongooseIdHelper = {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  },
  getMongooseId() {
    return new mongoose.Types.ObjectId();
  },
  getMongooseIdFromString(id) {
    return new mongoose.Types.ObjectId(id);
  },
};

module.exports = mongooseIdHelper;
