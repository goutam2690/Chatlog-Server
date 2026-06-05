import bcrypt from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { getOtherMember } from "../lib/helper.js";
import mongoose from "mongoose";

//create a new user and save into the database and save token in cookie
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please upload avatar", 400));

  const result = await uploadFilesToCloudinary([file]);
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const isUserExists = await User.findOne({ username });

  if (isUserExists)
    return next(new ErrorHandler("Username already exists", 400));

  // const avatar = {
  //   public_id: "jghjh",
  //   url: "djhgdhjg",
  // };

  const user = await User.create({
    name,
    username,
    password,
    bio,
    avatar,
  });

  sendToken(res, user, 201, "User Created Successfully");
});

//login user
const login = TryCatch(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find a single user by their username
    const user = await User.findOne({ username }).select("+password");

    // If user not found, return error
    if (!user) return next(new ErrorHandler("Invalid Credentials", 400));

    // Compare the hashed password with the plaintext password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    // // If passwords don't match, return error
    if (!isPasswordMatched)
      return next(new ErrorHandler("Invalid Username or Password", 400));

    // Set req.user with the user ID
    req.user = user._id;

    // Passwords matched, send token
    sendToken(res, user, 200, `Welcome back ${user.name}`);
  } catch (error) {
    next(error);
  }
});

const getMyProfile = async (req, res, next) => {

  const user = await User.findById(req.user);
  if (!user) return next(new ErrorHandler("User not found", 400));

  res.status(201).json({
    success: true,
    user,
  });
};


const logout = TryCatch(async (req, res, next) => {
  res
    .status(201)
    .cookie("Chatify-token", "", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res, next) => {
  const { name } = req.query;

  //finding all my chats
  const myChats = await Chat.find({ groupChat: false, members: req.user });

  //it means all friends or people i have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  //find all users excepting me and my friends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  //modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(201).json({
    success: true,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) {
    return next(new ErrorHandler("Friend request already sent", 400));
  }

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({
    success: true,
    message: "Friend request sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("No such request exists.", 400));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 400)
    );

  if (!accept) {
    await request.deleteOne();

    res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name} - ${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  res.status(200).json({
    success: true,
    message: "Friend request accepted",
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  console.log(req.user);
  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});


const getMyFriends = TryCatch(async (req, res, next) => {
  try {
    const { chatId } = req.query;

    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");  // Ensure members are populated

    const friends = chats.map((chat) => {
      const otherUser = getOtherMember(chat, req.user);

      if (!otherUser) {
        return null;
      }

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    }).filter(friend => friend !== null);

    if (chatId) {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }

      const availableFriends = friends.filter(
        (friend) =>
          chat.members && !chat.members.includes(friend._id.toString())
      );

      res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      res.status(200).json({
        success: true,
        friends,
      });
    }
  } catch (error) {
    console.error("Error in getMyFriends:", error);
    next(error);
  }
});



export {
  acceptFriendRequest,
  getMyProfile,
  getMyNotifications,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  getMyFriends,
};
