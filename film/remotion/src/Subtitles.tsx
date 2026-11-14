import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {GOLD, FONT, clamp} from './theme';

type Sub = {start: number; end: number; lines: {t: string; gold: boolean}[][]};
const FPS = 30;
export const Subtitles: React.FC<{subs: Sub[]}> = ({subs}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const s = subs.find((x) => t >= x.start && t < x.end);
  if (!s) return null;
  const fs = Math.round(s.start * FPS), fe = Math.round(s.end * FPS);
  const op = Math.min(interpolate(frame, [fs, fs + 5], [0, 1], clamp), interpolate(frame, [fe - 5, fe], [1, 0], clamp));
  const y = interpolate(frame, [fs, fs + 7], [10, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 80, right: 150, bottom: 430, opacity: op, transform: `translateY(${y}px)`, fontFamily: FONT, fontSize: 58, fontWeight: 700, lineHeight: 1.22, color: '#fff', textAlign: 'center', textShadow: '0 3px 14px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)'}}>
      {s.lines.map((ln, i) => (
        <div key={i}>
          {ln.map((w, j) => (
            <span key={j} style={{color: w.gold ? GOLD : '#fff'}}>{w.t}{j < ln.length - 1 ? ' ' : ''}</span>
          ))}
        </div>
      ))}
    </div>
  );
};
