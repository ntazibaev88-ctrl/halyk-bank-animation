import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, SANS, SERIF} from '../theme';
import {Ornament} from './Ornament';

export type TitleLine = {text: string; font?: 'serif' | 'sans'; size: number; weight?: number; tracking?: number; color?: string; italic?: boolean};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// "*word*" renders in gold
const Words: React.FC<{line: TitleLine; delay: number; frame: number}> = ({line, delay, frame}) => {
  const tokens = line.text.split(' ');
  let gold = false;
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: line.size * 0.28}}>
      {tokens.map((tok, i) => {
        let t = tok;
        let isGold = gold;
        if (t.startsWith('*')) { isGold = true; gold = true; t = t.slice(1); }
        if (t.endsWith('*')) { gold = false; t = t.slice(0, -1); }
        const d = delay + i * 4;
        const p = interpolate(frame, [d, d + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: line.size * 0.12, marginBottom: -line.size * 0.12}}>
            <span style={{
              display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`, opacity: p,
              color: isGold ? C.goldBright : line.color ?? C.white,
              fontFamily: line.font === 'sans' ? SANS : SERIF, fontSize: line.size, fontWeight: line.weight ?? (line.font === 'sans' ? 800 : 700),
              letterSpacing: line.tracking ?? 0, fontStyle: line.italic ? 'italic' : 'normal', lineHeight: 1.08,
              textShadow: '0 4px 28px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.5)',
            }}>{t}</span>
          </span>
        );
      })}
    </div>
  );
};

export const Title: React.FC<{lines: TitleLine[]; dur: number; top: number; ornament?: boolean; kicker?: string; exit?: boolean}> = ({lines, dur, top, ornament = true, kicker, exit = true}) => {
  const frame = useCurrentFrame();
  const out = exit ? interpolate(frame, [dur - 14, dur], [1, 0], clamp) : 1;
  const blur = exit ? interpolate(frame, [dur - 14, dur], [0, 10], clamp) : 0;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
      opacity: out, filter: `blur(${blur}px)`, transform: `translateY(${(1 - out) * -30}px)`}}>
      {kicker && (
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, letterSpacing: 10, color: C.goldBright,
          opacity: interpolate(frame, [0, 16], [0, 1], clamp), textShadow: '0 2px 12px rgba(0,0,0,0.7)'}}>{kicker}</div>
      )}
      {lines.map((l, i) => <Words key={i} line={l} delay={6 + i * 8} frame={frame} />)}
      {ornament && <div style={{marginTop: 10}}><Ornament t0={10} dur={34} width={560} /></div>}
    </div>
  );
};
