const { Schema, default: mongoose } = require("mongoose");

const questionAnswerSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobQuestion",
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

exports.QuestionAnswer = mongoose.model("QuestionAnswer", questionAnswerSchema);
