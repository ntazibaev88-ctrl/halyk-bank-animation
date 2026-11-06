// Screenshot a local HTML page once document.title === "ready". Usage: node shot.mjs page.html out.png W H
const { chromium } = require("playwright");
(async () => {
const [page, out, w = "2160", h = "1920"] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--allow-file-access-from-files"] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on("console", (m) => console.log("console:", m.text())); p.on("pageerror", (e) => console.log("error:", e.message));
await p.goto(page.startsWith("http") ? page : "file://" + page); await p.waitForFunction(() => document.title === "ready", null, { timeout: 15000 });
await p.screenshot({ path: out }); await b.close();
})();
