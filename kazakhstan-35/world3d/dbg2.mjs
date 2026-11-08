import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const t = +process.argv[2];
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", (e) => console.log("pageerror:", e.message)); pg.on("console", (m) => { if (m.type() === "error") console.log("err", m.text().slice(0, 300)); });
await pg.goto(`http://localhost:8765/kazakhstan-35/world3d/index.html?scale=0.25`);
await pg.waitForFunction(() => window.ready || (window.__status || "").startsWith("error"), null, { timeout: 300000 });
console.log(await pg.evaluate((t) => { window.renderAt(t); const s = window.__cur.scene, c = window.__cur.camera; const out = []; s.traverse((o) => { if (o.isMesh) { o.geometry.computeBoundingSphere(); const bs = o.geometry.boundingSphere; if (bs.radius > 20) { const p = bs.center.clone().applyMatrix4(o.matrixWorld); out.push([o.geometry.type, o.material.type, p.toArray().map((v) => Math.round(v)), Math.round(bs.radius), o.visible, o.material.opacity]); } } }); return JSON.stringify({ cam: c.position.toArray().map(Math.round), fog: s.fog && [s.fog.color.getHexString(), s.fog.density], out: out.slice(0, 20) }); }, t));
await b.close();
