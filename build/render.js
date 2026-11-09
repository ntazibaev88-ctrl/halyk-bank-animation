// Render the animation frame-by-frame with headless Chromium and encode with ffmpeg.
// usage: node build/render.js [workers=4] [fps=30]
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const WORKERS = parseInt(process.argv[2] || '4', 10);
const FPS = parseInt(process.argv[3] || '30', 10);
const DURATION = 130;
const TOTAL = DURATION * FPS;
const TMP = path.join(ROOT, 'build', 'out', 'segments');
fs.mkdirSync(TMP, { recursive: true });

async function renderRange(browser, idx, f0, f1) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error(`[w${idx}] page error:`, e.message));
  await page.goto('file://' + path.join(ROOT, 'animation', 'index.html') + '?render');
  await page.evaluate(() => window.ready);
  const out = path.join(TMP, `seg${idx}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', out]);
  for (let f = f0; f < f1; f++) {
    const b64 = await page.evaluate(([t, f]) => {
      window.renderFrame(t, f);
      return document.getElementById('c').toDataURL('image/jpeg', 0.95).split(',')[1];
    }, [f / FPS, f]);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`[w${idx}] frame ${f}/${f1}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await page.close();
  return out;
}

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const per = Math.ceil(TOTAL / WORKERS);
  const segs = await Promise.all(Array.from({ length: WORKERS }, (_, i) => renderRange(browser, i, i * per, Math.min(TOTAL, (i + 1) * per))));
  await browser.close();
  const list = path.join(TMP, 'list.txt');
  fs.writeFileSync(list, segs.map(s => `file '${s}'`).join('\n'));
  const outDir = path.join(ROOT, 'output');
  fs.mkdirSync(outDir, { recursive: true });
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-i', path.join(ROOT, 'build', 'out', 'documentary_audio.wav'),
    '-map', '0:v', '-map', '1:a',
    // light temporal denoise: keeps the film grain subtle and the file ~50 MB
    '-vf', 'hqdn3d=3:2:10:8', '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', path.join(outDir, 'kazakhstan_documentary.mp4')], { stdio: 'inherit' });
  console.log('done: output/kazakhstan_documentary.mp4');
})();
