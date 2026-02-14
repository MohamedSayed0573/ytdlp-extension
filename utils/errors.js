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

module.exports = {
    AppError,
    InvalidInputError,
};
