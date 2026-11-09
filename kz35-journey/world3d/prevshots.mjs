import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "fs";
const [scale = "0.3", spec = "", out = "/tmp/claude-0/jprev"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", (e) => console.log("pageerror:", e.message)); pg.on("console", (m) => { if (m.type() === "error") console.log("err", m.text().slice(0, 200)); });
await pg.goto(`http://localhost:8765/kz35-journey/world3d/index.html?scale=${scale}`);
await pg.waitForFunction(() => window.ready || (window.__status || "").startsWith("error"), null, { timeout: 600000 });
const st = await pg.evaluate(() => window.__status); if (st.startsWith("error")) { console.log(st); process.exit(1); }
for (const item of spec.split(",")) { const [n, t] = item.split("@"); const url = await pg.evaluate(([n, t]) => window.grabShot(n, +t, 0.9), [n, t]); fs.writeFileSync(`${out}/${n}_${t}.jpg`, Buffer.from(url.split(",")[1], "base64")); console.log("ok", n, t); }
await b.close();
