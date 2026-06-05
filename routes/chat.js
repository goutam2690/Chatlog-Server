import express from "express";
import {
    addMembers,
    deleteChat,
    getChatDetails,
    getMessages,
    getMyChats,
    getMyGroups,
    leaveGroup,
    newGroupChat,
    removeMembers,
    renameGroup,
    sendAttachments,
} from "../controllers/chat.js";
import {
    addMemberValidator,
    chatIdValidator,
    newGroupValidator,
    removeMemberValidator,
    renameGroupValidator,
    // sendAttachmentsValidator,
    validateHandler
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

//User must be logged in to access this route
app.post(
  "/new-group-chat",
  isAuthenticated,
  newGroupValidator(),
  validateHandler,
  newGroupChat
);
app.get("/getMyChats", isAuthenticated, getMyChats);
app.get("/getMyGroups", isAuthenticated, getMyGroups);
app.put(
  "/addMembers",
  isAuthenticated,
  addMemberValidator(),
  validateHandler,
  addMembers
);
app.put(
  "/removeMember",
  isAuthenticated,
  removeMemberValidator(),
  validateHandler,
  removeMembers
);
app.delete(
  "/leave/:id",
  isAuthenticated,
  chatIdValidator(),
  validateHandler,
  leaveGroup
);

//get messages
app.get("/messages/:id", isAuthenticated, chatIdValidator(), validateHandler, getMessages);

// send attachments
app.post(
  "/message",
  isAuthenticated,
  // sendAttachmentsValidator(),
  validateHandler,
  attachmentsMulter,
  sendAttachments
);

app
  .route("/:id")
  .get(isAuthenticated, chatIdValidator(), validateHandler, getChatDetails)
  .put(isAuthenticated, renameGroupValidator(), validateHandler, renameGroup)
  .delete(isAuthenticated, chatIdValidator() , validateHandler, deleteChat);

export default app;
