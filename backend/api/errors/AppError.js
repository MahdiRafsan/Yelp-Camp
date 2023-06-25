class AppError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError