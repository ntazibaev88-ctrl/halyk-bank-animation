import React from 'react';
import {FONT_TITLE} from '../theme';
import {io, easeOut, pop, rand} from '../lib/anim';

/** Animated NOIRX logo reveal. lf = frames since reveal start. */
export const NoirxLogo: React.FC<{lf: number; cx?: number; cy?: number; scale?: number}> = ({lf, cx = 540, cy = 860, scale = 1}) => {
  if (lf < -2) return null;
  const ring = io(lf, [0, 22], [0, 1], easeOut);
  const letters = ['N', 'O', 'I', 'R'];
  const xBar = io(lf, [12, 24], [0, 1], easeOut);
  const sweep = io(lf, [22, 46], [-300, 330]);
  const glow = 0.6 + 0.4 * Math.sin(lf / 10);
  const lineW = io(lf, [24, 40], [0, 520], easeOut);
  const settle = pop(lf, 0, 11, 110);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale * (0.9 + 0.1 * settle)})`}>
      <defs>
        <linearGradient id="logo-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.85} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <clipPath id="logo-text-clip">
          <rect x={-420} y={-120} width={840} height={150} />
        </clipPath>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={18} />
        </filter>
      </defs>
      {/* shock ring + particles */}
      <circle r={80 + ring * 520} fill="none" stroke="#ffd400" strokeWidth={10 * (1 - ring)} opacity={1 - ring} />
      <circle r={40 + ring * 380} fill="none" stroke="#fff" strokeWidth={4 * (1 - ring)} opacity={(1 - ring) * 0.8} />
      {Array.from({length: 26}).map((_, i) => {
        const a = (i / 26) * Math.PI * 2 + rand(i) * 0.3;
        const d = ring * (220 + rand(i + 9) * 260);
        return <circle key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} r={4 + rand(i + 3) * 5} fill={i % 3 === 0 ? '#3d6fe0' : i % 3 === 1 ? '#de2910' : '#ffd400'} opacity={1 - ring} />;
      })}
      {/* back glow */}
      <ellipse rx={380} ry={110} cy={-40} fill="#ffd400" opacity={0.12 * glow * io(lf, [10, 30], [0, 1])} filter="url(#logo-glow)" />
      <g clipPath="url(#logo-text-clip)">
        {letters.map((ch, i) => {
          const p = pop(lf, 3 + i * 3, 13, 160);
          return (
            <text key={ch} x={[-315, -170, -22, 49][i]} y={10 + (1 - p) * 160} fontFamily={FONT_TITLE} fontSize={190} fill="#fff" textAnchor="start"
              style={{filter: 'drop-shadow(0 8px 0 rgba(0,0,0,0.35))'}}>
              {ch}
            </text>
          );
        })}
      </g>
      {/* X built from two crossing bars: blue and red */}
      <g transform="translate(262 -62)">
        <rect x={-95} y={-17} width={190 * xBar} height={34} rx={8} fill="#3d6fe0" transform="rotate(52)" />
        <rect x={-95} y={-17} width={190 * xBar} height={34} rx={8} fill="#de2910" transform="rotate(-52)" />
        <circle r={14 * xBar} fill="#ffd400" />
      </g>
      <rect x={sweep - 60} y={-130} width={120} height={160} fill="url(#logo-sweep)" opacity={lf > 22 && lf < 46 ? 0.45 : 0} transform="skewX(-18)" clipPath="url(#logo-text-clip)" />
      <rect x={-lineW / 2} y={62} width={lineW} height={6} rx={3} fill="#ffd400" />
    </g>
  );
};
