export function extractVideoTag(url: string) {
    try {
        const parsedUrl = new URL(url);
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

export const optionIDs = ["p144", "p240", "p360", "p480", "p720", "p1080", "p1440"];

// Load options when you open the popup
export function loadOptions() {
    optionIDs.forEach(async (option) => {
        const { [option]: value } = await chrome.storage.sync.get(option);
        // @ts-expect-error
        document.getElementById(option)!.checked = value ?? false;
    });
}

export async function getOptions() {
    return await chrome.storage.sync.get(optionIDs);
}
