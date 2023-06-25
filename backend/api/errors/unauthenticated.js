const AppError = require("./AppError");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

class UnauthenticatedError extends AppError {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = StatusCodes.FORBIDDEN;
    this.reason = getReasonPhrase(StatusCodes.FORBIDDEN);
  }
}

module.exports = UnauthenticatedError;