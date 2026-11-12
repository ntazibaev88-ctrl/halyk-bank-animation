import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import timeline from '../timeline.json';
import {C, F} from '../theme';

type Word = {w: string; hl: boolean; s: number; e: number};
type Chunk = {words: Word[]; start: number; end: number};

const MAX_CHARS = 30; // ~2 lines at 62px within 860px
const charsOf = (ws: Word[]) => ws.reduce((a, w) => a + w.w.length + 1, 0);

export const buildChunks = (): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const s of timeline.sentences) {
    let cur: Word[] = [];
    const words = s.words as Word[];
    words.forEach((w, i) => {
      const next = words[i + 1];
      cur.push(w);
      const len = charsOf(cur);
      const punct = /[,.:?!—]$/.test(w.w);
      const remaining = words.slice(i + 1);
      const remLen = charsOf(remaining);
      const wouldOverflow = next ? len + next.w.length + 1 > MAX_CHARS : false;
      // break at punctuation when the chunk is reasonably long, or when the next word would overflow.
      // avoid leaving a tiny orphan (< 9 chars) at the end of a sentence.
      if (!next || wouldOverflow || (punct && len >= 12 && remLen >= 9)) {
        if (next && remLen < 9 && len + remLen <= MAX_CHARS + 6) return; // absorb the orphan
        // never end a line on a short preposition/conjunction — carry it to the next chunk
        let carry: Word[] = [];
        if (next && cur.length > 2 && cur[cur.length - 1].w.length <= 2 && !punct) carry = [cur.pop() as Word];
        chunks.push({words: cur, start: cur[0].s, end: cur[cur.length - 1].e});
        cur = carry;
      }
    });
    if (cur.length) chunks.push({words: cur, start: cur[0].s, end: cur[cur.length - 1].e});
  }
  // display windows: from first word (slightly early) until next chunk or end + hold
  return chunks.map((c, i) => {
    const nxt = chunks[i + 1];
    const end = nxt ? Math.min(nxt.start - 0.04, c.end + 0.7) : c.end + 0.8;
    return {...c, start: c.start - 0.12, end};
  });
};

const CHUNKS = buildChunks();

export const Subtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunk = CHUNKS.find((c) => t >= c.start && t < c.end);
  if (!chunk) return null;
  const local = t - chunk.start;
  const inP = interpolate(local, [0, 0.18], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.6))});
  const outP = interpolate(t, [chunk.end - 0.1, chunk.end], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 130,
        top: 1235,
        height: 170,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontFamily: F.xbold,
          fontSize: 62,
          lineHeight: 1.14,
          letterSpacing: 0.2,
          opacity: inP * (1 - outP),
          transform: `translateY(${(1 - inP) * 18}px) scale(${0.94 + 0.06 * inP})`,
        }}
      >
        {chunk.words.map((w, i) => {
          const spoken = t >= w.s - 0.03;
          const wp = interpolate(t, [w.s - 0.03, w.s + 0.12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          const color = w.hl ? C.greenHi : C.white;
          return (
            <span
              key={i}
              style={{
                color,
                opacity: 0.42 + 0.58 * wp,
                display: 'inline-block',
                marginRight: '0.26em',
                transform: `translateY(${spoken ? 0 : 4}px)`,
                textShadow: w.hl
                  ? '0 0 22px rgba(118,185,0,0.55), 0 3px 0 rgba(0,0,0,0.65), 0 0 18px rgba(0,0,0,0.85)'
                  : '0 3px 0 rgba(0,0,0,0.65), 0 0 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)',
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
