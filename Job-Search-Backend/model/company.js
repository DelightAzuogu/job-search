const { Schema, default: mongoose } = require("mongoose");

const companySchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
  },
});

exports.Company = mongoose.model("Company", companySchema);
