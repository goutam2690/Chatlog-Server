// import { ErrorHandler } from "../utils/utility.js";
// import { TryCatch } from "./error.js";
// import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { CHATIFY_TOKEN } from "../constants/config.js";
import { adminSecretKey } from "../app.js";

// export const isAuthenticated = TryCatch(async (req, res, next) => {
//   const token = req.cookies["Chatify-token"];
//   console.log(token)
//   try {
//     if (!token) {
//       throw new ErrorHandler("Please log in to access this route", 401);
//     }

//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//     // Ensure decodedData contains the necessary user ID
//     if (!decodedData || !decodedData._id) {
//       throw new ErrorHandler("Invalid token", 401);
//     }

//     // Set req.user with the user ID
//     req.user = decodedData._id;

//     next();
//   } catch (error) {
//     return next(error);
//   }
// });

// export const isAuthenticated = (req, res, next) => {
//   const token = req.cookies['Chatify-token'];

//   if (!token) {
//     return next(new ErrorHandler('Please login to access this route', 401));
//   }

//   try {
//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded data:', decodedData); // Debugging statement
//     req.user = new mongoose.Types.ObjectId(decodedData._id); // Ensure user ID is ObjectId
//     // console.log(users)
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error.message); // Debugging statement
//     return next(new ErrorHandler('Invalid token', 401));
//   }
// };

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies[CHATIFY_TOKEN]; // Directly access the token using the key

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not Logged In, Please login first",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Data:", decodedData); // Add this line for debugging

    req.user = decodedData._id;

    console.log("req.user : ", req.user);

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const isAdminAuthenticated = TryCatch(async (req, res, next) => {
  const token = req.cookies["Chatify-Admin-Token"];

  try {
    if (!token) {
      throw new ErrorHandler("Only admin can access this route", 401);
    }

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);
    console.log(secretKey)
    // Ensure decodedData contains the necessary user ID
    // if (!secretKey || !secretKey._id) {
    //   throw new ErrorHandler("Invalid token", 401);
    // }

    const isMatched = secretKey === adminSecretKey;

    if (!isMatched)
      return next(new ErrorHandler("Only admin can access this route", 401));

    // Set req.user with the user ID
    req.user = secretKey;

    next();
  } catch (error) {
    return next(error);
  }
});

export const socketAuthenticator = async (socket, next) => {
  try {
    const authToken = socket.request.cookies[CHATIFY_TOKEN];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};
