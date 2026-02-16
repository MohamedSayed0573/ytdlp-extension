const env = require("../utils/env");
const { UnAuthenticated } = require("../utils/errors");

function authMiddleware(req, res, next) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== env.API_KEY) {
        throw new UnAuthenticated("Invalid API key");
    }

    next();
}

module.exports = authMiddleware;
