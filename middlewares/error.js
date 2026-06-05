import { envMode } from "../app.js";

// export const errorMiddleware = (err, req, res, next) => {
//   // Ensure err.message is a string
//   let errorMessage = "Internal server error";
//   if (typeof err.message === "string") {
//     errorMessage = err.message;
//   } else {
//     console.error("Error message is not a string:", err.message);
//     if (envMode === "DEVELOPMENT") {
//       errorMessage = JSON.stringify(err.message);
//     }
//   }

//   err.statusCode ||= 500;

//   if (err.code === 11000) {
//     const error = Object.keys(err.keyPattern).join();
//     err.message = `Duplicate field ${error}`;
//     err.statusCode = 400;
//   }

//   if (err.name === "CastError") {
//     const errorPath = err.path;
//     err.message = `Invalid format of ${errorPath}`;
//     err.statusCode = 400;
//   }

//   return res.status(err.statusCode).json({
//     success: false,
//     message: envMode === "DEVELOPMENT" ? err : errorMessage,
//   });
// };

// error.js
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};


export const TryCatch = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error("Error caught in TryCatch:", err.message, err.stack);
    res.status(500).json({ success: false, message: err.message });
  });
};
