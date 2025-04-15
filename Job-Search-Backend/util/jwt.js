const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signToken = (id, email, type) =>
  jwt.sign({ id: id, email: email, type: type }, process.env.JWT_SECRET);
