import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSocktes } from "../lib/helper.js";
// import { io } from "../app.js";

const connectToDb = async (uri) => {
  try {
    await mongoose
      .connect(uri, { dbName: "Chatify-Real-Time-Chat" })
      .then((conn) => {
        console.log(`connected to db : ${conn.connection.host}`);
      });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit process with failure
  }
};

const cookieOptions = {
  httpOnly: true,
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "strict",
  secure: true,
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  console.log("generated token : ", token);
  return res.status(code).cookie("Chatify-token", token, cookieOptions).json({
    success: true,
    message,
    user
  });
};

const emitEvent = (req, event, users, data) => {
  try {
    const io = req.app.get("io");

    // Assuming getSocktes function returns an array of socket IDs
    const userSockets = getSocktes(users);

    if (!userSockets || userSockets.length === 0) {
      console.error(`No valid sockets found for users: ${users}`);
      return;
    }

    console.log(`Emitting ${event} to sockets: ${userSockets}`);

    io.to(userSockets).emit(event, data);

    console.log(`Successfully emitted ${event} with data:`, data);
  } catch (error) {
    console.error(`Error emitting event ${event}: ${error.message}`);
  }
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formatedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    return formatedResults;
  } catch (error) {
    throw new Error(" Error uploading files !, try again later", error);
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {};

export {
  connectToDb,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
