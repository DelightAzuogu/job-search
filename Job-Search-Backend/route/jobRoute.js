const { Router } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const service = require("../service/jobService");
const {
  CompanyTokenVerification,
} = require("../util/companyTokenVerification");

const jobRouter = Router();

jobRouter.get("/paginated/:pageSize/:pageNumber", service.getPaginatedJobs);

jobRouter.get("/paginationCount/:pageSize", service.getPaginationCount);

jobRouter.get("/company/:companyId", service.getCompanyJobs);

jobRouter.get("/company/all/:companyId", service.getAllCompanyJob);

jobRouter.get("/questions/:jobId", service.getJobQuestions);

jobRouter.get("/:id", service.getJobDetails);

exports.jobRouter = jobRouter;
