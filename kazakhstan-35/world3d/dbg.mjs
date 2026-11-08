import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", (e) => console.log("pageerror:", e.message));
await pg.goto(`http://localhost:8765/kazakhstan-35/world3d/index.html?scale=0.25`);
await pg.waitForFunction(() => window.ready || (window.__status || "").startsWith("error"), null, { timeout: 300000 });
console.log(await pg.evaluate(() => { window.renderAt(17.3); const s = window.__cur.scene; const out = []; s.traverse((o) => { if (o.isMesh && o.geometry.attributes.position.count > 500) { o.geometry.computeBoundingBox(); const bb = o.geometry.boundingBox; out.push([o.geometry.type, bb.min.toArray().map((v) => v.toFixed(2)), bb.max.toArray().map((v) => v.toFixed(2))]); } }); return JSON.stringify({ cam: window.__cur.camera.position.toArray(), out }); }));
await b.close();
