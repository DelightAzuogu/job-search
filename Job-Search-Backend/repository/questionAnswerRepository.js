const { QuestionAnswer } = require("../model/questionAnswer");

class QuestionAnswerRepository {
  UserAnswerQuestion = async (questionAnswer) =>
    await QuestionAnswer.create(questionAnswer);

  GetUserQuestionsAnswer = async (question, user) =>
    await QuestionAnswer.findOne({ question, user }).populate("question");

  DeleteUserJobAnswerForJob = async (user, question) =>
    await QuestionAnswer.deleteMany({ question, user });
}

exports.QuestionAnswerRepository = new QuestionAnswerRepository();
