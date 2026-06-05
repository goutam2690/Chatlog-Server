import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/features.js";
import { adminSecretKey } from "../app.js";

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("Chatify-Admin-Token", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Admin Authenticated",
    });
});

const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("Chatify-Admin-Token", "", {
      ...cookieOptions,
      maxAge: -1,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const getAdminData = TryCatch(async (req, res, next) => {
  return res.status(200).json({
    admin: true,
  });
});

const allUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const transformedData = await Promise.all(
    users.map(async ({ _id, name, username, avatar }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);

      return {
        _id,
        name,
        username,
        avatar: avatar.url,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    success: true,
    transformedData,
  });
});

const allChats = TryCatch(async (req, res) => {
  const chat = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chat.map(async ({ members, _id, name, creator, groupChat }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        name,
        groupChat,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    success: true,
    chat: transformedChats,
  });
});

const allMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ _id, sender, chat, attachments, content, createdAt }) => ({
      _id,
      attachments,
      content,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  return res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});

const getDashboardStats = TryCatch(async (req, res) => {
  try {
    console.log(
      "Fetching groupCount, userCount, messageCount, totalChatsCount"
    );
    const [groupCount, userCount, messageCount, totalChatsCount] =
      await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
      ]);

    console.log("Counts fetched", {
      groupCount,
      userCount,
      messageCount,
      totalChatsCount,
    });

    const data = new Date(); // Corrected variable name from 'data' to 'today'

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
  
    const last7DaysMessages = await Message.find({
      createdAt: { $gte: last7Days, $lte: data }, // Corrected variable name to 'data'
    }).select("createdAt");    

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    last7DaysMessages.forEach((message) => {
      const indexApprox =
        (data.getTime() - message.createdAt.getTime()) / dayInMiliseconds; // Fixed division placement

      const index = Math.floor(indexApprox);

      messages[6 - index]++; // Fixed array index access and increment operation
    });

    const stats = {
      groupCount,
      userCount,
      messageCount,
      totalChatsCount,
      messagesCharts: messages,
    };

    console.log("Returning stats", stats);
    res.status(200).json({
      success: true,
      message:"stats fetched successfully",
      stats,
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
};
