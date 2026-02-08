const express = require("express");
const app = express();
const { exec, execFile } = require("node:child_process");
const { filesize } = require("filesize");

app.get("/test", (req, res) => {
    res.json({ message: "Hello from the API!" });
});

function convertSizes(formats) {
    return formats.map((format) => ({
        ...format,
        filesize: filesize(format.filesize),
    }));
}

app.get("/api/video-sizes/:videoTag", (req, res) => {
    const startTime = Date.now();
    const videoTag = req.params.videoTag;

    const command = `yt-dlp -J --no-warnings ${videoTag} | jq {'id: .id, title: .title, formats: [.formats[] | select(.height != null and .filesize != null) | {format_id, height, filesize}]}'`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing yt-dlp: ${error.message}`);
            return res
                .status(500)
                .json({ error: "Failed to retrieve video formats" });
        }
        const endTime = Date.now();
        const duration = `${endTime - startTime} ms`;

        const parsedData = JSON.parse(stdout);

        parsedData.duration = duration;
        parsedData.formats = convertSizes(parsedData.formats);
        
        res.json(parsedData);
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
