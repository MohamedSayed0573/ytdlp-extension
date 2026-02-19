console.log("[background] Service worker starting");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "sendYoutubeUrl") {
        return;
    }
    const tag = message.value;
    console.log("[background] Received tag:", tag);

    // __API_URL__ is injected by esbuild
    const humanReadableSizes = true;
    const mergeAudioWithVideo = true;
    const apiUrl = `${__API_URL__}/api/video-sizes/${tag}/?humanReadableSizes=${humanReadableSizes}&mergeAudioWithVideo=${mergeAudioWithVideo}`;
    console.log("[background] Fetching URL:", apiUrl);

    fetch(apiUrl, {
        method: "GET",
    })
        .then((res) => {
            console.log("[background] Response status:", res.status);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            return res.json();
        })
        .then((data) => {
            console.log("[background] Got data:", data);
            sendResponse({ success: true, data });
        })
        .catch((err) => {
            console.error("[background] Fetch error:", err.message);
            sendResponse({ success: false, message: err.message });
        });

    return true; // To keep the message channel open
});
