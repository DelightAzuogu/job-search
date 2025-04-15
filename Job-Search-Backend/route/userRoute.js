const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const service = require("../service/UserService");
const { UserTokenVerification } = require("../util/userTokenVerification");
const multer = require("multer");
const { ApplicationError } = require("../util/errors");

const userRouter = Router();

const fileFilter = (req, file, cb) => {
  if (
    [
      "application/msword",
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    ].includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(ApplicationError("invalid document type", 409), false);
  }
};

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("Resume")) {
      fs.mkdirSync("Resume");
    }
    cb(null, "Resume");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

const multerSetup = new multer({ storage: multerStorage, fileFilter });

userRouter.post("/signin", service.postSignInUser);

userRouter.post("/login", service.postLoginUser);

userRouter.post(
  "/job/apply/:jobId",
  UserTokenVerification,
  service.postUserApplication
);

userRouter.post(
  "/job/resume/:applicationId",
  multerSetup.single("resume"),
  UserTokenVerification,
  service.postResumeForApplication
);

userRouter.post(
  "/rating/:companyId/:rating",
  UserTokenVerification,
  service.PostUserRateCompany
);

exports.UserRouter = userRouter;
