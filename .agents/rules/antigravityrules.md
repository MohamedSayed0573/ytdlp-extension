---
trigger: always_on
---

Don't write code ever unless I explicitly ask you to.
When I ask you about an issue, I expect you to tell me why it happens and how to fix it.

Note:
in manifest.json
I have  
"background": {
"service_worker": "dist/background.js",
"scripts": ["dist/background.js"]
},
service_worker is used by chrome.
and scripts is used by firefox. That's why I have both
