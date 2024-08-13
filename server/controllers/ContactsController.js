const { default: mongoose } = require("mongoose");
const MessageModel = require("../models/MessageModel");
const { timeStamp } = require("console");
const UserModel = require("../models/UserModel");

exports.searchContacts = async (req, res, next) => {
  const { searchTerm } = req.body;
  const { userId } = req.userId;
  try {
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).json({ Message: "Search Term is required." });
    }
    const sanitizedSearchTarm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\*$"
    );

    const regex = new RegExp(sanitizedSearchTarm, "i");
    const contacts = await UserModel.find({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    res.status(201).json({ contacts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Controller Error" });
  }
};

exports.getContactsForDMList = async (req, res, next) => {
  try {
    let userId = req.userId;
    userId = new mongoose.Types.ObjectId(userId);
    const contacts = await MessageModel.aggregate([
      { $match: { $or: [{ sender: userId }, { recipient: userId }] } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      { $sort: { lastMessageTime: -1 } },
    ]);
    res.status(200).json({ contacts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Controller Error" });
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await UserModel.find(
      { _id: { $ne: req.userId } },
      "_id firstName lastName email"
    );
    const AllContacts = contacts.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));
    console.log(AllContacts);
    res.status(200).json({ AllContacts });
  } catch (error) {
    console.log(error.messae);
    res.status(500).json({ message: "Server Controller Error" });
  }
};
