const { Job } = require("../model/job");

class JobRepository {
  CreateJob = async (job) => await Job.create(job);

  GetJobById = async (id) => await Job.findById(id);

  GetCompanyJobs = async (companyId) =>
    await Job.find({ company: companyId, status: true });

  GetAllCompanyJobs = async (companyId) =>
    await Job.find({ company: companyId }).sort({ postDate: -1 });

  GetPaginatedJobs = async (pageNumber, pageSize) =>
    await Job.find({ status: true })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .populate("company");

  SetJobStatus = async (jobId, status) =>
    await Job.updateOne({ _id: jobId }, { status: status });

  GetAllActive = async () => await Job.find({ status: true });
}

exports.JobRepository = new JobRepository();
