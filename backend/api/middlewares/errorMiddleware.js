const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const castErrorHandler = (err) => {
  const modelName = err.message.split(" ").at(-1).slice(1, -1);
  const errorMessages = {
    User: `Invalid value ${err.value} for user ${err.path}`,
    Campground: `Invalid value ${err.value} for campground ${err.path}`,
    Review: `Invalid value ${err.value} for review ${err.path}`,
  };

  const message = errorMessages[modelName] || "Invalid id value.";
  return new BadRequestError(message);
};

const validationErrorHandler = (err) => {
  const errorMessages = {};

  for (const field in err.errors) {
    errorMessages[field] = err.errors[field].message;
  }
  return new BadRequestError(errorMessages);
};

const devErrors = (res, err) => {
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const prodErrors = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Something went wrong! Please try again later.",
    });
  }
};

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.message = err.message || "Something went wrong! Please try again later.";

  if (process.env.NODE_ENV === "development") {
    // if (err.name === "CastError") err = castErrorHandler(err);
    // if (err.name === "ValidationError") err = validationErrorHandler(err);

    devErrors(res, err);
    
  } else if (process.env.NODE_ENV == "production") {
    if (err.name === "CastError") err = castErrorHandler(err);
    if (err.name === "ValidationError") err = validationErrorHandler(err);
    
    prodErrors(res, err);
  }
};

module.exports = errorMiddleware;