import { loadOptions, optionIDs } from "./utils";

// If changes in options, update chrome storage
optionIDs.forEach((option) => {
    document.getElementById(option)?.addEventListener("change", (event) => {
        chrome.storage.sync.set({ [option]: (event.target as HTMLInputElement).checked });
    });
});

loadOptions();
