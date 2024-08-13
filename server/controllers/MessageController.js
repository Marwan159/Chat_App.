const { mkdirSync, renameSync } = require("fs");
const MessageModel = require("../models/MessageModel");

exports.getAllMessages = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const recipientId = req.body.id;
    // console.log(senderId, recipientId, req, "users");
    if (!senderId || !recipientId) {
      return res
        .status(400)
        .json({ message: "user 1 and user 2 are required.." });
    }
    const messages = await MessageModel.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Controller Error." });
  }
};

exports.uploadsFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "file is required.." });
    }
    let file = req.file;
    console.log(file);
    const fileDir = `uploads/files/${file.originalname}`;
    const fileName = `${fileDir}/${file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ Message: "Controller Server Error" });
  }
};
