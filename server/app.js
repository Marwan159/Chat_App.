const { Server } = require("socket.io");
const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const server = express();
const authRouter = require("./routes/AuthRoutes");
const contactsRouter = require("./routes/ContactsRoutes");
const MessagesRouter = require("./routes/MessagesRoutes");
const channelRouter = require("./routes/ChannelRoutes");
const setupSocket = require("./socket");
env.config();
server.use(express.urlencoded({ extended: true }));
server.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
server.use(cookieParser());
server.use(express.json());
server.use("/uploads/images", express.static("uploads/images"));
server.use("/uploads/files", express.static("uploads/files"));
server.use("/api/auth", authRouter);
server.use("/api/contacts", contactsRouter);
server.use("/api/messages", MessagesRouter);
server.use("/api/channel", channelRouter);

const serverSocket = server.listen(process.env.PORT, () => {
  console.log("Server Connect successful✅");
});
setupSocket(serverSocket);
mongoose.connect(process.env.DBCONNECT_URL).then(() => {
  console.log("DB Connect Successful✅");
});
