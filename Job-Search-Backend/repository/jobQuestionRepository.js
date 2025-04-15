const { JobQuestion } = require("../model/jobQuestions");

class JobQuestionRepository {
  CreateJobQuestion = async (jobQuestion) =>
    await JobQuestion.create(jobQuestion);

  GetJobQuestionById = async (id) => await JobQuestion.findById(id);

  GetJobQuestionByJobId = async (jobId) =>
    await JobQuestion.find({ job: jobId });
}

exports.JobQuestionRepository = new JobQuestionRepository();
