const mongoose = require("mongoose");
const PrivateMessageModel = require("../models/private_message");
const RecentChatModel = require("../models/recent_chat");
const userModel = require("../models/user");
const errorResponse = require("../utils/errors/errorResponse.js");
const mongooseIdHelper = require("../utils/mongooseIdHelper");
const socketService = require("../services/socket_service");
const util = require("util");
const msgStatus = require("../constants/msg_status_const");

function isUserOne(userList, userId) {
  userList.sort();
  console.log("isUser :- " + userList);
  const result = userList.findIndex((x) => x == userId);
  console.log("isUser :- " + result);
  if (result == 0) {
    return true;
  } else {
    return false;
  }
}

exports.addToRecentChat = async (recentChatModel, isUser1) => {
  console.log(
    "INCREMENT ID ! - " + util.inspect(recentChatModel, { depth: null })
  );

  try {
    if (isUser1) {
      recentChatModel.user1_local_updated = true;
      recentChatModel.user2_local_updated = false;
    } else {
      recentChatModel.user1_local_updated = false;
      recentChatModel.user2_local_updated = true;
    }

    await RecentChatModel.create(recentChatModel);
  } catch (e) {
    console.log("Recent chat add error- " + e);
  }
};

async function updateRecentMessage(_id, isUser1, lastMsgTime, lastMsgText) {
  let updateObj = {};

  if (isUser1) {
    updateObj = {
      $inc: { user2_unread_msg: 1 },
      user2_local_updated: false,
      last_msg_time: lastMsgTime,
      last_msg: lastMsgText,
    };
  } else {
    updateObj = {
      $inc: { user1_unread_msg: 1 },
      user1_local_updated: false,
      last_msg_time: lastMsgTime,
      last_msg: lastMsgText,
    };
  }

  try {
    await RecentChatModel.findByIdAndUpdate(_id, updateObj, {
      runValidators: true,
    });
  } catch (e) {
    console.log("updating Recent Message error :- " + e);
    console.log("INCREMENT ERROR :- " + e);
  }
}

async function msgCountToZero(_id, isUser1) {
  let updateObj = {};

  if (isUser1) {
    updateObj = { user1_unread_msg: 0, user1_local_updated: true };
  } else {
    updateObj = { user2_unread_msg: 0, user2_local_updated: true };
  }

  try {
    await RecentChatModel.findByIdAndUpdate(_id, updateObj, {
      runValidators: true,
    });
  } catch (e) {
    console.log("msgCountToZero ERROR :- " + e);
  }
}

// exports.addMessage = async (req, res, next) => {
//   const privateMessageModel = req.body.privateMessageModel;
//   const recentChatModel = req.body.recentChatModel;

//   console.log(
//     "Het 1212 privateMessageModel :- " +
//       util.inspect(privateMessageModel, { depth: null })
//   );
//   console.log(
//     "Het 1212 recentChatModel :- " +
//       util.inspect(recentChatModel, { depth: null })
//   );

//   const senderId = privateMessageModel.sender_id;
//   const receiverId = privateMessageModel.receiver_id;
//   const listOfParticipants = [senderId, receiverId];
//   listOfParticipants.sort();

//   const senderIsUserOne = isUserOne(listOfParticipants, senderId);

//   try {
//     // let recentChatModelWithoutNullValue = Object.fromEntries(
//     //   Object.entries(recentChatModel).filter(([_, v]) => v != null)
//     // );

//     socketService.emitUpdateExistingMessageEvent({
//       msgId: privateMessageModel._id,
//       roomId: senderId,
//       status: msgStatus.sent,
//     });

//     if (!recentChatModel.should_update) {
//       await addToRecentChat(recentChatModel, senderIsUserOne);
//       socketService.emitAddRecentChatEvent(receiverId, recentChatModel);
//     }

//     socketService.emitPrivateMessageEvent(receiverId, privateMessageModel);
//     await PrivateMessageModel.create(privateMessageModel);
//     res.dataUpdateSuccess({ message: "Message Created Successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getMissedMessage = async (userId) => {
  console.log(  `-------------------- GETTING MISSED MESSAGE FOR : ${userId} -------------------`);

  try {
    const foundUpdatedMessages = await PrivateMessageModel.find({
      $and: [{ sender_id: userId }, { sender_local_updated: false }],
    });

    const foundNewMessages = await PrivateMessageModel.find({
      $and: [{ receiver_id: userId }, { msg_status: msgStatus.sent }],
    });

    console.log(
      `-------------------- FOUND MESSAGES FOR : ${userId} :: NEW : ${foundNewMessages.length}  :: UPDATED : ${foundUpdatedMessages.length} -------------------`
    );

    for (const message of foundUpdatedMessages) {

      socketService.emitUpdateExistingMessageEvent({
        msgId: message._id,
        roomId: userId,
        seenAt: message.seen_at,
        deliveredAt: message.delivered_at,
        withAcknowledgeApi: true,
        status: message.msg_status,
      });
    }

    for (const message of foundNewMessages) {
      socketService.emitPrivateMessageEvent(userId, message);
    }
  } catch (error) {
    console.log("ERROR OCCURRED :- " + error);
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
      deliveredAt: msgDeliverTime,
      withAcknowledgeApi: true,
    });

    await PrivateMessageModel.findByIdAndUpdate(
      msgId,
      {
        msg_status: msgStatus.delivered,
        delivered_at: msgDeliverTime,
        sender_local_updated: false,
        receiver_local_updated: true,
      },
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
      seenAt: msgSeenTime,
      withAcknowledgeApi: true,
    });
    await PrivateMessageModel.findByIdAndUpdate(
      msgId,
      {
        msg_status: msgStatus.seen,
        seen_at: msgSeenTime,
        sender_local_updated: false,
        receiver_local_updated: true,
      },
      { runValidators: true }
    );

    res.dataUpdateSuccess();
  } catch (error) {
    console.log("error :- " + error);
    next(error);
  }
};

exports.msgUpdatedLocallyForSender = async (req, res, next) => {
  try {
    const msgId = req.body._id;

    await PrivateMessageModel.findByIdAndUpdate(
      msgId,
      { sender_local_updated: true },
      { runValidators: true }
    );

    res.dataUpdateSuccess();
  } catch (error) {
    console.log("error :- " + error);
    next(error);
  }
};
