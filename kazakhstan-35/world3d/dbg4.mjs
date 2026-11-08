import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(`http://localhost:8765/kazakhstan-35/world3d/index.html?scale=0.25`);
await pg.waitForFunction(() => window.ready, null, { timeout: 300000 });
console.log(await pg.evaluate(() => { window.renderAt(46); const s = window.__cur.scene, c = window.__cur.camera; const out = []; s.children.forEach((o) => { const p = new window.__T.Vector3(); o.getWorldPosition(p); out.push([o.type, o.children.length, p.toArray().map(Math.round)]); }); return JSON.stringify({ cam: c.position.toArray().map(Math.round), out }); }));
await b.close();
