(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/ms/index.js
  var require_ms = __commonJS({
    "node_modules/ms/index.js"(exports, module) {
      var s = 1e3;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;
      module.exports = function(val, options) {
        options = options || {};
        var type = typeof val;
        if (type === "string" && val.length > 0) {
          return parse(val);
        } else if (type === "number" && isFinite(val)) {
          return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error(
          "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
        );
      };
      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          str
        );
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || "ms").toLowerCase();
        switch (type) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return n * y;
          case "weeks":
          case "week":
          case "w":
            return n * w;
          case "days":
          case "day":
          case "d":
            return n * d;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return n * h;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return n * m;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return n * s;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return n;
          default:
            return void 0;
        }
      }
      function fmtShort(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return Math.round(ms / d) + "d";
        }
        if (msAbs >= h) {
          return Math.round(ms / h) + "h";
        }
        if (msAbs >= m) {
          return Math.round(ms / m) + "m";
        }
        if (msAbs >= s) {
          return Math.round(ms / s) + "s";
        }
        return ms + "ms";
      }
      function fmtLong(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return plural(ms, msAbs, d, "day");
        }
        if (msAbs >= h) {
          return plural(ms, msAbs, h, "hour");
        }
        if (msAbs >= m) {
          return plural(ms, msAbs, m, "minute");
        }
        if (msAbs >= s) {
          return plural(ms, msAbs, s, "second");
        }
        return ms + " ms";
      }
      function plural(ms, msAbs, n, name) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
      }
    }
  });

  // popup.js
  var require_popup = __commonJS({
    "popup.js"() {
      var import_ms = __toESM(require_ms());
      var statusEl = document.getElementById("status");
      var durationDisplay = document.getElementById("duration-display");
      var titleDisplay = document.getElementById("title-display");
      var audioDisplay = document.getElementById("audio-display");
      function showError(msg) {
        console.error("[popup] Error:", msg);
        statusEl.innerHTML = `<div class="error">Error: ${msg}</div>`;
      }
      function showInfo(msg) {
        console.log("[popup] Info:", msg);
        statusEl.innerHTML = `<div class="info">${msg}</div>`;
      }
      function displayVideoInfo(data) {
        try {
          if (!data) {
            showError("Missing video data");
            return;
          }
          if (data.title) {
            titleDisplay.textContent = data.title;
          }
          if (data.duration) {
            durationDisplay.textContent = data.duration;
          }
          if (data.audioFormat) {
            audioDisplay.textContent = data.audioFormat;
          }
          if (data.videoFormats && data.videoFormats.length > 0) {
            statusEl.innerHTML = `
                <div class="formats-section">
                    ${data.videoFormats.map(
              (format) => `
                        <div class="format-item" onclick="copyToClipboard('${format.height}p')">
                            <div class="format-height">${format.height}p:</div>
                            <div class="format-size">${format.filesize}</div>
                        </div>
                    `
            ).join("")}
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
        if (url.includes("watch?v=")) {
          const tag = url.split("watch?v=")[1].split("&")[0];
          const regex = /^[a-zA-Z0-9_-]{11}$/;
          if (!regex.test(tag)) {
            throw new Error("Invalid YouTube video URL");
          }
          return tag;
        }
        return null;
      }
      function isYoutubeVideo(url) {
        return url.includes("youtube.com/");
      }
      async function saveToStorage(tag, response) {
        const now = /* @__PURE__ */ new Date();
        response.data.createdAt = now.toISOString();
        await chrome.storage.local.set({ [tag]: response.data });
      }
      async function getFromStorage(tag) {
        const res = await chrome.storage.local.get(tag);
        return res == null ? void 0 : res[tag];
      }
      function showCachedNote(createdAt) {
        const now = /* @__PURE__ */ new Date();
        const createdDate = new Date(createdAt);
        const diff = now - createdDate;
        const humanAgo = (0, import_ms.default)(diff) + " ago";
        console.log("[popup] Video info cached", humanAgo);
        const note = document.createElement("div");
        note.className = "cached-note";
        note.textContent = `Cached ${humanAgo}`;
        statusEl.prepend(note);
      }
      chrome.tabs.query({ active: true }, async (tab) => {
        const url = tab[0].url;
        if (!isYoutubeVideo(url)) {
          showInfo("Not a YouTube video page");
          return;
        }
        const tag = extractTag(url);
        if (!tag) {
          showInfo("Open a Youtube video");
          return;
        }
        try {
          const cached = await getFromStorage(tag);
          if (cached) {
            displayVideoInfo(cached);
            showCachedNote(cached.createdAt);
            return;
          }
        } catch (e) {
          console.error("[popup] Error reading storage:", e);
        }
        chrome.runtime.sendMessage(
          { type: "sendYoutubeUrl", value: tag },
          (response) => {
            if (response.success) {
              displayVideoInfo(response.data);
              saveToStorage(tag, response);
            } else {
              showError(response.message || "Unknown error - check console");
            }
          }
        );
      });
    }
  });
  require_popup();
})();
//# sourceMappingURL=popup.js.map
