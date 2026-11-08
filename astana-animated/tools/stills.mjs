// Render stills of the 3D plates at given global times (for quick review).
// usage: node tools/stills.mjs outdir t1 t2 ... [--scale 0.5]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
const args = process.argv.slice(2);
const out = args.shift();
let scale = 0.5; const si = args.indexOf('--scale'); if (si >= 0) { scale = parseFloat(args[si + 1]); args.splice(si, 2); }
const times = args.map(Number);
fs.mkdirSync(out, { recursive: true });
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf', '.json': 'application/json' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 540, height: 960 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log('[page]', m.text().slice(0, 300)); });
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
const ov = process.env.OVERRIDE ? JSON.parse(process.env.OVERRIDE) : null;
await page.addInitScript((o) => { if (o) { window.__gradeOverride = o.grade; window.__expScale = o.exp; window.__debugCam = o.cam; } }, ov);
await page.goto(`http://localhost:${port}/plates/preview.html?scale=${scale}`);
for (const t of times) {
  const t0 = Date.now();
  await page.evaluate((t) => window.__renderAt(t), t);
  const data = await page.evaluate(() => document.getElementById('gl').toDataURL('image/png'));
  fs.writeFileSync(path.join(out, `t${t.toFixed(2).padStart(6, '0')}.png`), Buffer.from(data.split(',')[1], 'base64'));
  console.log('t=', t, 'ms', Date.now() - t0);
}
await browser.close(); srv.close();
