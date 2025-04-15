const { ResponseMessages } = require("./ResponseMessages");
const { ApplicationError } = require("./errors");

exports.JobTypes = Object.freeze({
  Fulltime: "full-time",
  Parttime: "part-time",
  Contract: "contract",
  Internship: "internship",
});

exports.LocationType = Object.freeze({
  Remote: "remote",
  Hybrid: "hybrid",
  Onsite: "onsite",
});

exports.getEnumFromString = function (enumObject, value) {
  for (const key in enumObject) {
    if (enumObject[key] === value) {
      return value;
    }
  }
  throw ApplicationError(ResponseMessages.InvalidEnum, 404);
};
