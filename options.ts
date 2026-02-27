import { loadOptions } from "./utils";
const optionIDs = ["p144", "p240", "p360", "p480", "p720", "p1080", "p1440"];

// If any change in options, update chrome storage
optionIDs.forEach((option) => {
    document.getElementById(option)?.addEventListener("change", (event) => {
        chrome.storage.sync.set({ [option]: (event.target as HTMLInputElement).checked });
    });
});

loadOptions();
