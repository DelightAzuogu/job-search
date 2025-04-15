const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const service = require("../service/CompanyService");
const {
  CompanyTokenVerification,
} = require("../util/companyTokenVerification");
const { ApplicationError } = require("../util/errors");

const companyRouter = Router();

const fileFilter = (req, file, cb) => {
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApplicationError("invalid image type", 409), false);
  }
};

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("logo")) {
      fs.mkdirSync("logo");
    }
    cb(null, "logo");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

const multerSetup = new multer({ storage: multerStorage, fileFilter });

companyRouter.post("/signin", multerSetup.single("logo"), service.postSignIn);

companyRouter.post("/login", service.postLogin);

companyRouter.post("/create-job", CompanyTokenVerification, service.postJob);

companyRouter.post(
  "/edit-job/:jobId",
  CompanyTokenVerification,
  service.postEditJob
);

companyRouter.post(
  "/job/question",
  CompanyTokenVerification,
  service.postJobQuestion
);

companyRouter.post(
  "/job/question/edit/:id",
  CompanyTokenVerification,
  service.postEditJobQuestion
);

companyRouter.post(
  "/update/job/status/:jobId",
  CompanyTokenVerification,
  service.postToggleJobStatus
);

companyRouter.get(
  "/user/application/:jobId/:userId",
  CompanyTokenVerification,
  service.getUserJobApplication
);

companyRouter.get(
  "/job/applications/:jobId",
  CompanyTokenVerification,
  service.getJobApplicationsByJobId
);

companyRouter.post(
  "/decline/application/:jobId/:userId",
  CompanyTokenVerification,
  service.postDeclineUserJobApplication
);

companyRouter.get("/image/:companyId", service.getImage);

companyRouter.get(
  "/user/application/:jobId/:userId/resume",
  service.getUserResumeForJob
);

exports.companyRouter = companyRouter;
