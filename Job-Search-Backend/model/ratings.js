const { Schema, default: mongoose } = require("mongoose");

const ratingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

exports.Rating = mongoose.model("Rating", ratingSchema);
