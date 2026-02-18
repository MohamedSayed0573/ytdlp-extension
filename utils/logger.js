const env = require("./env");

const logger = require("pino")({
    redact: ["req.headers[x-api-key]"],
    level: env.NODE_ENV === "production" ? "info" : "debug",
});
const pinoHttp = require("pino-http")({ logger });

module.exports = { logger, pinoHttp };
