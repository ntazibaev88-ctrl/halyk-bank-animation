// Graphics layer for «Даладан — елордаға дейін»: titles, timeline, counters,
// budget-flow infographic, captions and subtitles. Pure function of film time.
import subs from '../data/subtitles.json';
import cues from '../data/cues.json';
import plates from '../data/plates.json';
import { TEXT, HISTORY, STATS, LANDMARKS, ICONS } from './content.js';

const $ = (sel) => document.querySelector(sel);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const fmt = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const gold = (s) => s.replace(/\*([^*]+)\*/g, '<span class="g">$1</span>');
const win = (t, a, b, fi = 0.4, fo = 0.4) => smooth(a, a + fi, t) * (1 - smooth(b - fo, b, t));
const letters = (w) => [...w].map((c) => (c === ' ' ? '<span class="sp"> </span>' : `<span>${c}</span>`)).join('');

function el(tag, cls, html, parent) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  (parent || $('#ov')).appendChild(e);
  return e;
}

// subtitle cards (max two lines)
const cards = [];
for (const seg of subs) {
  let cur = null;
  seg.chunks.forEach((c) => {
    const plain = c.text.replace(/\*/g, '');
    const len = cur ? cur.chunks.reduce((s, x) => s + x.text.replace(/\*/g, '').length + 1, 0) : 0;
    const prevEnds = cur && /[.!?]$/.test(cur.chunks[cur.chunks.length - 1].text.replace(/\*/g, ''));
    if (!cur || len + plain.length > 40 || prevEnds) { cur = { chunks: [] }; cards.push(cur); }
    cur.chunks.push(c);
  });
}
cards.forEach((cd, i) => {
  cd.t0 = cd.chunks[0].t0 - 0.08;
  const next = cards[i + 1];
  cd.t1 = Math.min(next ? next.chunks[0].t0 - 0.12 : 1e9, cd.chunks[cd.chunks.length - 1].t1 + 0.7);
});

export function build() {
  for (const p of plates) p.el = document.getElementById('plate-' + p.id);
  el('div', 'shade-bottom'); el('div', 'shade-top');
  const D = {};
  D.kicker = el('div', 'kicker', `<i></i>${TEXT.kicker}<i></i>`);
  D.title = el('div', 'title', `<div class="word">${letters(TEXT.title)}</div><div class="sub"><i></i>${TEXT.subtitle}<i></i></div>`);
  D.hist = el('div', 'hist', `<div class="tag"><b></b>${TEXT.reconstruction}</div>
    <div class="items">${HISTORY.map((h) => `<div class="it"><div class="y">${h.year}</div><div class="tx">${h.text}</div></div>`).join('')}</div>`);
  D.items = [...D.hist.querySelectorAll('.it')];
  D.growth = el('div', 'growth', `<div class="t1">${TEXT.newCapital}</div><div class="t2">${TEXT.fastGrowth}</div>`);
  D.pop = el('div', 'stat pop', `<div class="chip"></div><div class="num"></div><div class="unit">${STATS.population.unit}</div><div class="date">${STATS.population.date}</div><div class="src">${STATS.population.source}</div>`);
  D.chips = el('div', 'chips', TEXT.economyChips.map((c) => `<span>${c}</span>`).join(''));
  D.grp = el('div', 'stat grp', `<div class="big"><span class="n"></span></div><div class="unit">${STATS.grp.unit}</div><div class="lab">${STATS.grp.label}</div><div class="src">${STATS.grp.source}</div>`);
  // budget flow infographic
  const R = 300, cx = 540, cy = 860;
  const pos = STATS.budget.sectors.map((_, i) => { const a = -Math.PI / 2 + (i / 6) * Math.PI * 2 + Math.PI / 6; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R * 1.05]; });
  D.budget = el('div', 'budget', `
    <svg class="flow" viewBox="0 0 1080 1920" width="1080" height="1920">
      ${pos.map(([x, y], i) => `<path class="ln" d="M${cx} ${cy} Q ${(cx + x) / 2 + (i % 2 ? 40 : -40)} ${(cy + y) / 2} ${x} ${y}" />`).join('')}
      ${pos.map((_, i) => `<circle class="dot" r="7" />`).join('')}
    </svg>
    <div class="core"><div class="n">${STATS.budget.value}</div><div class="u">${STATS.budget.unit}</div></div>
    <div class="blab">${STATS.budget.label}</div>
    ${pos.map(([x, y], i) => `<div class="sec" style="left:${x - 85}px;top:${y - 70}px"><div class="ic"><svg viewBox="0 0 24 24">${ICONS[i]}</svg></div><div class="nm">${STATS.budget.sectors[i]}</div></div>`).join('')}
    <div class="note">${STATS.budget.note}</div>`);
  D.paths = [...D.budget.querySelectorAll('.ln')];
  D.dots = [...D.budget.querySelectorAll('.dot')];
  D.secs = [...D.budget.querySelectorAll('.sec')];
  D.lm = el('div', 'lmcap', '<i></i><span></span>');
  D.tour = el('div', 'stat tour', `<div class="yr">${STATS.tourists.year}</div><div class="num n1"></div><div class="unit">${STATS.tourists.unit}</div><div class="row2"><span class="n2"></span><em>— ${STATS.foreign.label}</em></div><div class="src">${STATS.tourists.source}</div>`);
  D.fin = el('div', 'finale', `<div class="l1">${TEXT.final1}</div><div class="l2">${TEXT.final2}</div>`);
  const sb = el('div', 'subs');
  cards.forEach((cd) => { cd.el = el('div', 'card', cd.chunks.map((c) => `<span class="ch">${gold(c.text)}</span>`).join(' '), sb); cd.spans = [...cd.el.querySelectorAll('.ch')]; });
  return D;
}

export function update(t, D) {
  const B = cues.scenes;
  plates.forEach((p, i) => {
    const fin = i === 0 ? 1 : smooth(B[i] - 0.35, B[i] + 0.35, t);
    p.el.style.opacity = t >= p.t0 - 0.01 && t <= p.t1 + 0.01 ? fin : 0;
  });

  // kicker
  const kv = win(t, 0.6, 4.6, 0.8, 0.8);
  D.kicker.style.opacity = kv; D.kicker.style.letterSpacing = `${0.42 + 0.1 * smooth(0.6, 4.6, t)}em`;

  // title
  const T1 = cues.title1;
  D.title.style.opacity = win(t, T1 - 0.2, 12.4, 0.2, 0.5);
  [...D.title.querySelectorAll('.word span')].forEach((s, i) => {
    const k = easeOut(smooth(T1 - 0.15 + i * 0.06, T1 + 0.45 + i * 0.06, t));
    s.style.opacity = k; s.style.transform = `translateY(${(1 - k) * 40}px) scale(${0.8 + 0.2 * k})`; s.style.filter = `blur(${(1 - k) * 12}px)`;
  });
  const ts = smooth(T1 + 0.4, T1 + 1.0, t);
  const sub = D.title.querySelector('.sub'); sub.style.opacity = ts; sub.style.transform = `translateY(${(1 - ts) * 14}px)`;

  // history timeline (stacked, newest highlighted)
  D.hist.style.opacity = win(t, 11.9, 30.1, 0.4, 0.6);
  let ai = -1; HISTORY.forEach((h, i) => { if (t >= cues.years[h.year] - 0.15) ai = i; });
  D.items.forEach((it, i) => {
    const k = easeOut(smooth(cues.years[HISTORY[i].year] - 0.15, cues.years[HISTORY[i].year] + 0.35, t));
    it.style.opacity = k * (i === ai ? 1 : 0.55);
    it.style.transform = `translateX(${(1 - k) * -40}px) scale(${i === ai ? 1 : 0.86})`;
    it.classList.toggle('on', i === ai);
  });

  // new capital / growth titles
  D.growth.style.opacity = win(t, cues.newCapital - 0.1, 37.5, 0.4, 0.6);
  const g1 = smooth(cues.newCapital - 0.1, cues.newCapital + 0.5, t), g2 = smooth(cues.fastGrowth - 0.1, cues.fastGrowth + 0.5, t);
  D.growth.querySelector('.t1').style.cssText = `opacity:${g1};transform:translateY(${(1 - g1) * 20}px);letter-spacing:${0.12 + 0.06 * g1}em`;
  D.growth.querySelector('.t2').style.cssText = `opacity:${g2};transform:translateY(${(1 - g2) * 20}px)`;

  // population
  D.pop.style.opacity = win(t, cues.pop2017 - 0.3, 60.0, 0.4, 0.6);
  let n, chip;
  if (t < cues.popCount - 0.1) { n = 1_000_000 * easeOut(smooth(cues.pop2017 - 0.2, cues.pop2017 + 1.3, t)); chip = STATS.population.chip2017; }
  else { n = 1_000_000 + 700_385 * easeOut(smooth(cues.popCount + 0.2, cues.popFinal - 0.3, t)); chip = '2026'; }
  D.pop.querySelector('.num').textContent = fmt(n);
  const ch = D.pop.querySelector('.chip'); if (ch.dataset.c !== chip) { ch.textContent = chip; ch.dataset.c = chip; }
  const dk = smooth(cues.popCount + 1.3, cues.popCount + 1.9, t);
  D.pop.querySelector('.date').style.opacity = dk; D.pop.querySelector('.unit').style.opacity = smooth(cues.pop2017, cues.pop2017 + 0.6, t);
  D.pop.querySelector('.src').style.opacity = smooth(cues.popFinal - 0.6, cues.popFinal, t);

  // economy chips appear on the spoken words
  const ws = subs.find((s) => s.id === 's5').chunks.flatMap((c) => c.words);
  const wt = ['сауда', 'құрылыс', 'қызмет', 'көлік', 'кәсіпкерлік'].map((w) => (ws.find((x) => x.w.toLowerCase().startsWith(w)) || { t0: 66 }).t0);
  D.chips.style.opacity = win(t, wt[0] - 0.3, 71.6, 0.3, 0.5);
  D.chips.querySelectorAll('span').forEach((s, i) => { const k = easeOut(smooth(wt[i] - 0.1, wt[i] + 0.35, t)); s.style.opacity = k; s.style.transform = `translateY(${(1 - k) * 18}px) scale(${0.9 + 0.1 * k})`; });

  // GRP
  D.grp.style.opacity = win(t, cues.grp - 0.3, 77.2, 0.4, 0.5);
  D.grp.querySelector('.n').textContent = (18.9 * easeOut(smooth(cues.grp, cues.grp + 1.5, t))).toFixed(1).replace('.', ',');
  D.grp.querySelector('.src').style.opacity = smooth(cues.grp + 1.6, cues.grp + 2.2, t);

  // budget infographic
  D.budget.style.opacity = win(t, cues.budget - 0.5, 92.2, 0.5, 0.6);
  const core = D.budget.querySelector('.core');
  const kc = easeOut(smooth(cues.budget - 0.3, cues.budget + 0.6, t));
  core.style.transform = `translate(-50%,-50%) scale(${0.6 + 0.4 * kc})`; core.style.opacity = kc;
  D.budget.querySelector('.blab').style.opacity = smooth(cues.budget + 0.4, cues.budget + 1.0, t);
  const F = cues.budgetFlow;
  D.paths.forEach((p, i) => {
    const s0 = F + 0.3 + i * 0.55;
    const k = smooth(s0, s0 + 0.6, t);
    p.style.strokeDasharray = '700'; p.style.strokeDashoffset = `${700 * (1 - k)}`;
    const L = p.getTotalLength();
    const u = ((t - s0) * 0.6) % 1;
    const pt = p.getPointAtLength(L * clamp(u));
    D.dots[i].setAttribute('cx', pt.x); D.dots[i].setAttribute('cy', pt.y);
    D.dots[i].style.opacity = k > 0.99 ? 0.9 : 0;
    const sk = easeOut(smooth(s0 + 0.35, s0 + 0.8, t));
    D.secs[i].style.opacity = sk; D.secs[i].style.transform = `scale(${0.7 + 0.3 * sk})`;
  });
  D.budget.querySelector('.note').style.opacity = smooth(F + 3.5, F + 4.1, t);

  // landmark captions
  const tc = cues.tourCuts;
  const caps = [[92.2, tc[0], 0], [tc[0], tc[1], 1], [tc[1], tc[2], 2], [tc[2], tc[3], 3], [tc[3], tc[4], 4]];
  const cap = caps.find(([a, b]) => t >= a && t < b);
  if (cap) {
    const [a, b, i] = cap;
    const sp = D.lm.querySelector('span'); if (sp.dataset.i !== String(i)) { sp.textContent = LANDMARKS[i]; sp.dataset.i = String(i); }
    D.lm.style.opacity = win(t, a, b, 0.15, 0.1);
    D.lm.querySelector('i').style.width = `${60 * smooth(a, a + 0.3, t)}px`;
  } else D.lm.style.opacity = 0;

  // tourism
  D.tour.style.opacity = win(t, cues.tourists - 0.3, 107.2, 0.4, 0.5);
  D.tour.querySelector('.n1').textContent = fmt(STATS.tourists.value * easeOut(smooth(cues.tourists - 0.1, cues.tourists + 1.8, t)));
  const r2 = D.tour.querySelector('.row2'); r2.style.opacity = smooth(cues.foreign - 0.2, cues.foreign + 0.3, t);
  D.tour.querySelector('.n2').textContent = fmt(STATS.foreign.value * easeOut(smooth(cues.foreign - 0.1, cues.foreign + 1.4, t)));
  D.tour.querySelector('.src').style.opacity = smooth(cues.foreign + 1, cues.foreign + 1.5, t);

  // finale
  const f1 = easeOut(smooth(cues.title8 - 0.1, cues.title8 + 0.8, t)), f2 = easeOut(smooth(cues.finalChord, cues.finalChord + 0.9, t));
  D.fin.style.opacity = Math.max(f1, 0);
  D.fin.querySelector('.l1').style.cssText = `opacity:${f1};transform:translateY(${(1 - f1) * 26}px);filter:blur(${(1 - f1) * 8}px)`;
  D.fin.querySelector('.l2').style.cssText = `opacity:${f2};transform:translateY(${(1 - f2) * 20}px);letter-spacing:${0.08 + 0.05 * f2}em`;

  // subtitles
  for (const cd of cards) {
    const v = win(t, cd.t0, cd.t1, 0.14, 0.14);
    cd.el.style.opacity = v; cd.el.style.display = v > 0.001 ? 'block' : 'none';
    if (v > 0) { cd.el.style.transform = `translateY(${(1 - smooth(cd.t0, cd.t0 + 0.2, t)) * 10}px)`; cd.chunks.forEach((c, i) => { cd.spans[i].style.opacity = t >= c.t0 - 0.05 ? 1 : 0.5; }); }
  }
}
