// Kinetic typography layer. Motion is on the GSAP master timeline; counters and
// subtitles are set from the seek time (deterministic) in update().
import { TEXT, HISTORY, STATS, LANDMARKS } from './content.js';
import { div, q, qa } from '../lib/core.js';
import { BUDGET_LAYOUT } from '../scenes/s6-budget.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const fmt = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const gold = (s) => s.replace(/\*([^*]+)\*/g, '<span class="g">$1</span>');
const letters = (w) => w.split(' ').map((word) => `<span class="w">${[...word].map((c) => `<span class="l">${c}</span>`).join('')}</span>`).join(' ');

function inOut(tl, el, a, b, from = { y: 30 }, fi = 0.5, fo = 0.45) {
  tl.set(el, { autoAlpha: 0 }, 0);
  tl.fromTo(el, { autoAlpha: 0, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: fi, ease: 'power3.out', immediateRender: false }, a);
  tl.to(el, { autoAlpha: 0, duration: fo, ease: 'power2.in' }, b - fo);
}

export function buildUI(ui, tl, C, subs) {
  const U = {};
  // opening kicker
  U.kicker = div(ui, 'kicker', `<i></i><span>${TEXT.kicker}</span><i></i>`);
  inOut(tl, U.kicker, 0.6, 5.2, { y: -14 });
  tl.fromTo(qa(U.kicker, 'i'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.out' }, 0.8);
  // main title
  U.title = div(ui, 'title', `<div class="word">${letters(TEXT.title)}</div><div class="sub"><i></i><span>${TEXT.subtitle}</span><i></i></div>`);
  tl.set(U.title, { autoAlpha: 0 }, 0);
  tl.set(U.title, { autoAlpha: 1 }, C.title1 - 0.3);
  qa(U.title, '.l').forEach((s, i) => tl.fromTo(s, { y: 90, opacity: 0, rotationX: -70, filter: 'blur(10px)' }, { y: 0, opacity: 1, rotationX: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, C.title1 - 0.25 + i * 0.07));
  tl.fromTo(q(U.title, '.sub'), { opacity: 0, y: 20, letterSpacing: '0.08em' }, { opacity: 1, y: 0, letterSpacing: '0.16em', duration: 0.9, ease: 'power2.out' }, C.title1 + 0.45);
  tl.to(U.title, { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in' }, 12.2);
  // history timeline
  U.hist = div(ui, 'hist', HISTORY.map((h) => `<div class="it"><b>${h.year}</b><span>${h.text}</span></div>`).join('') + '<div class="rail"><div class="fill"></div></div>');
  tl.set(U.hist, { autoAlpha: 0 }, 0);
  tl.to(U.hist, { autoAlpha: 1, duration: 0.4 }, 11.9);
  tl.to(U.hist, { autoAlpha: 0, duration: 0.5 }, 29.8);
  const items = qa(U.hist, '.it');
  HISTORY.forEach((h, i) => {
    const t = C.years[h.year] - 0.15;
    tl.fromTo(items[i], { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' }, t);
    tl.fromTo(items[i], { '--k': 0 }, { '--k': 1, duration: 0.4 }, t);
    if (i > 0) tl.to(items[i - 1], { opacity: 0.45, scale: 0.92, duration: 0.4 }, t);
  });
  tl.fromTo(q(U.hist, '.fill'), { scaleX: 0 }, { scaleX: 1, duration: C.years['1998'] - C.years['1830'] + 0.5, ease: 'none', transformOrigin: '0 50%' }, C.years['1830']);
  // new capital / growth
  U.growth = div(ui, 'growth', `<div class="t1">${letters(TEXT.newCapital)}</div><div class="t2">${TEXT.fastGrowth}</div>`);
  tl.set(U.growth, { autoAlpha: 0 }, 0); tl.set(U.growth, { autoAlpha: 1 }, C.newCapital - 0.2); tl.to(U.growth, { autoAlpha: 0, duration: 0.5 }, 38.2);
  qa(U.growth, '.l').forEach((s, i) => tl.fromTo(s, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, C.newCapital - 0.1 + i * 0.05));
  tl.fromTo(q(U.growth, '.t2'), { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, C.fastGrowth - 0.1);
  // population counter
  U.pop = div(ui, 'stat pop', `<div class="chip"></div><div class="num">0</div><div class="unit">${STATS.pop.unit}</div><div class="date">${STATS.pop.date}</div><div class="src">${STATS.pop.src}</div>`);
  inOut(tl, U.pop, C.pop2017 - 0.3, 60.1, { y: 40, scale: 0.92 });
  tl.fromTo(q(U.pop, '.date'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, C.popFinal - 0.25);
  tl.fromTo(q(U.pop, '.src'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, C.popFinal - 0.6);
  // economy chips
  const ws = subs.find((s) => s.id === 's5').chunks.flatMap((c) => c.words);
  const wt = ['сауда', 'құрылыс', 'қызмет', 'көлік', 'кәсіпкерлік'].map((w) => (ws.find((x) => x.w.toLowerCase().startsWith(w)) || { t0: 66 }).t0);
  U.chips = div(ui, 'chips', TEXT.chips.map((c) => `<span>${c}</span>`).join(''));
  tl.set(U.chips, { autoAlpha: 0 }, 0); tl.set(U.chips, { autoAlpha: 1 }, wt[0] - 0.3); tl.to(U.chips, { autoAlpha: 0, duration: 0.5 }, C.grp - 0.6);
  qa(U.chips, 'span').forEach((s, i) => tl.fromTo(s, { opacity: 0, y: 30, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(2)' }, wt[i] - 0.1));
  // GRP
  U.grp = div(ui, 'stat grp', `<div class="big">0</div><div class="unit">${STATS.grp.unit}</div><div class="lab">${STATS.grp.label}</div><div class="src">${STATS.grp.src}</div>`);
  inOut(tl, U.grp, C.grp - 0.3, 77.2, { scale: 0.6, y: 40 }, 0.8);
  tl.fromTo(q(U.grp, '.src'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, C.grp + 1.6);
  // budget
  const { cx, cy } = BUDGET_LAYOUT;
  U.bud = div(ui, 'stat bud', `<div class="big">${STATS.budget.value}</div><div class="unit">${STATS.budget.unit}</div><div class="lab">${STATS.budget.label}</div>`);
  inOut(tl, U.bud, C.budget - 0.2, C.budgetFlow - 0.1, { y: 30 });
  U.budSmall = div(ui, 'budsmall', `<b>${STATS.budget.value} ${STATS.budget.unit}</b><span>${STATS.budget.label}</span>`);
  inOut(tl, U.budSmall, C.budgetFlow - 0.2, 92.3, { y: -20 });
  U.budNote = div(ui, 'note', STATS.budget.note);
  inOut(tl, U.budNote, C.budgetFlow + 3.6, 92.3, { y: 10 });
  // landmark captions
  const T = C.tourCuts, caps = [[91.8, T[0]], [T[0], T[1]], [T[1], T[2]], [T[2], T[3]], [T[3], T[4]]];
  caps.forEach(([a, b], i) => {
    const c = div(ui, 'lmcap', `<i></i><span>${LANDMARKS[i]}</span>`);
    inOut(tl, c, a + 0.05, b + 0.05, { x: -40 }, 0.25, 0.15);
    tl.fromTo(q(c, 'i'), { scaleX: 0 }, { scaleX: 1, duration: 0.3, transformOrigin: '0 50%' }, a + 0.05);
  });
  // tourism counters
  U.tour = div(ui, 'stat tour', `<div class="yr">${STATS.tourists.year}</div><div class="num n1">0</div><div class="unit">${STATS.tourists.unit}</div><div class="row2"><span class="n2">0</span><em>${STATS.foreign.label}</em></div><div class="src">${STATS.tourists.src}</div>`);
  inOut(tl, U.tour, C.tourists - 0.3, 107.3, { y: 40, scale: 0.7 }, 0.8);
  tl.fromTo(q(U.tour, '.row2'), { opacity: 0, y: 30, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, C.foreign - 0.2);
  tl.fromTo(q(U.tour, '.src'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, C.foreign + 1.2);
  // finale
  U.fin = div(ui, 'finale', `<div class="l1">${letters(TEXT.final1)}</div><div class="l2">${TEXT.final2}</div>`);
  tl.set(U.fin, { autoAlpha: 0 }, 0); tl.set(U.fin, { autoAlpha: 1 }, C.title8 - 0.2);
  qa(U.fin, '.l1 .l').forEach((s, i) => tl.fromTo(s, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }, C.title8 - 0.1 + i * 0.03));
  tl.fromTo(q(U.fin, '.l2'), { opacity: 0, y: 30, letterSpacing: '0.04em' }, { opacity: 1, y: 0, letterSpacing: '0.1em', duration: 1.1, ease: 'power2.out' }, C.finalChord);

  // subtitles: grouped into ≤2-line cards
  const cards = [];
  for (const seg of subs) {
    let cur = null;
    seg.chunks.forEach((c) => {
      const plain = c.text.replace(/\*/g, '');
      const len = cur ? cur.chunks.reduce((s, x) => s + x.text.replace(/\*/g, '').length + 1, 0) : 0;
      const prevEnds = cur && /[.!?]$/.test(cur.chunks[cur.chunks.length - 1].text.replace(/\*/g, ''));
      if (!cur || len + plain.length > 38 || prevEnds) { cur = { chunks: [] }; cards.push(cur); }
      cur.chunks.push(c);
    });
  }
  const box = div(ui, 'subs');
  cards.forEach((cd, i) => {
    cd.t0 = cd.chunks[0].t0 - 0.08;
    const next = cards[i + 1];
    cd.t1 = Math.min(next ? next.chunks[0].t0 - 0.1 : 1e9, cd.chunks[cd.chunks.length - 1].t1 + 0.7);
    cd.el = div(box, 'card', cd.chunks.map((c) => `<span class="ch">${gold(c.text)}</span>`).join(' '));
    cd.spans = qa(cd.el, '.ch');
  });
  U.cards = cards;
  return U;
}

// counters + subtitles from the seek time
export function updateUI(U, t, C) {
  let n = 0, chip = '';
  if (t < C.popCount) { n = 1_000_000 * easeOut(smooth(C.pop2017 - 0.2, C.pop2017 + 1.3, t)); chip = STATS.pop.chip2017; }
  else { const k = easeOut(smooth(C.popCount + 0.2, C.popFinal - 0.3, t)); n = 1_000_000 + 700_385 * k; chip = k < 1 ? '2017 → 2026' : '2026'; }
  q(U.pop, '.num').textContent = fmt(n);
  const ch = q(U.pop, '.chip'); if (ch.textContent !== chip) ch.textContent = chip;
  q(U.grp, '.big').textContent = STATS.grp.value;
  q(U.tour, '.n1').textContent = fmt(STATS.tourists.value);
  q(U.tour, '.n2').textContent = fmt(STATS.foreign.value);
  for (const cd of U.cards) {
    const v = smooth(cd.t0, cd.t0 + 0.14, t) * (1 - smooth(cd.t1 - 0.14, cd.t1, t));
    cd.el.style.opacity = v; cd.el.style.display = v > 0.001 ? 'block' : 'none';
    if (v > 0) { cd.el.style.transform = `translateY(${(1 - smooth(cd.t0, cd.t0 + 0.2, t)) * 10}px)`; cd.chunks.forEach((c, i) => { cd.spans[i].style.opacity = t >= c.t0 - 0.05 ? 1 : 0.5; }); }
  }
}
