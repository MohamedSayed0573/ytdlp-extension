const express = require("express");
const cors = require("cors");
const app = express();
const { promisify } = require("node:util");
const execFile = promisify(require("node:child_process").execFile);
const { filesize } = require("filesize");
const ms = require("ms");
require("dotenv").config();
const { AppError, InvalidInputError } = require("./utils/errors");

// Enable CORS for all routes. This is only for development
app.use(cors());

app.get("/api/video-sizes/:videoUrl", async (req, res) => {
    const startTime = Date.now();
    const videoUrl = req.params.videoUrl;

    try {
        const { stdout, stderr } = await execFile(
            "yt-dlp",
            [
                "-J",
                "--no-warnings",
                "--skip-download",
                "--js-runtimes",
                "node",
                videoUrl,
            ],
            {
                timeout: 20000, // 20 seconds timeout
            },
        );

        const data = JSON.parse(stdout);

        const endTime = Date.now();

        const videoFormats = ["394", "395", "396", "397", "398", "399"];
        const audioFormat = "251";

        const parsedData = {
            id: data.id,
            title: data.title,
            duration: ms(data.formats[0].fragments[0].duration * 1000),
            audioFormat: filesize(
                data.formats.filter(
                    (format) => format.format_id === audioFormat,
                )[0].filesize_approx,
            ),
            videoFormats: data.formats
                .filter(
                    (format) =>
                        format.height &&
                        format.filesize &&
                        videoFormats.includes(format.format_id),
                )
                .map((format) => {
                    return {
                        format_id: format.format_id,
                        height: format.height,
                        filesize: filesize(format.filesize),
                    };
                }),
            executionTime: ms(endTime - startTime),
        };

        res.json(parsedData);
    } catch (err) {
        if (err.message.includes("Incomplete YouTube ID")) {
            throw new InvalidInputError("Invalid YouTube URL provided.");
        }
    }
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use((err, req, res, next) => {
    let status = err instanceof AppError ? err.statusCode : 500;

    res.status(status).json({
        message: "An Error occurred: " + err.message,
        errors: err.errors,
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
    