const argon2 = require("argon2");
const path = require("path");

const { ValidationError, ApplicationError } = require("../util/errors");
const { userRepository } = require("../repository/userRepository");
const { signToken } = require("../util/jwt");
const { ResponseMessages } = require("../util/ResponseMessages");
const {
  JobApplicationRepository,
} = require("../repository/jobApplicationRepository");
const { JobRepository } = require("../repository/jobRepository");
const {
  JobQuestionRepository,
} = require("../repository/jobQuestionRepository");
const {
  QuestionAnswerRepository,
} = require("../repository/questionAnswerRepository");
const { CompanyRepository } = require("../repository/companyRepository");
const { RatingRepository } = require("../repository/ratingResposity");

function getFilePath(file) {
  const relativeFilePath = file.path;
  const rootDirectory = path.resolve(__dirname, "../");
  return path.resolve(rootDirectory, path.resolve(relativeFilePath));
}

exports.postSignInUser = async (req, res, next) => {
  try {
    ValidationError(req);

    const { email, password, name } = req.body;

    const oldUser = await userRepository.GetUserByEmail(email);
    if (oldUser) {
      throw ApplicationError(ResponseMessages.UserWithEmailExist);
    }

    const passwordHash = await argon2.hash(password);

    const user = await userRepository.CreateUser({ email, name, passwordHash });

    const token = signToken(user.id, email, "user");

    res.send({
      token,
      userId: user._id,
      type: "user",
    });
  } catch (error) {
    next(error);
  }
};

exports.postLoginUser = async (req, res, next) => {
  try {
    ValidationError(req);

    const { email, password } = req.body;

    const user = await userRepository.GetUserByEmail(email);
    if (!user) {
      throw ApplicationError(ResponseMessages.UserWithEmailExist);
    }

    const comparePasswords = await argon2.verify(user.passwordHash, password);

    if (!comparePasswords) {
      throw ApplicationError(ResponseMessages.InvalidPassword);
    }

    res.status(200).send({
      token: signToken(user._id, email, "user"),
      userId: user._id,
      type: "user",
    });
  } catch (error) {
    next(error);
  }
};

exports.postResumeForApplication = async (req, res, next) => {
  try {
    ValidationError(req);

    if (!req.file) {
      throw ApplicationError(ResponseMessages.ResumeNotFound, 404);
    }

    const application =
      await JobApplicationRepository.AddUserResumeToApplication(
        getFilePath(req.file),
        req.body.applicationId
      );
    if (!application) {
      throw ApplicationError("Resume Update Error", 404);
    }

    res.send({ msg: "Resume Updated" });
  } catch (error) {
    next(error);
  }
};

exports.PostUserRateCompany = async (req, res, next) => {
  try {
    ValidationError(req);
    const userId = req.userId;

    console.log(userId);

    const { companyId, rating } = req.params;

    const user = await userRepository.GetUserById(userId);
    if (!user) {
      throw ApplicationError(ResponseMessages.UserNotFound, 404);
    }

    const company = await CompanyRepository.GetCompanyById(companyId);
    if (!company) {
      throw ApplicationError(ResponseMessages.CompanyNotFound, 404);
    }

    const userRating = await RatingRepository.GetUserRating(userId, companyId);
    if (userRating) {
      await RatingRepository.DeleteUserRating(userId, companyId);
    }

    console.log(userRating);

    await RatingRepository.AddUserRating(userId, companyId, rating);

    res.send({ msg: "Rated" });
  } catch (error) {
    next(error);
  }
};

exports.postUserApplication = async (req, res, next) => {
  try {
    ValidationError(req);

    const jobId = req.params.jobId;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    if (!job.status) {
      throw ApplicationError(ResponseMessages.JobNotActive, 400);
    }

    if (await JobApplicationRepository.IsUserAppliedToJob(req.userId, jobId)) {
      throw ApplicationError(ResponseMessages.UserAlreadyApplied, 409);
    }

    await postUserJobQuestion(req, next);

    const jobApplication = await JobApplicationRepository.UserApplyForJob({
      user: req.user,
      job,
    });

    if (!jobApplication) {
      throw ApplicationError(ResponseMessages.SomethingWentWrong, 500);
    }

    res.send({ applicationId: jobApplication._id });
  } catch (error) {
    next(error);
  }
};

async function postUserJobQuestion(req, next) {
  const jobId = req.params.jobId;
  const { jobQuestions } = req.body;
  const jobQuestionPromises = [];

  jobQuestions.forEach((jq) => {
    jobQuestionPromises.push(JobQuestionRepository.GetJobQuestionById(jq.id));
  });

  const jobQuestionsResults = await Promise.all(jobQuestionPromises);

  jobQuestionsResults.forEach((jobQuestion) => {
    if (!jobQuestion) {
      throw ApplicationError("Invalid Question", 404);
    }
  });

  const jobQuestionOfJob = await JobQuestionRepository.GetJobQuestionByJobId(
    jobId
  );

  if (jobQuestionOfJob.length != jobQuestions.length) {
    throw ApplicationError(ResponseMessages.JobQuestionCreationError, 409);
  }

  const answerPromises = jobQuestions.map((jobQuestion) => {
    return QuestionAnswerRepository.UserAnswerQuestion({
      user: req.user,
      question: jobQuestion.id,
      answer: jobQuestion.answer,
    });
  });

  await Promise.all(answerPromises);
}
