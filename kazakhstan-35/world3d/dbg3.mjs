import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import fs from "fs";
const t = +process.argv[2];
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(`http://localhost:8765/kazakhstan-35/world3d/index.html?scale=0.25`);
await pg.waitForFunction(() => window.ready, null, { timeout: 300000 });
const variants = ["none", "nopost", "nowater", "nolights"];
for (const v of variants) {
  const url = await pg.evaluate(([t, v]) => { window.renderAt(t); const cur = window.__cur; const s = cur.scene;
    if (v === "nofog") s.fog = null;
    if (v === "nowater") s.traverse((o) => { if (o.isMesh && o.material.type === "ShaderMaterial" && o.material.uniforms.textureMatrix) o.visible = false; });
    if (v === "nopost") Object.assign(cur.look, { bloom: 0, halation: 0, dof: 0, rays: 0, flare: 0 });
    if (v === "nolights") s.traverse((o) => { if (o.isLight) o.visible = false; });
    window.renderAt(t); return document.getElementById("c").toDataURL("image/jpeg", 0.8); }, [t, v]);
  fs.writeFileSync(`/tmp/claude-0/dbg_${v}.jpg`, Buffer.from(url.split(",")[1], "base64"));
}
await b.close();
