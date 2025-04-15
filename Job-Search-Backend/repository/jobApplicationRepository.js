const { JobApplication } = require("../model/jobApplications");

class JobApplicationRepository {
  UserApplyForJob = async (jobApplication) =>
    await JobApplication.create(jobApplication);

  AddUserResumeToApplication = async (resumePath, applicationId) =>
    await JobApplication.updateOne(
      { id: applicationId },
      { resumeUrl: resumePath }
    );

  GetJobApplicationsByJobId = async (jobId) =>
    await JobApplication.find({ job: jobId }).populate("job").populate("user");

  IsUserAppliedToJob = async (userId, jobId) => {
    const userApplication = await JobApplication.findOne({
      job: jobId,
      user: userId,
    });

    if (userApplication) return true;

    return false;
  };

  DeleteUserApplication = async (userId, jobId) =>
    await JobApplication.deleteMany({ user: userId, job: jobId });

  GetUserJobApplication = async (userId, jobId) =>
    await JobApplication.findOne({ user: userId, job: jobId });
}

exports.JobApplicationRepository = new JobApplicationRepository();
