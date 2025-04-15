const jwt = require("jsonwebtoken");
const { ApplicationError } = require("./errors.js");
const { userRepository } = require("../repository/userRepository.js");
require("dotenv").config();

exports.UserTokenVerification = async (req, res, next) => {
  try {
    const header = req.get("Authorization");
    if (!header) {
      throw ApplicationError("invalid Authorization", 401);
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw ApplicationError("Invalid token", 401);
    }

    let payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      throw newError("invalid token", 401);
    }

    const user = await userRepository.GetUserById(payload.id);
    if (!user) {
      throw newError("User not found", 401);
    }

    req.userId = payload.id;
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
