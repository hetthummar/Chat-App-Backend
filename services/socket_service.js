let io;
let socketConnection;
const util = require("util");
const msgStatus = require("../constants/msg_status_const");
const messageController = require("../controllers/messageController");
const userConnectionStatusController = require("../controllers/user_connnection_status");

const socketConnected = (userId) => {
  const connectionStatusChangeData = {
    userId: userId,
    isOnline: true,
  };

  socketConnection.broadcast.emit(
    userId + "_status",
    connectionStatusChangeData
  );
  userConnectionStatusController.changeConnectionStatus(userId, true);
  console.log(
    `-------------------- USER with : ${userId} is ONLINE-------------------`
  );

  messageController.getMissedMessage(userId);
};

const socketDisConnected = (userId) => {
  const connectionStatusChangeData = {
    userId: userId,
    isOnline: false,
  };

  userConnectionStatusController.changeConnectionStatus(userId, false);
  socketConnection.broadcast.emit(
    userId + "_status",
    connectionStatusChangeData
  );
  console.log(
    `-------------------- USER with : ${userId} is OFFLINE-------------------`
  );
};

exports.makeSocketConnection = (server) => {
  io = require("socket.io")(server);

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    console.log(
      `-------------------- USER CONNECTED WITH USERID : ${userId} -------------------`
    );
    socket.join(userId);
    socketConnection = socket;

    socketConnected(userId);

    socket.on('typing',(data) => {
      console.log("User typing :- " + util.inspect(data));
      const receiverId = data.id;
      const isTyping = data.isTyping;
      io.to(receiverId).emit("typing", isTyping);
    });

    socket.on("disconnect", () => {
      socketDisConnected(userId);
      socket.leave(userId);
    });
  });
};

exports.emitAddRecentChatEvent = (receiverId,recentChat) => {
  console.log("newRecentChat 00 :- " + receiverId);
  console.log("newRecentChat 11 :- " + util.inspect(recentChat, { depth: null }));
  io.to(receiverId).emit("newRecentChat", recentChat);
};


exports.emitUpdateRecentChatEvent = (roomId,recentChat) => {
  console.log("ROOMID FOR UPDATE RECENT CHAT :- " + roomId);
  io.to(roomId).emit("updateRecentChat", recentChat);
};

exports.emitPrivateMessageEvent = (roomId, message) => {
  console.log("ROOMID FOR NEW MESSAGE  :- " + roomId);
  io.to(roomId).emit("newPrivateMessage", message);
  // socketConnection.to(roomId).emit("newPrivateMessage", message);
};

exports.emitUpdateExistingMessageEvent = ({
  roomId,
  msgId,
  status,
  seenAt = null,
  deliveredAt = null,
  withAcknowledgeApi = false,
} = {}) => {
  console.log("ROOMID FOR UPDATE MESSAGE  :- " + roomId);

  let message = {
    msg_status: status,
    _id: msgId,
  };

  if (seenAt != null && deliveredAt != null) {
    status = msgStatus.seen;
    message = {
      msg_status: status,
      _id: msgId,
      delivered_at: deliveredAt,
      seen_at: seenAt,
    };
  } else if (seenAt != null) {
    status = msgStatus.seen;
    message = {
      msg_status: status,
      _id: msgId,
      seen_at: seenAt,
    };
  } else if (deliveredAt != null) {
    status = msgStatus.delivered;
    message = {
      msg_status: status,
      _id: msgId,
      delivered_at: deliveredAt,
    };
  }

  // socketConnection.to(roomId).emit("updateExistingMessage", message);
  if (withAcknowledgeApi) {
    io.to(roomId).emit("updateExistingMessageWithAcknowledgeApi", message);
  } else {
    io.to(roomId).emit("updateExistingMessage", message);
  }
};

exports.getRooms = () => io.sockets.adapter.rooms;
