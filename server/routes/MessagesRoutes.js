const { Router } = require("express");
const { isAuth } = require("../middlewares/AuthMiddleware");
const MessageController = require("../controllers/MessageController");
const multer = require("multer");

const upload = multer({ dest: "uploads/files" });
const MessagesRouter = Router();

MessagesRouter.post(
  "/get-all-messages",
  isAuth,
  MessageController.getAllMessages
);

MessagesRouter.post(
  "/upload-files",
  isAuth,
  upload.single("file"),
  MessageController.uploadsFile
);

module.exports = MessagesRouter;
