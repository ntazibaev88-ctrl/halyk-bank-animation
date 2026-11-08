// Graphics layer: titles, timeline, statistics, captions and subtitles.
// Everything is a pure function of film time t (deterministic for rendering).
import subs from '../data/subtitles.json';
import cues from '../data/cues.json';
import plates from '../data/plates.json';
import { STATS, HISTORY, LANDMARK_CAPTIONS, TEXT } from './content.js';

const $ = (sel) => document.querySelector(sel);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const fmt = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const gold = (s) => s.replace(/\*([^*]+)\*/g, '<span class="g">$1</span>');
const win = (t, a, b, fi = 0.4, fo = 0.4) => smooth(a, a + fi, t) * (1 - smooth(b - fo, b, t));

// ------------------------------------------------------------- build DOM
function el(tag, cls, html, parent) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  (parent || $('#ov')).appendChild(e);
  return e;
}

// subtitle cards: group chunks into readable two-line cards
const cards = [];
for (const seg of subs) {
  let cur = null;
  seg.chunks.forEach((c, i) => {
    const plain = c.text.replace(/\*/g, '');
    const len = cur ? cur.chunks.reduce((s, x) => s + x.text.replace(/\*/g, '').length + 1, 0) : 0;
    const prevEnds = cur && /[.!?]$/.test(cur.chunks[cur.chunks.length - 1].text.replace(/\*/g, ''));
    if (!cur || len + plain.length > 46 || prevEnds) { cur = { chunks: [] }; cards.push(cur); }
    cur.chunks.push(c);
  });
}
cards.forEach((cd, i) => {
  cd.t0 = cd.chunks[0].t0 - 0.08;
  const lastEnd = cd.chunks[cd.chunks.length - 1].t1;
  const next = cards[i + 1];
  cd.t1 = Math.min(next ? next.chunks[0].t0 - 0.12 : 1e9, lastEnd + 0.7);
});

export function build() {
  const ov = $('#ov');
  // plates
  for (const p of plates) {
    const v = document.getElementById('plate-' + p.id);
    p.el = v;
  }
  // readability gradients
  el('div', 'shade-bottom'); el('div', 'shade-top');

  // opening tagline
  const tag = el('div', 'tagline', `<div class="kicker"><i></i>${TEXT.kicker}<i></i></div><div class="tl">${TEXT.tagline}</div>`);
  // main title
  const title = el('div', 'title', `<div class="word">${[...'АСТАНА'].map((c) => `<span>${c}</span>`).join('')}</div><div class="sub"><i></i>${TEXT.heart}<i></i></div>`);

  // history timeline
  const hist = el('div', 'hist', `
    <div class="tagrec"><b></b>${TEXT.reconstruction}</div>
    <div class="yearbig"></div><div class="event"></div>
    <div class="rail">${HISTORY.map((h) => `<div class="node"><span class="dot"></span><span class="y">${h.year}</span></div>`).join('')}<div class="fill"></div></div>`);

  // time-lapse year ticker
  const tick = el('div', 'ticker', `<div class="lbl">${TEXT.timelapse}</div><div class="yr"></div><div class="bar"><div class="in"></div></div>`);

  // population
  const pop = el('div', 'stat pop', `
    <div class="chip"></div>
    <div class="num"></div>
    <div class="cap">${STATS.population.caption}</div>
    <div class="bars"><div class="b b1"><span>2017</span><div class="f"></div><em>≈1,0 млн</em></div><div class="b b2"><span>2026</span><div class="f"></div><em>1,54 млн</em></div></div>
    <div class="src">${STATS.population.source}</div>`);

  // economy cards
  const eco = el('div', 'eco', `
    <div class="card grp"><div class="yr">2025</div><div class="big"><span class="n"></span><span class="u">${STATS.grp.unit}</span></div><div class="lab">${STATS.grp.caption}</div><div class="note">${STATS.grp.note}</div></div>
    <div class="card bud"><div class="yr">2025</div><div class="big"><span class="n"></span><span class="u">${STATS.budget.unit}</span></div><div class="lab">${STATS.budget.caption}</div><div class="note">${STATS.budget.note}</div>
      <div class="cmp"><div class="row"><span>${TEXT.grpShort}</span><div class="f f1"></div></div><div class="row"><span>${TEXT.budShort}</span><div class="f f2"></div></div></div></div>
    <div class="src">${STATS.grp.source}</div>`);

  // landmark captions
  const lmc = el('div', 'lmcap', '<i></i><span></span>');

  // tourism
  const tour = el('div', 'stat tour', `
    <div class="head">${STATS.tourists.caption}</div>
    <div class="row r1"><div class="num"></div><div class="lab">${STATS.tourists.label}</div></div>
    <div class="row r2"><div class="num"></div><div class="lab">${STATS.foreign.label}</div></div>
    <div class="src">${STATS.tourists.source}</div>`);

  // future keywords
  const fut = el('div', 'future', TEXT.future.map((w) => `<span>${w}</span>`).join('<i>·</i>'));

  // finale
  const fin = el('div', 'finale', `<div class="word">${[...'АСТАНА'].map((c) => `<span>${c}</span>`).join('')}</div><div class="line">${TEXT.finale}</div>`);

  // subtitles
  const subBox = el('div', 'subs');
  cards.forEach((cd) => {
    cd.el = el('div', 'card', cd.chunks.map((c) => `<span class="ch">${gold(c.text)}</span>`).join(' '), subBox);
    cd.spans = [...cd.el.querySelectorAll('.ch')];
  });

  const fade = el('div', 'fadeblack');
  return { tag, title, hist, tick, pop, eco, lmc, tour, fut, fin, fade };
}

// ------------------------------------------------------------- update
const YEAR3 = (t) => 2000 + 25.5 * clamp((t - 30) / 14);

export function update(t, D) {
  // plate cross-dissolves (each plate has 0.5 s handles)
  const B = cues.scenes;
  plates.forEach((p, i) => {
    const fin = i === 0 ? 1 : smooth(B[i] - 0.35, B[i] + 0.35, t);
    const vis = t >= p.t0 - 0.01 && t <= p.t1 + 0.01;
    p.el.style.opacity = vis ? fin : 0;
  });

  // opening tagline
  const ta = win(t, 0.8, 4.9, 0.9, 0.8);
  D.tag.style.opacity = ta; D.tag.style.transform = `translateY(${(1 - ta) * 10}px)`;
  D.tag.style.letterSpacing = `${0.02 + 0.03 * smooth(0.8, 5, t)}em`;

  // main title (S1 -> into S2)
  const T1 = cues.title1;
  const tw = win(t, T1 - 0.15, 12.6, 0.2, 0.9);
  D.title.style.opacity = tw;
  [...D.title.querySelectorAll('.word span')].forEach((s, i) => {
    const k = easeOut(smooth(T1 - 0.1 + i * 0.06, T1 + 0.5 + i * 0.06, t));
    s.style.opacity = k; s.style.filter = `blur(${(1 - k) * 14}px)`; s.style.transform = `translateY(${(1 - k) * 30}px)`;
  });
  const ts = smooth(T1 + 0.45, T1 + 1.1, t);
  D.title.querySelector('.sub').style.opacity = ts;
  D.title.querySelector('.sub').style.letterSpacing = `${0.32 + 0.08 * ts}em`;
  D.title.style.transform = `scale(${1.04 - 0.04 * smooth(T1, 12.5, t)})`;

  // history
  const hv = win(t, 11.2, 30.0, 0.6, 0.6);
  D.hist.style.opacity = hv;
  let ai = -1;
  HISTORY.forEach((h, i) => { if (t >= cues.years[h.year] - 0.1) ai = i; });
  if (ai >= 0) {
    const h = HISTORY[ai];
    const k = smooth(cues.years[h.year] - 0.1, cues.years[h.year] + 0.35, t);
    const yb = D.hist.querySelector('.yearbig'), ev = D.hist.querySelector('.event');
    if (yb.dataset.y !== h.year) { yb.textContent = h.year; yb.dataset.y = h.year; ev.innerHTML = h.text; }
    yb.style.opacity = k; yb.style.transform = `translateY(${(1 - k) * 24}px)`; yb.style.filter = `blur(${(1 - k) * 8}px)`;
    ev.style.opacity = smooth(cues.years[h.year] + 0.1, cues.years[h.year] + 0.55, t);
  }
  D.hist.querySelectorAll('.node').forEach((n, i) => n.classList.toggle('on', i <= ai));
  const fillTo = ai < 0 ? 0 : ai / (HISTORY.length - 1);
  D.hist.querySelector('.fill').style.width = `${fillTo * 100}%`;
  D.hist.querySelector('.tagrec').style.opacity = 1 - smooth(25.5, 26.5, t);

  // time-lapse ticker
  const tv = win(t, 31.0, 46.6, 0.6, 0.5);
  D.tick.style.opacity = tv;
  const y3 = Math.floor(YEAR3(t));
  D.tick.querySelector('.yr').textContent = Math.min(2025, y3);
  D.tick.querySelector('.in').style.width = `${clamp((YEAR3(t) - 2000) / 25) * 100}%`;

  // population
  const pv = win(t, cues.pop2017 - 0.3, 61.4, 0.5, 0.6);
  D.pop.style.opacity = pv;
  let popN, chip;
  if (t < cues.popCount - 0.2) { popN = 1_000_000 * easeOut(smooth(cues.pop2017 - 0.2, cues.pop2017 + 1.2, t)); chip = STATS.population.chip2017; }
  else { popN = 1_000_000 + 538_200 * easeOut(smooth(cues.popCount, cues.popFinal, t)); chip = STATS.population.chip2026; }
  D.pop.querySelector('.num').innerHTML = (t >= cues.popFinal ? '<small>≈</small>' : '') + fmt(popN);
  const chipEl = D.pop.querySelector('.chip'); if (chipEl.dataset.c !== chip) { chipEl.textContent = chip; chipEl.dataset.c = chip; }
  D.pop.querySelector('.b1 .f').style.width = `${65 * smooth(cues.pop2017, cues.pop2017 + 1, t)}%`;
  D.pop.querySelector('.b2 .f').style.width = `${65 * 1.538 * easeOut(smooth(cues.popCount, cues.popFinal, t))}%`;
  D.pop.querySelector('.b2').style.opacity = smooth(cues.popCount - 0.3, cues.popCount + 0.2, t);
  D.pop.querySelector('.src').style.opacity = smooth(cues.popFinal - 0.2, cues.popFinal + 0.4, t);
  D.pop.style.transform = `translateY(${-30 * smooth(55.4, 56.4, t)}px) scale(${1 - 0.06 * smooth(55.4, 56.4, t)})`;

  // economy
  const ev2 = win(t, cues.grp - 0.4, 79.6, 0.5, 0.6);
  D.eco.style.opacity = ev2;
  const g1 = D.eco.querySelector('.grp'), g2 = D.eco.querySelector('.bud');
  const k1 = easeOut(smooth(cues.grp - 0.2, cues.grp + 0.5, t));
  g1.style.opacity = k1; g1.style.transform = `translateX(${(1 - k1) * -60}px)`;
  g1.querySelector('.n').textContent = (18.9 * easeOut(smooth(cues.grp, cues.grp + 1.6, t))).toFixed(1).replace('.', ',');
  const k2 = easeOut(smooth(cues.budget - 0.2, cues.budget + 0.5, t));
  g2.style.opacity = k2; g2.style.transform = `translateX(${(1 - k2) * 60}px)`;
  g2.querySelector('.n').textContent = (1.7 * easeOut(smooth(cues.budget, cues.budget + 1.4, t))).toFixed(1).replace('.', ',') + '+';
  g2.querySelector('.f1').style.width = `${100 * smooth(cues.budget + 0.8, cues.budget + 1.8, t)}%`;
  g2.querySelector('.f2').style.width = `${9 * smooth(cues.budget + 1.2, cues.budget + 2.2, t)}%`;
  D.eco.querySelector('.src').style.opacity = smooth(cues.budget + 1.5, cues.budget + 2.2, t);

  // landmark captions
  const cuts = cues.landmarkCuts;
  const caps = [[80.3, cuts[0], LANDMARK_CAPTIONS[0]], [cuts[0], cuts[1], LANDMARK_CAPTIONS[1]], [cuts[1], cuts[2], LANDMARK_CAPTIONS[2]], [cuts[2], cuts[3], LANDMARK_CAPTIONS[3]], [cuts[3], cuts[4], LANDMARK_CAPTIONS[4]], [cuts[4], cuts[5], LANDMARK_CAPTIONS[5]], [94.6, 99.4, LANDMARK_CAPTIONS[6]]];
  const cap = caps.find(([a, b]) => t >= a && t < b);
  if (cap) {
    const [a, b, txt] = cap;
    const k = win(t, a, b, 0.18, 0.12);
    const sp = D.lmc.querySelector('span'); if (sp.dataset.t !== txt) { sp.textContent = txt; sp.dataset.t = txt; }
    D.lmc.style.opacity = k; D.lmc.querySelector('i').style.width = `${70 * smooth(a, a + 0.35, t)}px`;
    sp.style.transform = `translateX(${(1 - smooth(a, a + 0.35, t)) * -20}px)`;
  } else D.lmc.style.opacity = 0;

  // tourism
  const tv2 = win(t, cues.tourists - 0.4, 99.5, 0.5, 0.6);
  D.tour.style.opacity = tv2;
  const r1 = D.tour.querySelector('.r1'), r2 = D.tour.querySelector('.r2');
  r1.querySelector('.num').textContent = fmt(STATS.tourists.value * easeOut(smooth(cues.tourists - 0.1, cues.tourists + 1.8, t)));
  r2.style.opacity = smooth(cues.foreign - 0.3, cues.foreign + 0.2, t);
  r2.querySelector('.num').textContent = fmt(STATS.foreign.value * easeOut(smooth(cues.foreign - 0.1, cues.foreign + 1.6, t)));
  D.tour.querySelector('.src').style.opacity = smooth(cues.foreign + 1, cues.foreign + 1.6, t);

  // future keywords (appear on the spoken words)
  const fw = subs.find((s) => s.id === 's7').chunks.flatMap((c) => c.words);
  const wt = ['білім', 'технология', 'бизнес', 'мүмкіндік'].map((w) => (fw.find((x) => x.w.toLowerCase().startsWith(w)) || { t0: 102 }).t0);
  D.fut.style.opacity = win(t, 100.9, 107.9, 0.3, 0.6);
  D.fut.querySelectorAll('span').forEach((s, i) => { const k = smooth(wt[i] - 0.1, wt[i] + 0.3, t); s.style.opacity = 0.15 + 0.85 * k; s.style.transform = `translateY(${(1 - k) * 14}px)`; });

  // finale
  const F = cues.title8;
  D.fin.style.opacity = smooth(F - 0.2, F + 0.2, t);
  [...D.fin.querySelectorAll('.word span')].forEach((s, i) => {
    const k = easeOut(smooth(F - 0.1 + i * 0.07, F + 0.6 + i * 0.07, t));
    s.style.opacity = k; s.style.filter = `blur(${(1 - k) * 16}px)`; s.style.transform = `translateY(${(1 - k) * 36}px)`;
  });
  const fl = smooth(cues.finalChord - 0.1, cues.finalChord + 0.7, t);
  const line = D.fin.querySelector('.line');
  line.style.opacity = fl; line.style.transform = `translateY(${(1 - fl) * 20}px)`; line.style.letterSpacing = `${0.06 + 0.04 * fl}em`;
  D.fin.style.transform = `scale(${1 + 0.03 * smooth(F, 120, t)})`;

  // subtitles
  for (const cd of cards) {
    const v = win(t, cd.t0, cd.t1, 0.14, 0.14);
    cd.el.style.opacity = v;
    cd.el.style.display = v > 0.001 ? 'block' : 'none';
    if (v > 0) {
      cd.el.style.transform = `translateY(${(1 - smooth(cd.t0, cd.t0 + 0.2, t)) * 10}px)`;
      cd.chunks.forEach((c, i) => { cd.spans[i].style.opacity = t >= c.t0 - 0.05 ? 1 : 0.5; });
    }
  }

  // end fade
  D.fade.style.opacity = smooth(119.35, 119.97, t) * 0.0 + 0;
}
