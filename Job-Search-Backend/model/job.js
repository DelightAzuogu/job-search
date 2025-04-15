const { Schema, default: mongoose } = require("mongoose");
const { JobTypes, LocationType } = require("../util/enums");

const jobSchema = new Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    enum: Object.values(JobTypes),
  },
  locationType: {
    type: String,
    enum: Object.values(LocationType),
  },
  salaryRange: {
    type: String,
    default: "Not Specified",
  },
  postDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date().setMonth(new Date().getMonth() + 1),
  },
  status: {
    type: Boolean,
    default: false,
  },
});

exports.Job = mongoose.model("Job", jobSchema);
