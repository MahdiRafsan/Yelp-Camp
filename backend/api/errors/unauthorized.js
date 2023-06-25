const AppError = require("./AppError");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");

class UnauthorizedError extends AppError {
  constructor(message) {
    super();
    this.message = message;
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.reason = getReasonPhrase(StatusCodes.UNAUTHORIZED);
  }
}

module.exports = UnauthorizedError;