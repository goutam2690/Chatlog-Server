// class ErrorHandler extends Error{
//     constructor(message, statusCode){
//         super(message);
//         this.statusCode = statusCode;
//     }
// }

// export { ErrorHandler }

// utility.js
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ErrorHandler };
