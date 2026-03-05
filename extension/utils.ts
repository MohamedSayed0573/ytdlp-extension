export function isYoutubePage(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com";
    } catch (err) {
        return false;
    }
}

export function extractVideoId(ytUrl: string): string | undefined {
    try {
        const parsedUrl = new URL(ytUrl);

        if (parsedUrl.pathname !== "/watch") return;

        const videoTag = parsedUrl.searchParams.get("v");
        if (!videoTag) return;

        const regex = /^[a-zA-Z0-9_-]{11}$/;
        if (!regex.test(videoTag)) {
            return;
        }
        return videoTag;
    } catch (err) {
        console.error(err);
    }
}

export const optionIDs = [
    "p144",
    "p240",
    "p360",
    "p480",
    "p720",
    "p1080",
    "p1440",
    "p2160",
    "p4320",
];

// Return the user options
export async function getOptions() {
    return await chrome.storage.sync.get(optionIDs);
}

export function getElement(id: string, isFatal: true): HTMLElement;
export function getElement(id: string, isFatal?: false): HTMLElement | null;

export function getElement(id: string, isFatal: boolean = false): HTMLElement | null {
    const element = document.getElementById(id);
    if (!element) {
        const message = `[HTML] [${isFatal ? "Fatal" : "Not-Fatal"}] Element #${id} not found`;
        console.error(message);

        if (isFatal) {
            throw new Error(message);
        }
    }
    return element;
}

export async function fetchAndRetry(
    url: string,
    options: RequestInit = {},
    maxRetries = 3,
): Promise<Response> {
    let lastError: unknown;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;

            // Don't retry client errors (4xx)
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`Client Error: ${response.status}, won't retry`);
            }

            // Server error (5xx) — will retry
            throw new Error(`Server Error: ${response.status}`);
        } catch (err) {
            lastError = err;

            if (err instanceof Error && err.name === "AbortError") throw err;
            if (err instanceof Error && err.message.includes("Client Error")) throw err;

            // Skip the timeout if the last attempt
            if (attempt === maxRetries - 1) {
                // Exponential backoff before retry
                await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }
    throw new Error(`Failed after ${maxRetries} tries, last error: ${lastError}`);
}
