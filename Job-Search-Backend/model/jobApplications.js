const { Schema, default: mongoose } = require("mongoose");

const jobApplicationSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  resumeUrl: {
    type: String,
  },
});

exports.JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
