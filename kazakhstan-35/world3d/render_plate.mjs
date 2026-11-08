// Renders the 3D plate frames: node render_plate.mjs <scale> <fromFrame> <toFrame> <outdir>
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "fs";
const [scale = "0.75", from = "0", to = "3270", out = "frames"] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", (e) => console.log("pageerror:", e.message));
await pg.goto(`http://localhost:8765/kazakhstan-35/world3d/index.html?scale=${scale}`);
await pg.waitForFunction(() => window.ready || (window.__status || "").startsWith("error"), null, { timeout: 600000 });
const t0 = Date.now(); let n = 0;
for (let f = +from; f < +to; f++) {
  const file = `${out}/f_${String(f).padStart(5, "0")}.jpg`;
  if (fs.existsSync(file)) continue;
  const url = await pg.evaluate((t) => window.grab(t, 0.93), f / 30);
  fs.writeFileSync(file + ".tmp", Buffer.from(url.split(",")[1], "base64")); fs.renameSync(file + ".tmp", file);
  n++; if (n % 30 === 0) console.log(`frame ${f} · ${((Date.now() - t0) / n / 1000).toFixed(2)} s/frame`);
}
console.log("DONE", from, to, n, "frames", ((Date.now() - t0) / 1000).toFixed(0), "s");
await b.close();
