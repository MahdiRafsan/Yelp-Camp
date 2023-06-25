const AppError = require("./AppError");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

class BadRequestError extends AppError {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.reason = getReasonPhrase(StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequestError;
