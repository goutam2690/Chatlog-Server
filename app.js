import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import { connectToDb } from "./utils/features.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import { v4 as uuid } from "uuid";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { getSocktes } from "./lib/helper.js";
import { Message } from "./models/message.js";
import { corsOptions } from "./constants/config.js";
import { socketAuthenticator } from "./middlewares/auth.js";

import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";

config({
  path: "./.env",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

const MONGO_URI = process.env.MONGO_URI;
const port = process.env.PORT || 5001;
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "jbhsadfghsdfuhbdsv";
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";

const userSocketIDs = new Map();
const onlineUsers = new Set();

connectToDb(MONGO_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());

// app.use((req, res, next) => {
//   // console.log('Request Headers:', req.headers);
//   next();
// });

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res || {}, (err) => {
    if (err) return next(err);
    socketAuthenticator(socket, next); // Pass the socket and next to socketAuthenticator
  });
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const user = socket.user;
  if (user && user._id) {
    console.log(`Registering socket for user: ${user._id}`);
    userSocketIDs.set(user._id.toString(), socket.id);
    console.log(`Current sockets for user ${user._id}:`, userSocketIDs.get(user._id.toString()));
  } else {
    console.error("No user associated with the socket");
  }

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    try {
      const messageForRealTime = {
        content: message,
        _id: uuid(),
        sender: {
          _id: user._id,
          name: user.name,
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: message,
        sender: user._id,
        chat: chatId,
      };

      console.log(`New message received from ${user.name} in chat ${chatId}`);

      const membersSocket = getSocktes(members);

      console.log(`Emitting new message to sockets: ${membersSocket}`);

      membersSocket.forEach((socketId) => {
        if (socketId) {
          io.to(socketId).emit(NEW_MESSAGE, {
            message: messageForRealTime,
            chatId,
          });
          io.to(socketId).emit(NEW_MESSAGE_ALERT, { chatId });
        }
      });

      await Message.create(messageForDB);
      console.log(`Message saved to database`);

    } catch (error) {
      console.error(`Error processing new message: ${error.message}`);
    }
  });


  socket.on(START_TYPING, ({ members, chatId, userId }) => {
    console.log("Start typing event received", chatId, userId);
    const membersSockets = getSocktes(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId, userId });
  });

  socket.on(STOP_TYPING, ({ members, chatId, userId }) => {
    console.log("Stop typing event received", chatId, userId);
    const membersSockets = getSocktes(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId, userId });
  });

  socket.on(CHAT_JOINED, ({userId, members}) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSocktes(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  })

  socket.on(CHAT_LEAVED, ({userId, members}) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSocktes(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));

  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode} mode`);
});

export { adminSecretKey, envMode, userSocketIDs };
