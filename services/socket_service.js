let io;
let socketConnection;
const util = require('util');
const msgStatus = require('../constants/msg_status_const');
const messageController = require('../controllers/messageController');
const userConnectionStatusController = require('../controllers/user_connnection_status');


const socketConnected = (userId) => {
  console.log("SOCKET CONNECTED :- " + userId);

  const connectionStatusChangeData = {
    "userId":userId,
    "isOnline":true
  };

  console.log("STATUS LISTENING :- " + userId);
  socketConnection.broadcast.emit(userId+ "_status",connectionStatusChangeData);
  userConnectionStatusController.changeConnectionStatus(userId,true);
  messageController.getMissedMessage(userId);
};


const socketDisConnected = (userId) => {

  const connectionStatusChangeData = {
    "userId":userId,
    "isOnline":false
  };

  userConnectionStatusController.changeConnectionStatus(userId,false);
  socketConnection.broadcast.emit(userId+ "_status",connectionStatusChangeData);
};

exports.listenForUserConnectionStatus = (userIdToListen) => {
  socketConnection.join(userIdToListen + "_status");
};

exports.makeSocketConnection = (server) => {
  io = require("socket.io")(server);

  io.on("connection", async (socket) => {

    const userId = socket.handshake.query.userId;

    console.log("a user connected:- " + userId);
    socket.join(userId);
    socketConnection = socket;
    // socketConnection.join(userId+ "_status");

    socketConnected(userId);
    socket.on("newMessage", () => {});

    socket.on("disconnect", () => {
      socketDisConnected(userId);
      socket.leave(userId);
    });        

    console.log("a user connected 34");
  });
};


exports.emitPrivateMessageEvent = (roomId, message) => {
  console.log("ROOMID FOR NEW MESSAGE  :- " + roomId);
  io.to(roomId).emit('newPrivateMessage', message);
    // socketConnection.to(roomId).emit("newPrivateMessage", message);
};

exports.emitUpdateExistingMessageEvent = ({roomId,msgId,status,seenAt = null,deliveredAt = null} = {}) => {

// console.log("msgId :- " + status);
// console.log("msgId :- " + seenAt);
// console.log("msgId :- " + deliveredAt);

console.log("ROOMID FOR UPDATE MESSAGE  :- " + roomId);

  if(seenAt != null) {
    status = msgStatus.seen;
  }else if(deliveredAt != null) {
    status = msgStatus.delivered;
  }

  const message = {
    "msg_status":status,
    "_id" : msgId,
    "seen_at":seenAt,
    "delivered_at":deliveredAt,
  };

  // socketConnection.to(roomId).emit("updateExistingMessage", message);
  io.to(roomId).emit('updateExistingMessage', message);

};

exports.getRooms = () => io.sockets.adapter.rooms;
