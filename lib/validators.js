import { body, validationResult, check, param } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");
  console.log(errorMessages);

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please enter a valid group name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 500 })
    .withMessage("Members must be 2 - 100"),
];

const addMemberValidator = () => [
  body("chatId", "Please enter a Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 497 })
    .withMessage("Members must be 1 - 497"),
];

const removeMemberValidator = () => [
  body("chatId", "Please enter a Chat ID")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid chat ID format"),
  body("userId", "Please enter a User ID")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid user ID format"),
];

// const sendAttachmentsValidator = () => [
//   body("chatId", "Please enter a Chat ID").notEmpty(),
// ];

const chatIdValidator = () => [param("id", "Please enter chat ID").notEmpty()];

const renameGroupValidator = () => [
  param("id", "Please enter chat ID").notEmpty(),
  body("name", "Please enter new group name"),
];

const sendFriendRequestValidator = () => [
  body("userId", "User Id is required").notEmpty(),
];

const acceptFriendRequestValidator = () => [
  body("requestId", "Request Id is required").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please add accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
];

export {
  registerValidator,
  validateHandler,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  // sendAttachmentsValidator,
  chatIdValidator,
  renameGroupValidator,
  sendFriendRequestValidator,
  acceptFriendRequestValidator,
  adminLoginValidator
};
