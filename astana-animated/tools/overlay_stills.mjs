// Screenshot the graphics layer at given times over a background still (layout check).
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const [out, bg, ...ts] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
fs.mkdirSync(out, { recursive: true });
const srv = http.createServer((q, r) => { let f = decodeURIComponent(q.url.split('?')[0]); f = f.startsWith('/__bg') ? bg : path.join(root, f); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': f.endsWith('.html') ? 'text/html' : f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); r.end(d); }); }).listen(0);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
await p.goto(`http://localhost:${srv.address().port}/index.html`);
await p.addStyleTag({ content: `#root{background:url(/__bg) center/cover !important} video{display:none}` });
await p.evaluate(() => document.fonts.ready);
for (const t of ts.map(Number)) {
  await p.evaluate((t) => window.__overlayAt(t), t);
  await p.screenshot({ path: path.join(out, `o${t.toFixed(2).padStart(6, '0')}.png`) });
}
await b.close(); srv.close();
