// Bakes each 3D shot to frames: node render_clips.mjs <scale> <outdir> [name,name]
import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "fs";
const [scale = "0.8", out = "/tmp/claude-0/clips", only = ""] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", (e) => console.log("pageerror:", e.message));
await pg.goto(`http://localhost:8765/kz35-journey/world3d/index.html?scale=${scale}`);
await pg.waitForFunction(() => window.ready || (window.__status || "").startsWith("error"), null, { timeout: 600000 });
const st = await pg.evaluate(() => window.__status); if (st.startsWith("error")) { console.log(st); process.exit(1); }
const list = await pg.evaluate(() => window.SHOTLIST);
for (const s of list) {
  if (only && !only.split(",").includes(s.name)) continue;
  const dir = `${out}/${s.name}`; fs.mkdirSync(dir, { recursive: true });
  const f0 = Math.round(s.start * 30), f1 = Math.round(s.end * 30); const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const file = `${dir}/f_${String(f - f0).padStart(4, "0")}.jpg`; if (fs.existsSync(file)) continue;
    const url = await pg.evaluate(([n, t]) => window.grabShot(n, t, 0.93), [s.name, f / 30]);
    fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
  }
  console.log("DONE", s.name, f1 - f0, "frames", ((Date.now() - t0) / 1000).toFixed(0), "s");
}
await b.close();
