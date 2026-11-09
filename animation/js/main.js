// Compositor: picks the chapter scene(s) for time t, cross-dissolves between
// chapters and draws the shared overlays (chapter cards, subtitles, grain).
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const buffer = document.createElement('canvas'); buffer.width = W; buffer.height = H;
const bctx = buffer.getContext('2d');
const grain = grainPatterns(ctx);
const TL = window.TIMELINE;
const SCENES = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8];
const XF = 0.6;                         // half-length of chapter cross-dissolve (s)
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const NO_SUB = new Set(['01_2', '08_3']);  // lines already shown as on-screen titles

function drawScene(c, i, t) {
  c.save();
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.filter = 'none';
  c.setTransform(1, 0, 0, 1, 0, 0);
  SCENES[i](c, t);
  c.restore();
}

function chapterCard(t) {
  for (const ch of TL.chapters) {
    if (ch.id === 1) continue;
    const a0 = ch.start + 0.5, a1 = ch.start + 4.6;
    if (t < a0 || t > a1) continue;
    const a = smooth(a0, a0 + 0.7, t) * (1 - smooth(a1 - 0.8, a1, t));
    const x = 110, y = 120;
    ctx.save(); ctx.globalAlpha = a;
    const bg = ctx.createLinearGradient(0, 0, 900, 0);
    bg.addColorStop(0, 'rgba(8,14,28,0.45)'); bg.addColorStop(1, 'rgba(8,14,28,0)');
    ctx.fillStyle = bg; ctx.fillRect(0, y - 70, 900, 170);
    ctx.fillStyle = rgba(P.goldL);
    ctx.font = '600 24px "Montserrat"'; ctx.letterSpacing = '8px';
    ctx.fillText(ROMAN[ch.id - 1], x, y - 12);
    ctx.fillStyle = rgba(P.cream);
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 16;
    ctx.font = '600 64px "Cormorant Garamond"'; ctx.letterSpacing = '2px';
    ctx.fillText(ch.title, x, y + 58);
    ctx.shadowBlur = 0;
    const lw = 380 * easeOut(inv(a0, a0 + 1.2, t));
    ctx.strokeStyle = rgba(P.gold, 0.9); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + 84); ctx.lineTo(x + lw, y + 84); ctx.stroke();
    ctx.fillStyle = rgba(P.gold); ctx.beginPath(); ctx.arc(x + lw + 8, y + 84, 3.5, 0, TAU); ctx.fill();
    ctx.restore();
  }
}

function wrapLines(text, maxW) {
  const words = text.split(' '), lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
  }
  if (cur) lines.push(cur);
  if (lines.length === 2 && lines[1].split(' ').length === 1) {           // avoid a lonely last word
    const a = lines[0].split(' '); lines[1] = a.pop() + ' ' + lines[1]; lines[0] = a.join(' ');
  }
  return lines;
}

function subtitles(t) {
  for (const ln of TL.lines) {
    if (NO_SUB.has(ln.key) || t < ln.start - 0.15 || t > ln.end + 0.5) continue;
    const a = smooth(ln.start - 0.15, ln.start + 0.2, t) * (1 - smooth(ln.end + 0.15, ln.end + 0.5, t));
    ctx.save();
    ctx.font = '500 40px "Montserrat"'; ctx.letterSpacing = '0.5px';
    const lines = wrapLines(ln.kk, 1480);
    const base = H - 78 - (lines.length - 1) * 54;
    const band = ctx.createLinearGradient(0, H - 260, 0, H);
    band.addColorStop(0, 'rgba(5,10,20,0)'); band.addColorStop(1, `rgba(5,10,20,${0.55 * a})`);
    ctx.fillStyle = band; ctx.fillRect(0, H - 260, W, 260);
    ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 2;
    ctx.fillStyle = rgba(P.cream);
    lines.forEach((s, i) => ctx.fillText(s, W / 2, base + i * 54));
    ctx.restore();
  }
}

function finish(t, frame) {
  // vignette
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(4,6,14,0.55)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  // film grain
  ctx.save();
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.07;
  ctx.fillStyle = grain[frame % 4];
  const ox = (hash(frame) * 256) | 0, oy = (hash(frame + 0.5) * 256) | 0;
  ctx.translate(-ox, -oy); ctx.fillRect(0, 0, W + 256, H + 256);
  ctx.restore();
  // fade from / to black
  const fb = Math.max(1 - smooth(0, 1.4, t), smooth(TL.duration - 1.1, TL.duration, t));
  if (fb > 0) { ctx.fillStyle = `rgba(0,0,0,${fb})`; ctx.fillRect(0, 0, W, H); }
}

window.renderFrame = function (t, frame = Math.round(t * 30)) {
  const chs = TL.chapters;
  let i = chs.findIndex(c => t < c.end);
  if (i < 0) i = chs.length - 1;
  drawScene(ctx, i, t);
  // cross-dissolve into the next chapter around the boundary
  const nxt = chs[i + 1];
  if (nxt && t > nxt.start - XF) {
    drawScene(bctx, i + 1, t);
    ctx.save(); ctx.globalAlpha = smooth(nxt.start - XF, nxt.start + XF, t); ctx.drawImage(buffer, 0, 0); ctx.restore();
  }
  const prv = chs[i - 1];
  if (prv && t < chs[i].start + XF) {
    // first half of the dissolve was drawn by the previous chapter's window
    drawScene(bctx, i - 1, t);
    ctx.save(); ctx.globalAlpha = 1 - smooth(chs[i].start - XF, chs[i].start + XF, t); ctx.drawImage(buffer, 0, 0); ctx.restore();
  }
  // warm light sweep across each transition
  for (const c of chs) {
    const k = 1 - Math.min(1, Math.abs(t - c.start) / 0.8);
    if (k > 0 && c.start > 0) glow(ctx, lerp(-200, W + 200, inv(c.start - 0.8, c.start + 0.8, t)), H * 0.45, 900, P.goldL, 0.22 * k);
  }
  chapterCard(t);
  subtitles(t);
  finish(t, frame);
};

window.ready = (async () => {
  const faces = [['Cormorant Garamond', 'CormorantGaramond-500.ttf', '500'], ['Cormorant Garamond', 'CormorantGaramond-600.ttf', '600'],
    ['Montserrat', 'Montserrat-300.ttf', '300'], ['Montserrat', 'Montserrat-500.ttf', '500'], ['Montserrat', 'Montserrat-600.ttf', '600']];
  for (const [fam, file, wt] of faces) {
    const f = new FontFace(fam, `url(fonts/${file})`, { weight: wt });
    document.fonts.add(await f.load());
  }
  return true;
})();

// Interactive preview when opened in a browser (render mode drives frames itself).
if (!/render/.test(location.search)) {
  const audio = document.getElementById('a');
  const bar = document.getElementById('bar');
  window.ready.then(() => {
    let t0 = performance.now(), offset = 0, playing = true;
    const tick = () => {
      const t = audio && !audio.paused ? audio.currentTime : playing ? offset + (performance.now() - t0) / 1000 : offset;
      window.renderFrame(t % TL.duration);
      if (bar) bar.value = (t % TL.duration) / TL.duration * 1000;
      requestAnimationFrame(tick);
    };
    tick();
    if (bar) bar.oninput = () => { offset = bar.value / 1000 * TL.duration; t0 = performance.now(); if (audio) audio.currentTime = offset; };
    document.body.onclick = e => { if (e.target === bar) return; if (audio) { audio.paused ? audio.play() : audio.pause(); } };
  });
}
