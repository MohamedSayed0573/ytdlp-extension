const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { AppError } = require("./utils/errors");
const apiRoutes = require("./routes/api");

// Enable CORS for all routes. This is only for development
app.use(cors());

app.use("/api", apiRoutes);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message = err instanceof AppError ? err.message : "Internal Server Error"

    if (process.env.NODE_ENV === "production") {
        res.status(status).json({
            message,
        });
    } else {
        res.status(status).json({
            message,
            errors: err.errors
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
