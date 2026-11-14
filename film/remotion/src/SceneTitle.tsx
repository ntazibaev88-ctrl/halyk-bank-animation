import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {GOLD, FONT, clamp} from './theme';

export const SceneTitle: React.FC<{lines: string[]; scene: number}> = ({lines, scene}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: D} = useVideoConfig();
  const out = interpolate(frame, [D - 16, D - 2], [1, 0], clamp);
  const big = scene === 1;
  return (
    <div style={{position: 'absolute', top: big ? 300 : 250, left: 70, right: 70, opacity: out, fontFamily: FONT, textAlign: 'left'}}>
      <div style={{width: interpolate(frame, [0, 22], [0, 120], {...clamp, easing: Easing.out(Easing.cubic)}), height: 4, background: GOLD, marginBottom: 26}} />
      {lines.map((l, i) => {
        const a = 6 + i * 7;
        const op = interpolate(frame, [a, a + 16], [0, 1], clamp);
        const y = interpolate(frame, [a, a + 22], [26, 0], {...clamp, easing: Easing.out(Easing.cubic)});
        const first = i === 0;
        const len = l.length;
        const size = first ? (big ? 150 : len > 12 ? 78 : 96) : (len > 22 ? 40 : len > 14 ? 52 : 60);
        return (
          <div key={i} style={{opacity: op, transform: `translateY(${y}px)`, fontSize: size, fontWeight: first ? 800 : 500, letterSpacing: first ? (big ? 2 : 3) : 5, color: first ? '#fff' : GOLD, lineHeight: 1.12, textShadow: '0 4px 28px rgba(0,0,0,0.75)'}}>
            {l}
          </div>
        );
      })}
    </div>
  );
};
