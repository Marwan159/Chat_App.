const { Router } = require("express");
const ChannelConroller = require("../controllers/ChannelController");
const { isAuth } = require("../middlewares/AuthMiddleware");
const channelRoutes = Router();

channelRoutes.post("/create-channel", isAuth, ChannelConroller.createChannel);

channelRoutes.get(
  "/get-user-channels",
  isAuth,
  ChannelConroller.getUserChannels
);

channelRoutes.get(
  "/get-channel-messages/:channelId",
  isAuth,
  ChannelConroller.getChannelMessages
);

module.exports = channelRoutes;
