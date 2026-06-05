import { userSocketIDs } from "../app.js";

export const getOtherMember = (chat, userId) => {
  if (!chat.members || !Array.isArray(chat.members)) {
    console.error("Members is not an array for chat:", chat);
    return null; // Return null if invalid array
  }

  return chat.members.find(member => member._id.toString() !== userId.toString());
};


export const getSocktes = (users = []) => {
  console.log("Fetching sockets for users:", users);

  // Log the contents of userSocketIDs for debugging
  console.log("Current userSocketIDs map:", Array.from(userSocketIDs.entries()));

  const sockets = users.map((user) => {
    const socketId = userSocketIDs.get(user.toString());
    console.log(`User ${user.toString()} maps to socket ${socketId}`);
    return socketId;
  });

  console.log("Resulting sockets:", sockets);
  return sockets.filter(socket => socket); // Remove any undefined entries
};
  


export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
