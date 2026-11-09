// Look-dev driver: node preview.mjs <scale> <t1,t2,...> <outdir>
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "fs";
const [scale = "0.3", times = "0", out = "/tmp/claude-0/prev"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("console:", m.text().slice(0, 300)); });
pg.on("pageerror", (e) => console.log("pageerror:", e.message));
await pg.goto(`http://localhost:8765/kazakhstan-35/world3d/index.html?scale=${scale}`);
await pg.waitForFunction(() => window.ready || (window.__status || "").startsWith("error"), null, { timeout: 300000 });
const st = await pg.evaluate(() => window.__status); if (st.startsWith("error")) { console.log(st); process.exit(1); }
for (const t of times.split(",").map(Number)) {
  const t0 = Date.now();
  const url = await pg.evaluate((t) => window.grab(t, 0.9), t);
  fs.writeFileSync(`${out}/t${String(t.toFixed(2)).padStart(6, "0")}.jpg`, Buffer.from(url.split(",")[1], "base64"));
  console.log("t", t, "ms", Date.now() - t0);
}
await b.close();
