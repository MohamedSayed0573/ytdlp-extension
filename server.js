const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { AppError, RateLimit } = require("./utils/errors");
const apiRoutes = require("./routes/api");
const { rateLimit } = require("express-rate-limit");
const CONFIG = require("./config/constants");
const helmet = require("helmet");

const limiter = rateLimit({
    windowMs: CONFIG.WINDOW_LIMIT_MS, // Time frame for which requests are checked/remembered
    limit: CONFIG.LIMIT, // Number of requests allowed in the time frame
    handler: (req, res, next, options) => {
        throw new RateLimit("Too many requests, please try again later.");
    }
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Apply helmet middleware to all requests.
app.use(helmet());

// Enable CORS for all routes. This is only for development
app.use(cors());

// Routes
app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Error handler
app.use((err, req, res, next) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message =
        err instanceof AppError ? err.message : "Internal Server Error";

    if (process.env.NODE_ENV === "production") {
        res.status(status).json({
            message,
        });
    } else {
        res.status(status).json({
            message,
            errors: err.errors,
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
