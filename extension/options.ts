import { optionIDs, getElement } from "./utils";
import { clearStorage } from "./cache";

// Listen to changes in options and update chrome storage
optionIDs.forEach((option) => {
    getElement(option, false)?.addEventListener("change", (event) => {
        chrome.storage.sync.set({ [option]: (event.target as HTMLInputElement).checked });
    });
});

// Listen to reset cache button click
getElement("resetCache", false)?.addEventListener("click", () => {
    clearStorage();
});

// Listen to choose Cache TTL option
getElement("cacheTTL", false)?.addEventListener("change", (event) => {
    const value = (event.target as HTMLInputElement).value;
    const ttlInSeconds: Map<string, number> = new Map([
        ["1", 1 * 24 * 60 * 60],
        ["3", 3 * 24 * 60 * 60],
        ["7", 7 * 24 * 60 * 60],
    ]);

    chrome.storage.sync.set({ cacheTTL: ttlInSeconds.get(value) });
});

// Load options from chrome storage when options page is opened
async function loadOptions() {
    // Quality Options
    const options = await chrome.storage.sync.get(optionIDs);
    optionIDs.forEach((optionId) => {
        const checkbox = getElement(optionId, false) as HTMLInputElement;
        if (!checkbox) return;
        checkbox.checked = (options[optionId] as boolean) ?? true;
    });

    // Cache TTL
    const { cacheTTL = 3 * 24 * 60 * 60 } = await chrome.storage.sync.get("cacheTTL");
    const cacheEl = getElement("cacheTTL", false) as HTMLInputElement | null;
    if (cacheEl && cacheTTL) {
        const days = parseInt(cacheTTL as string) / (24 * 60 * 60);
        cacheEl.value = String(days);
    }
}

loadOptions();
