const { Schema, default: mongoose } = require("mongoose");

const jobQuestionsSchema = new Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
});

exports.JobQuestion = mongoose.model("JobQuestion", jobQuestionsSchema);
