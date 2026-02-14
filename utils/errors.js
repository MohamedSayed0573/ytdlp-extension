class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class InvalidInputError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class RateLimit extends AppError {
    constructor(message) {
        super(message, 429);
    }
}

module.exports = {
    AppError,
    InvalidInputError,
    RateLimit
};
