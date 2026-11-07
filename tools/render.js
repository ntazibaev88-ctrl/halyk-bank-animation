// Frame-accurate render: headless Chromium seeks the timeline frame by frame, frames are piped into ffmpeg.
// usage: node tools/render.js [--fps 30] [--workers 3] [--from 0] [--to DURATION] [--out build/video.mp4]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1]]]) : a), []));
const FPS = +(args.fps || 30), WORKERS = +(args.workers || 3);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(ROOT, args.out || 'build/video_noaudio.mp4');

async function renderPart(k, f0, f1, file) {
  const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--force-device-scale-factor=1'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(ROOT, 'src/index.html'));
  await page.evaluate(() => window.READY);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.seek(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`[w${k}] ${f - f0}/${f1 - f0} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  if (errs.length) console.log(`[w${k}] page errors:`, errs.slice(0, 5));
}

(async () => {
  const dur = await (async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://' + path.join(ROOT, 'src/index.html')); const d = await p.evaluate(() => window.DURATION); await b.close(); return d; })();
  const from = Math.round((+(args.from || 0)) * FPS), to = Math.round((+(args.to || dur)) * FPS);
  const total = to - from, per = Math.ceil(total / WORKERS);
  const tmp = path.join(ROOT, 'build', 'parts'); fs.mkdirSync(tmp, { recursive: true });
  const parts = [];
  const t0 = Date.now();
  await Promise.all([...Array(WORKERS)].map((_, k) => {
    const a = from + k * per, b = Math.min(to, a + per);
    const file = path.join(tmp, `part${k}.mp4`); parts.push(file);
    return a < b ? renderPart(k, a, b, file) : Promise.resolve();
  }));
  fs.writeFileSync(path.join(tmp, 'list.txt'), parts.filter(f => fs.existsSync(f)).map(f => `file '${f}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', OUT], { stdio: 'inherit' }).on('close', r));
  console.log(`done ${total} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${OUT}`);
})();
