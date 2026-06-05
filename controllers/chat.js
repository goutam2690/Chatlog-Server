import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import {
  deleteFilesFromCloudinary,
  emitEvent,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (!name || !members || members.length === 0) {
    return next(new ErrorHandler("Name and members are required", 400));
  }

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Created",
  });
});

const getMyChats = TryCatch(async (req, res, next) => {
  try {
    console.log("User ID:", req.user);
    const chats = await Chat.find({ members: req.user }).populate(
      "members",
      "name avatar"
    );

    if (!chats || chats.length === 0) {
      return next(new ErrorHandler("No chats found for this user", 400));
    }

    const transformedChats = chats.map((chat) => {
      const otherMember = getOtherMember(chat, req.user);
      const avatarUrls = chat.groupChat
        ? chat.members.slice(0, 3).map(({ avatar }) => avatar?.url || "") // Default to empty string if avatar or url is undefined
        : [otherMember?.avatar?.url || ""]; // Default to empty string if otherMember or avatar or url is undefined

      return {
        _id: chat._id,
        groupChat: chat.groupChat,
        avatar: avatarUrls,
        name: chat.groupChat ? chat.name : otherMember?.name || "Unknown", // Default to "Unknown" if otherMember or name is undefined
        members: chat.members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    console.error(
      "Error in getMyChats controller:",
      error.message,
      error.stack
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ _id, groupChat, name, members }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    sucecss: true,
    message: "Groups fetched successfully",
    groups,
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide member", 400));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to add member", 403));

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMember = allNewMembers
    .filter((i) => !chat.members.includes(i._id))
    .map((i) => i._id);

  // Add new user to the chat's member list and save it
  chat.members.push(...uniqueMember);

  if (chat.members.length > 500)
    return next(new ErrorHandler("Group members limit reached", 400));

  await chat.save();

  const allUsersName = allNewMembers.map((i) => i.name).join(",");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added to ${chat.name}`
  );

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: `Added member ${allUsersName} to the group`,
  });
});

const removeMembers = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const [chat, userThatWillBeDeleted] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to remove member", 403));

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have atleast 3 members"));

  const allChatMembers = chat.members.map((i) => i.toString());

  chat.members = chat.members.filter(
    (member) => member.toString() !== userId.toString()
  );

  await chat.save();

  emitEvent(
    req,
    ALERT,
    allChatMembers,
    {
      message: `${userThatWillBeDeleted.name} has been removed from the group`, chatId
    }
  );

  return res.status(200).json({
    success: true,
    message: "member removed successsfully",
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  // Check if req.user is null
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const chat = await Chat.findById(chatId);
  console.log(req.user);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  const remainingMembers = chat.members.filter(
    (member) => member.toString !== req.user.toString()
  );

  if (remainingMembers.length < 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  if (chat.creator.toString() === req.user.toString()) {
    const randomElement = Math.floor(Math.random() * remainingMembers.length);

    const newCreator = remainingMembers[randomElement];

    chat.creator = newCreator;
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, {
    chatId,
    message : `${user.name} has left the group`
  });

  return res.status(200).json({
    success: true,
    message: "You have successfully left the group",
  });
});

const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];

  if (!files.length)
    return next(new ErrorHandler("Please upload attachments", 400));
  if (files.length > 5)
    return next(new ErrorHandler("Files can't be more than 5", 400));

  if (!req.user) return next(new ErrorHandler("User not authenticated", 401));

  const [chat, me] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const attachments = await uploadFilesToCloudinary(files);

  const messageForDB = {
    content: "",
    attachments,
    sender: me._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: me._id,
      name: me.name,
    },
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: messageForRealTime,
    chat: chatId,
  });

  console.log(`emitting ${NEW_MESSAGE}`)
// console.log("message, chatId",message, chatId)
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id).populate(
      "members",
      "name avatar"
    );

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    res.status(200).json({
      success: true,
      data: chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const newName = req.body.name;

    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat)
      return next(new ErrorHandler("This is not a group Chat", 400));

    if (chat.creator.toString() !== req.user.toString())
      return next(new ErrorHandler("You are not allowed to rename group", 403));

    chat.name = newName;

    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Group renamed successfully",
    });
  } catch (error) {
    console.log(error);
  }
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to delete group", 403));

  if (!chat.groupChat && !chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("You are not allowed to delete group", 403));

  //here we have to delete all messages as well as attachments or files from cloudinary

  const messagesWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messagesWithAttachments.forEach(({ attachments }) => {
    attachments.forEach(({ public_id }) => {
      public_ids.push(public_id);
    });
  });

  await Promise.all([
    //delete files from cloudinary
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = TryCatch(async (req, res, next) => {  
  const chatId = req.params.id;
  const { page = 1 } = req.query;

  console.log(`Fetching messages for chatId: ${chatId}`);

  const limit = 20;
  const skip = (page - 1) * limit;

  const chat = await Chat.findById(chatId);
  console.log(`Chat found: ${chat}`);

  if (!chat) return next(new ErrorHandler("Chat not found!", 404));

  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  console.log(`User ID: ${req.user}`);

  if (!chat.members.includes(req.user.toString())) {
    return next(new ErrorHandler("You are not allowed to access this chat", 403));
  }

  const [messages, totalMessageCount] = await Promise.all([
    Message.find({ chat:  chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name avatar")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessageCount / limit);

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMembers,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
