// Timeline driver: scenes, transitions, subtitles. window.seek(t) renders frame at time t.
const TL = window.TIMELINE;
const SCENES = window.SCENES;
const frame = document.getElementById('frame');
const sceneLayer = document.getElementById('scenes');
const TR = 0.42; // half-length of scene transition

function normWord(w) { return w.toLowerCase().replace(/[^\p{L}\p{N}-]/gu, '').replace(/^-+|-+$/g, ''); }
const HL = new Set(TL.highlight.map(normWord));

// ---------- scenes ----------
const live = TL.scenes.map((sc, i) => {
  const root = html(`<div class="scene" id="sc-${sc.id}"></div>`);
  sceneLayer.appendChild(root);
  const cues = {};
  sc.segments.forEach((s, j) => { if (s.cue && cues[s.cue] === undefined) cues[s.cue] = s.start - sc.start; });
  const info = {
    id: sc.id, index: i, dur: sc.end - sc.start, start: sc.start,
    segs: sc.segments.map(s => ({ ...s, s: s.start - sc.start, e: s.end - sc.start })),
    cue: name => (cues[name] !== undefined ? cues[name] : 1e9),
  };
  // time (scene-local) when a word starting with `prefix` is spoken inside the segment with cue `cue`
  info.word = (cue, prefix, fallback = 0) => {
    const seg = info.segs.find(s => s.cue === cue) || info.segs[cue] ;
    if (!seg) return 1e9;
    const w = seg.words.find(w => w.w.toLowerCase().startsWith(prefix.toLowerCase()));
    return w ? w.s - sc.start : seg.s + fallback;
  };
  const def = SCENES[sc.id];
  const ctx = def ? def.build(root, info) : {};
  return { sc, root, info, def, ctx, visible: true };
});

// ---------- transitions ----------
const trans = document.getElementById('trans');
trans.innerHTML = `
  <div class="bar b0"></div><div class="bar b1"></div><div class="bar b2"></div><div class="bar b3"></div>`;
const bars = [...trans.querySelectorAll('.bar')];
function renderTransition(t) {
  let best = null;
  for (let i = 1; i < TL.scenes.length; i++) {
    const B = TL.scenes[i].start;
    if (Math.abs(t - B) < TR + 0.15) best = { B, i };
  }
  if (!best) { trans.style.display = 'none'; return; }
  trans.style.display = '';
  const dir = best.i % 2 ? 1 : -1;
  trans.style.transform = `scaleX(${dir})`;
  const lags = [0.1, 0.065, 0.03, 0.0];
  bars.forEach((b, k) => {
    const u = clamp((t - (best.B - TR) + lags[k]) / (2 * TR));
    // ease through center: fast in, hold over center, fast out
    const v = u < 0.5 ? E.outCubic(u * 2) * 0.5 : 0.5 + E.inCubic((u - 0.5) * 2) * 0.5;
    const x = lerp(-2300, 2300, v);
    b.style.transform = `translateX(${x.toFixed(1)}px) skewX(-14deg)`;
  });
}

// ---------- subtitles ----------
const subsEl = document.getElementById('subs');
const MAXCH = 25;
const cues = [];
TL.scenes.forEach(sc => sc.segments.forEach(seg => {
  // split segment words into lines (<= MAXCH chars), then pair lines into cues (<= 2 lines)
  const lines = [];
  let cur = [], len = 0;
  seg.words.forEach(w => {
    const add = w.w.length + (cur.length ? 1 : 0);
    if (cur.length && len + add > MAXCH) { lines.push(cur); cur = []; len = 0; }
    cur.push(w); len += w.w.length + (cur.length > 1 ? 1 : 0);
  });
  if (cur.length) lines.push(cur);
  // avoid a lone dash at line start
  for (let i = 1; i < lines.length; i++) if (lines[i][0].w === '—') lines[i - 1].push(lines[i].shift());
  for (let i = 0; i < lines.length; i += 2) {
    const ls = lines.slice(i, i + 2).filter(l => l.length);
    if (lines.length - i === 3) { /* balance 3 lines as 2+1 → fine */ }
    const ws = ls.flat();
    cues.push({ lines: ls, s: ws[0].s - 0.08, e: ws[ws.length - 1].e + 0.25, scene: sc.id });
  }
}));
for (let i = 0; i < cues.length - 1; i++) {
  const gap = cues[i + 1].s - cues[i].e;
  if (gap < 0.6) cues[i].e = Math.max(cues[i].e, cues[i + 1].s - 0.02);
}
let curCue = -1, curSpans = [];
function renderSubs(t) {
  let idx = -1;
  for (let i = 0; i < cues.length; i++) if (t >= cues[i].s && t < cues[i].e) { idx = i; break; }
  if (idx !== curCue) {
    curCue = idx;
    curSpans = [];
    if (idx < 0) { subsEl.innerHTML = ''; }
    else {
      const c = cues[idx];
      subsEl.innerHTML = '<div class="subbox">' + c.lines.map(l => '<div class="subline">' + l.map(w => {
        const hl = HL.has(normWord(w.w)) ? ' hl' : '';
        return `<span class="w${hl}">${w.w}</span>`;
      }).join(' ') + '</div>').join('') + '</div>';
      curSpans = [...subsEl.querySelectorAll('.w')].map((el, k) => ({ el, w: c.lines.flat()[k] }));
    }
  }
  if (idx >= 0) {
    const c = cues[idx];
    const box = subsEl.firstChild;
    const k = ep(t, c.s, 0.28, E.outBack), ko = 1 - ep(t, c.e - 0.15, 0.15);
    box.style.transform = `translateY(${(1 - k) * 24}px) scale(${lerp(0.94, 1, k)})`;
    box.style.opacity = Math.min(ep(t, c.s, 0.18), ko);
    curSpans.forEach(({ el, w }) => {
      const on = t >= w.s - 0.03;
      el.classList.toggle('on', on);
      el.classList.toggle('now', on && t < w.e + 0.05);
    });
  }
}

// ---------- seek ----------
const progEl = document.getElementById('progress');
window.seek = function (t) {
  live.forEach((L, i) => {
    const vis = t >= L.sc.start - 1e-6 && (t < L.sc.end || i === live.length - 1);
    if (vis !== L.visible) { L.root.style.display = vis ? '' : 'none'; L.visible = vis; }
    if (vis && L.def) L.def.update(L.ctx, t - L.sc.start, L.info, t);
  });
  renderTransition(t);
  renderSubs(t);
  progEl.style.transform = `scaleX(${clamp(t / TL.duration).toFixed(4)})`;
};
window.DURATION = TL.duration;
const q = new URLSearchParams(location.search);
window.seek(parseFloat(q.get('t') || '0'));
window.READY = document.fonts.ready.then(() => true);
