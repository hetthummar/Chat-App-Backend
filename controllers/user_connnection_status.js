const mongoose = require("mongoose");
const socketService = require("../services/socket_service");
const userModel = require("../models/user");
const errorResponse = require("../utils/errors/errorResponse.js");

exports.getUserConnectionStatus = async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) {
      throw errorResponse.idNotFoundError();
    }

    const userInformation = await userModel.findById(id);
    res.dataFetchSuccess({ data: userInformation.isOnline });
  } catch (error) {
    console.log("ERROR isONLINE:- " + error);

    next(error);
  }
};

exports.changeConnectionStatus = async (id, status) => {
  try {
    const body = {
      isOnline: status,
    };

    console.log("id connection change :- " + id);
    console.log("id connection change :- " + status);

    await userModel.findByIdAndUpdate(id, body);
  } catch (error) {
    console.log("ERROR :- " + error);
  }
};
