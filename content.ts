import { extractVideoTag } from "./utils";

function init(videoTag: string) {
    console.log(videoTag);
    const fullHTML = document.documentElement.outerHTML;
    console.log(`[CONTENT.TS] Full HTML: ${fullHTML}`);

    chrome.runtime.sendMessage(
        {
            type: "sendYoutubeUrl",
            tag: videoTag,
            html: fullHTML,
        },
        (response) => {
            console.log(response);
        },
    );
}

window.addEventListener("yt-navigate-finish", () => {
    const url = window.location.href;
    const tag = extractVideoTag(url);
    if (tag) {
        chrome.runtime.sendMessage({ type: "setBadge", tag });
        init(tag);
    } else {
        chrome.runtime.sendMessage({ type: "clearBadge" });
    }
});
