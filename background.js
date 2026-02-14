console.log("[background] Service worker starting");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "sendYoutubeUrl") {
        return;
    }
    const tag = encodeURIComponent(message.value);
    console.log("[background] Received tag:", tag);

    const url = `http://172.26.248.186:3000/api/video-sizes/${tag}`;
    console.log("[background] Fetching URL:", url);

    fetch(url)
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

    return true; // MUST be synchronous return, not from async function
});
//
