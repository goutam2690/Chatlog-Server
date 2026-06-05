import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.get("/", getAdminData);
app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);
app.post("/logout", adminLogout);

// Only admin can access these routes
app.use(isAdminAuthenticated);

app.get("/users", allUsers);
app.get("/messages", allMessages);
app.get("/chats", allChats);
app.get("/stats", getDashboardStats);

export default app;
