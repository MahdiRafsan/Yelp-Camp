const AppError = require("./AppError");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

class NotFoundError extends AppError {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = StatusCodes.NOT_FOUND;
    this.reason = getReasonPhrase(StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;