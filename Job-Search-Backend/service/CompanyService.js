const { response } = require("express");
const { CompanyRepository } = require("../repository/companyRepository");
const { ResponseMessages } = require("../util/ResponseMessages");
const { ValidationError, ApplicationError } = require("../util/errors");
const argon2 = require("argon2");
const path = require("path");
const fs = require("fs");
const { signToken } = require("../util/jwt");
const { JobRepository } = require("../repository/jobRepository");
const { getEnumFromString, LocationType, JobTypes } = require("../util/enums");
const {
  JobQuestionRepository,
} = require("../repository/jobQuestionRepository");
const { userRepository } = require("../repository/userRepository");
const { QuestionAnswer } = require("../model/questionAnswer");
const {
  QuestionAnswerRepository,
} = require("../repository/questionAnswerRepository");
const {
  JobApplicationRepository,
} = require("../repository/jobApplicationRepository");

exports.getFilePath = function (file) {
  const relativeFilePath = file.path;
  const rootDirectory = path.resolve(__dirname, "../");
  return path.resolve(rootDirectory, path.resolve(relativeFilePath));
};

exports.postSignIn = async (req, res, next) => {
  try {
    ValidationError(req);

    const { email, name, password, location } = req.body;

    const oldCompany = await CompanyRepository.GetCompanyByEmail(email);
    if (oldCompany) {
      throw ApplicationError(ResponseMessages.CompanyWithEmailExist, 409);
    }

    if (!req.file) {
      throw ApplicationError(ResponseMessages.InvalidLogo, 409);
    }

    let logoUrl = this.getFilePath(req.file);

    const passwordHash = await argon2.hash(password);

    const company = await CompanyRepository.CreateCompany({
      email,
      name,
      logoUrl,
      passwordHash,
      location,
    });

    res.status(200).send({
      token: signToken(company._id, email, "company"),
      companyId: company._id,
      type: "company",
    });
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const company = await CompanyRepository.GetCompanyByEmail(email);
    if (!company) {
      throw ApplicationError(ResponseMessages.CompanyNotFound, 404);
    }

    const passwordCompare = await argon2.verify(company.passwordHash, password);

    if (!passwordCompare) {
      throw ApplicationError(ResponseMessages.InvalidPassword, 400);
    }

    res.status(200).send({
      token: signToken(company._id, email, "company"),
      companyId: company._id,
      type: "company",
    });
  } catch (error) {
    next(error);
  }
};

exports.postJob = async (req, res, next) => {
  try {
    ValidationError(req);

    const {
      title,
      description,
      location,
      locationType,
      jobType,
      salaryRange,
      endDate,
    } = req.body;

    console.log(endDate);

    const dto = {
      company: req.company,
      title,
      description,
      location,
      locationType: getEnumFromString(LocationType, locationType),
      jobType: getEnumFromString(JobTypes, jobType),
      status: true,
    };

    if (endDate) {
      dto.endDate = endDate;
    }

    if (salaryRange) {
      dto.salaryRange = salaryRange;
    }

    const job = await JobRepository.CreateJob(dto);

    res.status(200).send({ job });
  } catch (error) {
    next(error);
  }
};

exports.postEditJob = async (req, res, next) => {
  try {
    ValidationError(req);

    const job = await JobRepository.GetJobById(req.params.jobId);
    // await job.save();

    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotActive, 404);
    }

    const {
      title,
      description,
      location,
      locationType,
      jobType,
      salaryRange,
      endDate,
    } = req.body;

    job.title = title;
    job.description = description;
    job.location = location;
    job.locationType = getEnumFromString(LocationType, locationType);
    job.jobType = getEnumFromString(JobTypes, jobType);

    if (endDate) {
      job.endDate = endDate;
    }

    if (salaryRange) {
      job.salaryRange = salaryRange;
    }

    await job.save();

    res.status(200).send({ job });
  } catch (error) {
    next(error);
  }
};

exports.postJobQuestion = async (req, res, next) => {
  try {
    const { jobId, question } = req.body;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    const jobQuestion = await JobQuestionRepository.CreateJobQuestion({
      job,
      question,
    });
    if (!jobQuestion) {
      throw ApplicationError(ResponseMessages.JobQuestionCreationError, 500);
    }

    res.status(200).send({ jobQuestion });
  } catch (error) {
    next(error);
  }
};

exports.postEditJobQuestion = async (req, res, next) => {
  try {
    ValidationError(req);

    const { jobId, question } = req.body;

    const jobQuestionId = req.params.id;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    const jobQuestion = await JobQuestionRepository.GetJobQuestionById(
      jobQuestionId
    );
    if (!jobQuestion) {
      throw ApplicationError(ResponseMessages.JobQuestionNotFound, 404);
    }

    jobQuestion.question = question;

    jobQuestion.save();

    res.status(200).send({ jobQuestion });
  } catch (error) {
    next(error);
  }
};

exports.postToggleJobStatus = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    await JobRepository.SetJobStatus(jobId, !job.status);

    res.send({ msg: ResponseMessages.Success });
  } catch (error) {
    next(error);
  }
};

exports.getUserJobApplication = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log(userId);

    const user = await userRepository.GetUserById(userId);
    if (!user) {
      throw ApplicationError(ResponseMessages.UserNotFound, 404);
    }

    const jobId = req.params.jobId;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    if (!(await JobApplicationRepository.IsUserAppliedToJob(userId, jobId))) {
      throw ApplicationError(ResponseMessages.UserDidNotApply, 404);
    }

    const jobQuestions = await JobQuestionRepository.GetJobQuestionByJobId(
      jobId
    );

    const JobAnswerPromise = jobQuestions.map((jq) => {
      return QuestionAnswerRepository.GetUserQuestionsAnswer(jq._id, userId);
    });

    let jobAnswers = await Promise.all(JobAnswerPromise);

    const jobApplication = await JobApplicationRepository.GetUserJobApplication(
      userId,
      jobId
    );
    if (!jobApplication) {
      throw ApplicationError(ResponseMessages.UserDidNotApply, 404);
    }

    const { resumeUrl } = jobApplication;
    if (!resumeUrl) {
      throw ApplicationError(ResponseMessages.ResumeNotFound, 404);
    }

    res.status(200).send({
      jobQuestionAnswer: jobAnswers.map((ja) => ({
        question: ja.question.question,
        answer: ja.answer,
      })),
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      resumeUrl: resumeUrl,
    });
  } catch (error) {
    next(error);
  }
};

exports.getJobApplicationsByJobId = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    let applications = await JobApplicationRepository.GetJobApplicationsByJobId(
      jobId
    );

    res.status(200).send({
      jobApplications: applications.map((ja) => ({
        user: {
          name: ja.user.name,
          email: ja.user.email,
          id: ja.user._id,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.postDeclineUserJobApplication = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const user = await userRepository.GetUserById(userId);
    if (!user) {
      throw ApplicationError(ResponseMessages.UserNotFound, 404);
    }

    const jobId = req.params.jobId;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    const jobQuestions = await JobQuestionRepository.GetJobQuestionByJobId(
      jobId
    );

    const deleteJobAnswerPromise = jobQuestions.map((jq) => {
      return QuestionAnswerRepository.DeleteUserJobAnswerForJob(userId, jq._id);
    });

    await Promise.all(deleteJobAnswerPromise);

    await JobApplicationRepository.DeleteUserApplication(userId, jobId);

    res.send({ msg: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getImage = async (req, res, next) => {
  try {
    const company = await CompanyRepository.GetCompanyById(
      req.params.companyId
    );

    const imageData = fs.readFileSync(company.logoUrl);

    res.setHeader("Content-Type", "image/jpeg");
    res.send(imageData);
  } catch (error) {
    next(error);
  }
};

exports.getUserResumeForJob = async (req, res, next) => {
  try {
    const { userId, jobId } = req.params;

    const user = await userRepository.GetUserById(userId);
    if (!user) {
      throw ApplicationError(ResponseMessages.UserNotFound, 404);
    }

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    const jobApplication = await JobApplicationRepository.GetUserJobApplication(
      userId,
      jobId
    );
    if (!jobApplication) {
      throw ApplicationError(ResponseMessages.UserDidNotApply, 404);
    }

    const { resumeUrl } = jobApplication;
    if (!resumeUrl) {
      throw ApplicationError(ResponseMessages.ResumeNotFound, 404);
    }

    const filePath = path.resolve(resumeUrl);
    if (!fs.existsSync(filePath)) {
      throw ApplicationError(ResponseMessages.ResumeNotFound, 404);
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
