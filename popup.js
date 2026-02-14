const statusEl = document.getElementById("status");
const durationDisplay = document.getElementById("duration-display");
const titleDisplay = document.getElementById("title-display");
const audioDisplay = document.getElementById("audio-display");

import ms from "ms";

function showError(msg) {
    console.error("[popup] Error:", msg);
    statusEl.innerHTML = `<div class="error">⚠️ Error: ${msg}</div>`;
}

function displayVideoInfo(data) {
    try {
        if (!data) {
            showError("Missing video data");
            return;
        }

        // Update title, duration, and audio in header
        if (data.title) {
            titleDisplay.textContent = data.title;
        }
        if (data.duration) {
            durationDisplay.textContent = data.duration;
        }
        if (data.audioFormat) {
            audioDisplay.textContent = data.audioFormat;
        }

        // Display only video formats
        if (data.videoFormats && data.videoFormats.length > 0) {
            statusEl.innerHTML = `
                <div class="formats-section">
                    ${data.videoFormats
                        .map(
                            (format) => `
                        <div class="format-item" onclick="copyToClipboard('${format.height}p')">
                            <div class="format-height">${format.height}p:</div>
                            <div class="format-size">${format.filesize}</div>
                        </div>
                    `,
                        )
                        .join("")}
                </div>
            `;
        } else {
            showError("No video formats found");
        }
    } catch (e) {
        console.error("[popup] Error displaying data:", e.message);
        showError("Failed to display video data: " + e.message);
    }
}

function extractTag(url) {
    const index = url.indexOf("=");
    if (index === -1) {
        throw new Error("Error extracting video tag");
    }
    return (tag = url.slice(index + 1));
}

function isYoutubeVideo(url) {
    return url.includes("youtube.com/");
}

async function saveToStorage(tag, response) {
    const now = new Date();
    response.data.createdAt = now.toISOString();

    await chrome.storage.local.set({ [tag]: response.data });
}

async function getFromStorage(tag) {
    const res = await chrome.storage.local.get(tag);
    return res?.[tag];
}

chrome.tabs.query({ active: true }, async (tab) => {
    const url = tab[0].url;
    if (!isYoutubeVideo(url)) {
        showError("Not a YouTube video page");
        return;
    }

    const tag = extractTag(url);
    try {
        const cached = await getFromStorage(tag);
        if (cached) {
            const diffMs = Date.now() - Date.parse(cached.createdAt);
            const humanAgo = ms(diffMs, { long: true }) + " ago";
            console.log("Cached:", humanAgo);

            displayVideoInfo(cached);

            // show a small cached note above the formats
            const note = document.createElement("div");
            note.className = "cached-note";
            note.textContent = `Cached ${humanAgo}`;
            statusEl.prepend(note);

            return;
        }
    } catch (e) {
        console.error("[popup] Error reading storage:", e);
    }

    chrome.runtime.sendMessage(
        { type: "sendYoutubeUrl", value: tag },
        (response) => {
            if (response?.success) {
                displayVideoInfo(response.data);
                saveToStorage(tag, response);
            } else {
                showError(response?.message || "Unknown error - check console");
            }
        },
    );
});
