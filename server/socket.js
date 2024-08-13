const e = require("cors");
const env = require("dotenv");
env.config();
const { Server } = require("socket.io");
const MessageModel = require("./models/MessageModel");
const UserModel = require("./models/UserModel");
const ChannelModel = require("./models/ChannelModel");
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recievedSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await MessageModel.create(message);
    const messageData = await MessageModel.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color ")
      .populate("recipient", "id email firstName lastName image color ");
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
    if (recievedSocketId) {
      io.to(recievedSocketId).emit("recieveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const { sender, messageType, channelId, content, fileUrl } = message;
    const createdMessage = await MessageModel.create({
      recipient: null,
      sender,
      content,
      messageType,
      fileUrl,
      timestamp: new Date(),
    });

    const messageDate = await MessageModel.findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color")
      .exec();
    await ChannelModel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await ChannelModel.findById(channelId).populate("members");
    const finalData = { ...messageDate._doc, channelId: channel._id };
    try {
      if (channel && channel.members) {
        channel.members.forEach((member) => {
          const memberSockerId = userSocketMap.get(member._id.toString());
          if (memberSockerId) {
            io.to(memberSockerId).emit("recive-channel-message", finalData);
          }
        });
        const socketAdminId = userSocketMap.get(channel.admin._id.toString());
        if (socketAdminId) {
          io.to(socketAdminId).emit("recive-channel-message", finalData);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId}, with Socket ID:${socket.id}`);
    } else {
      console.log(`user ID not provided during connection`);
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

module.exports = setupSocket;
