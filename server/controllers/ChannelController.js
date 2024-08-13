const ChannelModel = require("../models/ChannelModel");
const UserModel = require("../models/UserModel");

exports.createChannel = async (req, res, next) => {
  try {
    const name = req.body.channelName;
    const members = req.body.selectedContacts.map((member) => {
      return member.value;
    });

    const { userId } = req;
    const admin = await UserModel.findById(userId);
    const validMember = await UserModel.find({ _id: { $in: members } });
    if (!admin) {
      return res.status(400).json({ message: "Admin User Not Found." });
    }
    if (validMember.length !== members.length) {
      return res
        .status(400)
        .json({ Message: "Some member are not valid user." });
    }
    const channel = await new ChannelModel({ name, members, admin: userId });
    await channel.save();
    return res.status(201).json({ channel });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Controller Error." });
  }
};

exports.getUserChannels = async (req, res, next) => {
  try {
    const { userId } = req;
    const channels = await ChannelModel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });
    res.status(201).json({ channels });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Controller Error" });
  }
};

exports.getChannelMessages = async (req, res, next) => {
  try {
    const channelId = req.params.channelId;
    const channel = await ChannelModel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id color image",
      },
    });
    if (!channel) {
      return res.status(400).json({ message: "Channel not found" });
    }
    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Controll Error" });
  }
};

// exports.getAllMessages = async (req, res, next) => {
//   try {
//     const senderId = req.userId;
//     const recipientId = req.body.id;
//     // console.log(senderId, recipientId, req, "users");
//     if (!senderId || !recipientId) {
//       return res
//         .status(400)
//         .json({ message: "user 1 and user 2 are required.." });
//     }
//     const messages = await MessageModel.find({
//       $or: [
//         { sender: senderId, recipient: recipientId },
//         { sender: recipientId, recipient: senderId },
//       ],
//     }).sort({ timestamp: 1 });
//     return res.status(200).json({ messages });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: "Server Controller Error." });
//   }
// };
