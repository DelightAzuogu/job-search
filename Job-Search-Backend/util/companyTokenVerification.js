const jwt = require("jsonwebtoken");
const { ApplicationError } = require("./errors.js");
const { CompanyRepository } = require("../repository/companyRepository.js");
require("dotenv").config();

exports.CompanyTokenVerification = async (req, res, next) => {
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

    const company = await CompanyRepository.GetCompanyById(payload.id);
    if (!company) {
      throw newError("Company not found", 401);
    }

    req.companyId = payload.id;
    req.company = company;

    next();
  } catch (err) {
    next(err);
  }
};
