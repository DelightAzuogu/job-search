const { Rating } = require("../model/ratings");

class RatingRepository {
  AddUserRating = async (userId, companyId, rating) =>
    await Rating.create({
      user: userId,
      company: companyId,
      rating: rating,
    });

  GetCompanyRatings = async (companyId) => {
    const ratings = await Rating.find({ company: companyId });

    if (ratings.length <= 0) {
      return "no ratings";
    }

    let sum = 0;

    ratings.forEach((rating) => {
      sum += rating.rating;
    });

    var avg = sum / ratings.length;

    return avg;
  };

  GetUserRating = async (userId, companyId) =>
    await Rating.findOne({ user: userId, company: companyId });

  DeleteUserRating = async (userId, companyId) =>
    await Rating.deleteOne({ user: userId, company: companyId });
}

exports.RatingRepository = new RatingRepository();
