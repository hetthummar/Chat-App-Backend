const mongoose = require("mongoose");
const PrivateMessageModel = require("../models/private_message");
const userModel = require("../models/user");
const errorResponse = require("../utils/errors/errorResponse.js");
const mongooseIdHelper = require("../utils/mongooseIdHelper");
const socketService = require("../services/socket_service");
const util = require("util");
const msgStatus = require("../constants/msg_status_const");

exports.addMessage = async (req, res, next) => {
  const privateMessageModel = req.body;
  const receiverId = req.body.receiver_id;
  const senderId = req.body.sender_id;

  console.log(
    "Het 1212 :- " + util.inspect(privateMessageModel, { depth: null })
  );

  // let user1_id = privateMessageModel.user1_id;
  // let user2_id = privateMessageModel.user2_id;
  // var userDataList = [user1_id.user2_id];
  //
  // List.sort((a, b) => user1_id.toString().compareTo(user2_id.toString()));
  // userDataList.sort();

  // console.log(util.inspect(privateMessageModel, { depth: null }));

  try {
    socketService.emitPrivateMessageEvent(receiverId, privateMessageModel);
    socketService.emitUpdateExistingMessageEvent({
      msgId: req.body._id,
      roomId: senderId,
      status: msgStatus.sent,
    });
    await PrivateMessageModel.create(privateMessageModel);
    res.dataUpdateSuccess({ message: "User Created Successfully" });
  } catch (error) {
    next(error);
  }
};

// exports.getMissedMessage = async (req, res, next) => {

//   // const userId = req.userId;

//   const userIdObject = mongooseIdHelper.getMongooseIdFromString(userId);
//   const messageStatus = msgStatus.pending;

//   try {

//   const foundMessages = PrivateMessageModel.find({$or:[{'_id':userIdObject},{'msg_status':messageStatus}]});
//   for(const message of foundMessages) {
//     socketService.emitPrivateMessageEvent(userId,message);
//   }
//     res.dataUpdateSuccess();
//   } catch (error) {
//     next(error);
//   }
// };

exports.getMissedMessage = async (userId) => {
  // const userIdObject = mongooseIdHelper.getMongooseIdFromString(userId);

  try {
    const foundMessages = await PrivateMessageModel.find({
      $and: [{ receiver_id: userId }, { msg_status: msgStatus.sent }],
    });
    console.log("foundMessages :- " + foundMessages);
    for (const message of foundMessages) {
      console.log("-------------------- HELU -------------------");
      console.log(message);
      socketService.emitPrivateMessageEvent(userId, message);
    }
  } catch (error) {
    console.log("ERROR OCCURED :- " + error);
    // next(error);
  }
};

exports.getUpdatedMessage = async (userId) => {
  // const userIdObject = mongooseIdHelper.getMongooseIdFromString(userId);

  try {
    const foundMessages = await PrivateMessageModel.find({
      $and: [{ receiver_id: userId }, { msg_status: msgStatus.sent }],
    });
    console.log("foundMessages :- " + foundMessages);
    for (const message of foundMessages) {
      console.log("-------------------- HELU -------------------");
      console.log(message);
      socketService.emitPrivateMessageEvent(userId, message);
    }
  } catch (error) {
    console.log("ERROR OCCURED :- " + error);
    // next(error);
  }
};

exports.updateMsgDeliverTime = async (req, res, next) => {
  try {
    const msgDeliverTime = req.body.delivered_at;
    const msgId = req.body._id;
    const senderId = req.body.sender_id;
    

    socketService.emitUpdateExistingMessageEvent({
      msgId: msgId,
      roomId: senderId,
      status: msgStatus.delivered,
      delivered_at: msgDeliverTime,
    });
    await PrivateMessageModel.findByIdAndUpdate(
      msgId,
      { msg_status: msgStatus.delivered, delivered_at: msgDeliverTime,is_updated:true },
      { runValidators: true }
    );

    res.dataUpdateSuccess();
  } catch (error) {
    next(error);
  }
};

exports.updateMsgSeenTime = async (req, res, next) => {
  console.log("getting error :- ");
  try {
    const msgId = req.body._id;
    const msgSeenTime = req.body.seen_at;
    const senderId = req.body.sender_id;

    socketService.emitUpdateExistingMessageEvent({
      msgId: msgId,
      roomId: senderId,
      status: msgStatus.seen,
      delivered_at: msgSeenTime,
    });
    await PrivateMessageModel.findByIdAndUpdate(
      msgId,
      { msg_status: msgStatus.seen, seen_at: msgSeenTime,is_updated:true },
      { runValidators: true }
    );

    res.dataUpdateSuccess();
  } catch (error) {
    console.log("error :- " + error);
    next(error);
  }
};
