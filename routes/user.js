import express from 'express';
import { acceptFriendRequest, getMyProfile, getMyNotifications, login, logout, newUser, searchUser, sendFriendRequest, getMyFriends } from '../controllers/user.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptFriendRequestValidator, loginValidator, registerValidator, sendFriendRequestValidator, validateHandler } from '../lib/validators.js';

const app = express.Router();

app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);

//User must be logged in to access this route
app.use(isAuthenticated);

app.get("/getMyProfile", getMyProfile);
app.post("/logout", logout);
app.get("/searchUser", searchUser);
app.put("/sendFriendRequest", sendFriendRequestValidator(), validateHandler, sendFriendRequest);
app.put("/acceptFriendRequest", acceptFriendRequestValidator(), validateHandler, acceptFriendRequest)
app.get("/getNotifications", getMyNotifications);
app.get("/friends", getMyFriends)

export default app;