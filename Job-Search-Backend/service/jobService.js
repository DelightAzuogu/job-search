const { CompanyRepository } = require("../repository/companyRepository");
const {
  JobQuestionRepository,
} = require("../repository/jobQuestionRepository");
const { JobRepository } = require("../repository/jobRepository");
const { RatingRepository } = require("../repository/ratingResposity");
const { ResponseMessages } = require("../util/ResponseMessages");
const { ApplicationError } = require("../util/errors");

exports.getPaginatedJobs = async (req, res, next) => {
  try {
    const pageSize = parseInt(req.params.pageSize, 10);
    const pageNumber = parseInt(req.params.pageNumber, 10);

    const paginatedJobs = await JobRepository.GetPaginatedJobs(
      pageNumber,
      pageSize
    );

    const paginatedJobDtoPromises = paginatedJobs.map(async (job) => {
      const rating = await RatingRepository.GetCompanyRatings(job.company._id);

      return {
        company: {
          name: job.company.name,
          id: job.company._id,
          rating: rating,
        },
        title: job.title,
        location: job.location,
        jobType: job.jobType,
        locationType: job.locationType,
        salaryRange: job.salaryRange,
        endDate: job.endDate,
        postDate: job.postDate,
        id: job._id,
      };
    });

    const paginatedJobDto = await Promise.all(paginatedJobDtoPromises);

    res.send({ jobs: paginatedJobDto });
  } catch (error) {
    next(error);
  }
};

exports.getCompanyJobs = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;

    const company = await CompanyRepository.GetCompanyById(companyId);
    if (!company) {
      throw ApplicationError(ResponseMessages.CompanyNotFound, 404);
    }

    const jobs = await JobRepository.GetCompanyJobs(companyId);

    const jobDto = jobs.map((job) => ({
      company: {
        name: job.company.name,
        id: job.company._id,
      },
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      locationType: job.locationType,
      salaryRange: job.salaryRange,
      endDate: job.endDate,
      postDate: job.postDate,
      status: job.status,
    }));

    res.send({ jobs: jobDto });
  } catch (error) {
    next(error);
  }
};

exports.getAllCompanyJob = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;

    const company = await CompanyRepository.GetCompanyById(companyId);
    if (!company) {
      throw ApplicationError(ResponseMessages.CompanyNotFound, 404);
    }

    const jobs = await JobRepository.GetAllCompanyJobs(companyId);

    const jobDto = jobs.map((job) => ({
      company: {
        name: job.company.name,
        id: job.company._id,
      },
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      locationType: job.locationType,
      salaryRange: job.salaryRange,
      endDate: job.endDate,
      postDate: job.postDate,
      status: job.status,
      id: job._id,
    }));

    res.send({ jobs: jobDto });
  } catch (error) {
    next(error);
  }
};

exports.getJobQuestions = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;

    const job = await JobRepository.GetJobById(jobId);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    const jobQuestion = await JobQuestionRepository.GetJobQuestionByJobId(
      jobId
    );

    const jobQuestionDto = jobQuestion.map((jq) => ({
      question: jq.question,
      id: jq.id,
    }));

    res.status(200).send({
      jobQuestions: jobQuestionDto,
      job: {
        title: job.title,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getPaginationCount = async (req, res, next) => {
  try {
    const jobs = await JobRepository.GetAllActive();
    const pageSize = parseInt(req.params.pageSize);

    const totalPages = Math.ceil(jobs.length / pageSize);

    res.json({ totalPages });
  } catch (error) {
    next(error);
  }
};

exports.getJobDetails = async (req, res, next) => {
  try {
    let job = await JobRepository.GetJobById(req.params.id);
    if (!job) {
      throw ApplicationError(ResponseMessages.JobNotFound, 404);
    }

    job = await job.populate("company");

    const rating = await RatingRepository.GetCompanyRatings(job.company._id);

    const jobDto = {
      company: {
        name: job.company.name,
        id: job.company._id,
        rating: rating,
      },
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      locationType: job.locationType,
      salaryRange: job.salaryRange,
      endDate: job.endDate,
      postDate: job.postDate,
      id: job._id,
    };

    res.status(200).send({ job: jobDto });
  } catch (error) {
    next(error);
  }
};
