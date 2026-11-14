import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import tl from '../data/timeline.json';
import {C, FPS, SANS} from '../theme';

type Word = {w: string; start: number; end: number};
type Card = {lines: Word[][]; start: number; end: number};

// stems of words emphasised in gold / blue
const GOLD = ['қазақстан', 'тәуелсіз', 'тәуелсіздіг', '1991', 'желтоқсан', 'астана', 'халқы', 'болашағ', 'бірлік', 'үміт', 'ұлы', 'азаттық', 'мәңгі', 'отаным', 'келер', 'ұрпақ', 'жасасын', 'аманат', 'тарих'];
const BLUE = ['отыз', 'бес', 'жыл', 'валюта', 'ақмола', 'технология', 'спортшы', 'өнерпаз', 'мемлекет'];
const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const colorFor = (w: string) => {
  const n = norm(w);
  if (GOLD.some((g) => n.startsWith(g))) return C.goldBright;
  if (BLUE.some((g) => n.startsWith(g))) return '#7fe3f0';
  return null;
};

const MAX_LINE = 26;
const MAX_CARD = 46;

function buildCards(): Card[] {
  const cards: Card[] = [];
  for (const s of (tl as any).sentences) {
    // display words: use the written sentence text (digits etc.), timed by TTS word boundaries
    const display: string[] = (s.text as string).split(/\s+/).filter((x: string) => x !== '—' && x.length);
    const spoken: Word[] = s.words;
    // align display words to spoken timings proportionally (they differ only for numbers)
    const words: Word[] = display.map((dw, i) => {
      if (display.length === spoken.length) return {w: dw, start: spoken[i].start, end: spoken[i].end};
      const a = Math.floor((i / display.length) * spoken.length);
      const b = Math.max(a, Math.ceil(((i + 1) / display.length) * spoken.length) - 1);
      return {w: dw, start: spoken[a].start, end: spoken[b].end};
    });
    // re-insert em dashes as part of previous word
    const raw = (s.text as string).split(/\s+/);
    let wi = 0;
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === '—' && wi > 0) words[wi - 1] = {...words[wi - 1], w: words[wi - 1].w + ' —'};
      else wi++;
    }
    // chunk into cards
    let cur: Word[] = [];
    const flush = () => { if (cur.length) { cards.push(layout(cur)); cur = []; } };
    for (const w of words) {
      const len = cur.map((x) => x.w).join(' ').length;
      if (cur.length && len + w.w.length + 1 > MAX_CARD) flush();
      cur.push(w);
      if (/[,;]$/.test(w.w) && cur.map((x) => x.w).join(' ').length > 30) flush();
    }
    flush();
  }
  // timing: hold each card until shortly before the next one
  for (let i = 0; i < cards.length; i++) {
    const next = cards[i + 1];
    const hold = cards[i].end + 0.5;
    cards[i].end = next ? Math.min(hold, next.start - 0.05) : hold;
    cards[i].start -= 0.12;
  }
  return cards;
}

function layout(ws: Word[]): Card {
  const total = ws.map((x) => x.w).join(' ').length;
  let lines: Word[][] = [ws];
  if (total > MAX_LINE) {
    // best balanced split
    let best = 1; let bestDiff = 1e9;
    for (let k = 1; k < ws.length; k++) {
      const a = ws.slice(0, k).map((x) => x.w).join(' ').length;
      const b = ws.slice(k).map((x) => x.w).join(' ').length;
      const diff = Math.abs(a - b) + (a > MAX_LINE + 6 || b > MAX_LINE + 6 ? 50 : 0);
      if (diff < bestDiff) { bestDiff = diff; best = k; }
    }
    lines = [ws.slice(0, best), ws.slice(best)];
  }
  return {lines, start: ws[0].start, end: ws[ws.length - 1].end};
}

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cards = useMemo(buildCards, []);
  const card = cards.find((c) => t >= c.start && t < c.end);
  if (!card) return null;
  const local = t - card.start;
  const inP = interpolate(local, [0, 0.2], [0, 1], {extrapolateRight: 'clamp'});
  const outP = interpolate(t, [card.end - 0.15, card.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 80, right: 150, bottom: 470, display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity: Math.min(inP, outP), transform: `translateY(${(1 - inP) * 14}px)`}}>
      {card.lines.map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', columnGap: 15, marginTop: li ? 6 : 0}}>
          {line.map((w, i) => {
            const active = t >= w.start - 0.03;
            const col = colorFor(w.w);
            return (
              <span key={i} style={{
                fontFamily: SANS, fontWeight: 800, fontSize: 54, lineHeight: 1.18, whiteSpace: 'nowrap',
                color: col ?? C.white, opacity: active ? 1 : 0.62,
                textShadow: '0 3px 3px rgba(0,0,0,0.55), 0 0 22px rgba(0,0,0,0.65), 0 0 2px rgba(0,0,0,0.9)',
                transform: `scale(${active ? 1 : 0.985})`, display: 'inline-block',
              }}>{w.w}</span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
