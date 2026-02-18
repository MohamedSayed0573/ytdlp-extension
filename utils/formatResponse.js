const CONFIG = require("../config/constants");
const ms = require("ms");
const { filesize } = require("filesize");

function formatResponse(data) {
    const videoFormatsIDs = CONFIG.VIDEO_FORMAT_IDS;
    const audioFormatID = CONFIG.AUDIO_FORMAT_ID;

    // Video Duration
    const rawDuration =
        data.duration ?? data.formats?.[0]?.fragments?.[0]?.rawDuration ?? null;
    const duration = rawDuration !== null ? ms(rawDuration * 1000) : null;

    // Audio Format Size
    const rawAudioFormat = data.formats.find(
        (format) => format.format_id === audioFormatID,
    );
    const audioFormatSize = rawAudioFormat
        ? (rawAudioFormat.filesize || rawAudioFormat.filesize_approx)
        : null;

    // Video Formats Sizes
    const videoFormatsSize = data.formats
        .filter(
            (format) =>
                videoFormatsIDs.includes(format.format_id) &&
                format.height &&
                (format.filesize || format.filesize_approx),
        )
        .map((format) => {
            return {
                format_id: format.format_id,
                height: format.height,
                filesize: format.filesize ?? format.filesize_approx,
            };
        });

    return {
        id: data.id,
        title: data.title,
        duration: duration,
        audioFormat: audioFormatSize,
        videoFormats: videoFormatsSize,
    };
}

function humanizeSizes(data) {
    if (data.audioFormat) {
        data.audioFormat = filesize(data.audioFormat);
    }
    if (data.videoFormats) {
        data.videoFormats.forEach((format) => {
            if (format.filesize) {
                format.filesize = filesize(format.filesize);
            }
        });
    }
}

function mergeAudioWithVideoFormats(data) {
    if (data.audioFormat && data.videoFormats) {
        data.videoFormats.forEach((format) => {
            if (format.filesize) {
                format.filesize += data.audioFormat;
            }
        });
    }
}

module.exports = {
    formatResponse,
    humanizeSizes,
    mergeAudioWithVideoFormats,
};
