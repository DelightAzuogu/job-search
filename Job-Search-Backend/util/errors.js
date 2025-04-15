const { validationResult } = require("express-validator");

exports.ApplicationError = (data, status) => {
  const err = new Error(data);
  err.status = status;
  err.message = err.message;
  return err;
};

exports.ValidationError = (req) => {
  const validationError = validationResult(req);

  if (!validationError.isEmpty()) {
    const error = new Error("invalid validation");
    error.status = 422;
    error.data = validationError.array();

    throw error;
  }
};
