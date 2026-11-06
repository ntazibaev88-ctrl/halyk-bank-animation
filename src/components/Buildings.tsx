import React from 'react';
import {rand} from '../lib/anim';

/** Window patterns shared by all buildings in a scene. Render once inside <defs>. */
export const WindowPatterns: React.FC<{lit?: string; dim?: string; prefix: string}> = ({lit = '#ffe7a8', dim = '#2b3a66', prefix}) => (
  <>
    <pattern id={`${prefix}-win`} width={18} height={24} patternUnits="userSpaceOnUse">
      <rect x={4} y={5} width={10} height={13} rx={1.5} fill={lit} opacity={0.85} />
    </pattern>
    <pattern id={`${prefix}-win-dim`} width={18} height={24} patternUnits="userSpaceOnUse">
      <rect x={4} y={5} width={10} height={13} rx={1.5} fill={dim} opacity={0.9} />
    </pattern>
    <pattern id={`${prefix}-strip`} width={10} height={16} patternUnits="userSpaceOnUse">
      <rect x={0} y={6} width={10} height={5} fill={lit} opacity={0.75} />
    </pattern>
    <pattern id={`${prefix}-grid`} width={14} height={14} patternUnits="userSpaceOnUse">
      <rect x={1.5} y={1.5} width={11} height={11} fill={lit} opacity={0.35} />
    </pattern>
  </>
);

export type TowerProps = {
  x: number; // left
  base: number; // ground y
  w: number;
  h: number;
  color: string;
  side?: string; // shaded side colour
  prefix: string;
  pattern?: 'win' | 'win-dim' | 'strip' | 'grid';
  roof?: 'flat' | 'antenna' | 'stepped' | 'spire' | 'slant' | 'dome';
  seed?: number;
  frame?: number;
  rise?: number; // 0..1 growth animation
  flicker?: boolean;
};

/** Generic stylised skyscraper with lit windows and a shaded side. */
export const Tower: React.FC<TowerProps> = ({x, base, w, h, color, side, prefix, pattern = 'win', roof = 'flat', seed = 1, frame = 0, rise = 1, flicker = true}) => {
  const hh = h * rise;
  const top = base - hh;
  const sideW = w * 0.22;
  const flick: React.ReactNode[] = [];
  if (flicker && rise > 0.95) {
    for (let k = 0; k < 4; k++) {
      const on = Math.sin(frame / (6 + rand(seed + k) * 9) + seed * 3 + k) > 0.2;
      const cx = x + 8 + Math.floor(rand(seed * 5 + k) * ((w - 20) / 18)) * 18 + 4;
      const cy = top + 30 + Math.floor(rand(seed * 9 + k) * ((hh - 60) / 24)) * 24 + 5;
      flick.push(<rect key={k} x={cx} y={cy} width={10} height={13} rx={1.5} fill={on ? '#fff6c9' : '#1c2748'} />);
    }
  }
  let roofEl: React.ReactNode = null;
  if (roof === 'antenna') roofEl = <g><rect x={x + w / 2 - 3} y={top - h * 0.18} width={6} height={h * 0.18} fill={side ?? color} /><circle cx={x + w / 2} cy={top - h * 0.18} r={5} fill="#ff4b4b" opacity={0.5 + 0.5 * Math.sin(frame / 5 + seed)} /></g>;
  if (roof === 'stepped') roofEl = <g fill={color}><rect x={x + w * 0.12} y={top - h * 0.06} width={w * 0.76} height={h * 0.06 + 1} /><rect x={x + w * 0.28} y={top - h * 0.11} width={w * 0.44} height={h * 0.05 + 1} /></g>;
  if (roof === 'spire') roofEl = <polygon points={`${x + w * 0.3},${top} ${x + w / 2},${top - h * 0.22} ${x + w * 0.7},${top}`} fill={color} />;
  if (roof === 'slant') roofEl = <polygon points={`${x},${top} ${x + w},${top - h * 0.1} ${x + w},${top}`} fill={color} />;
  if (roof === 'dome') roofEl = <path d={`M${x + w * 0.1},${top} a${w * 0.4},${w * 0.32} 0 0 1 ${w * 0.8},0z`} fill={color} />;
  return (
    <g>
      {roofEl}
      <rect x={x} y={top} width={w} height={hh} fill={color} />
      <rect x={x + w - sideW} y={top} width={sideW} height={hh} fill={side ?? '#000'} opacity={side ? 1 : 0.18} />
      <rect x={x + 4} y={top + 16} width={w - sideW - 6} height={Math.max(0, hh - 30)} fill={`url(#${prefix}-${pattern})`} />
      <rect x={x} y={top} width={w} height={6} fill="#fff" opacity={0.18} />
      {flick}
    </g>
  );
};

// ---------------------------------------------------------------- USA landmarks
export const EmpireState: React.FC<{x: number; base: number; s?: number; color?: string; prefix: string; frame: number}> = ({x, base, s = 1, color = '#c9b8a6', prefix, frame}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <rect x={-80} y={-420} width={160} height={420} fill={color} />
    <rect x={-60} y={-560} width={120} height={140} fill={color} />
    <rect x={-42} y={-640} width={84} height={80} fill={color} />
    <rect x={-28} y={-700} width={56} height={60} fill={color} />
    <rect x={-16} y={-760} width={32} height={60} fill={color} />
    <polygon points="-10,-760 0,-850 10,-760" fill={color} />
    <rect x={-2} y={-900} width={4} height={60} fill="#e8e1d6" />
    <circle cx={0} cy={-902} r={5} fill="#ff4b4b" opacity={0.5 + 0.5 * Math.sin(frame / 6)} />
    <rect x={-74} y={-410} width={110} height={400} fill={`url(#${prefix}-strip)`} />
    <rect x={-54} y={-550} width={80} height={120} fill={`url(#${prefix}-strip)`} />
    <rect x={30} y={-420} width={50} height={420} fill="#000" opacity={0.18} />
    <rect x={20} y={-560} width={40} height={140} fill="#000" opacity={0.18} />
    <rect x={14} y={-640} width={28} height={80} fill="#000" opacity={0.18} />
  </g>
);

export const Chrysler: React.FC<{x: number; base: number; s?: number; color?: string; prefix: string}> = ({x, base, s = 1, color = '#b9c3d6', prefix}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <rect x={-60} y={-500} width={120} height={500} fill={color} />
    <rect x={-44} y={-580} width={88} height={80} fill={color} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${-44 + i * 8},${-580 - i * 22} a${44 - i * 8},${50 - i * 6} 0 0 1 ${88 - i * 16},0`} fill={i % 2 ? '#e9eef7' : color} stroke="#7d8aa3" strokeWidth={2} />
    ))}
    {[0, 1, 2, 3].map((i) => (
      <polygon key={i} points={`${-24 + i * 6},${-600 - i * 22} ${-20 + i * 6},${-618 - i * 22} ${-16 + i * 6},${-600 - i * 22}`} fill="#3a4a6b" />
    ))}
    <polygon points="-6,-690 0,-820 6,-690" fill="#e9eef7" />
    <rect x={-54} y={-490} width={80} height={480} fill={`url(#${prefix}-win)`} />
    <rect x={30} y={-500} width={30} height={500} fill="#000" opacity={0.18} />
  </g>
);

export const OneWTC: React.FC<{x: number; base: number; s?: number; prefix: string; frame: number}> = ({x, base, s = 1, prefix, frame}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <defs>
      <linearGradient id={`${prefix}-wtc`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9fc3ef" />
        <stop offset="0.5" stopColor="#5f8fd0" />
        <stop offset="1" stopColor="#2f5aa0" />
      </linearGradient>
    </defs>
    <polygon points="-80,0 80,0 80,-140 44,-860 -44,-860 -80,-140" fill={`url(#${prefix}-wtc)`} />
    <polygon points="-80,-140 0,-860 -44,-860" fill="#cfe2fb" opacity={0.55} />
    <polygon points="80,-140 0,-860 44,-860" fill="#1b3f7a" opacity={0.45} />
    <rect x={-3} y={-1060} width={6} height={200} fill="#dfe8f5" />
    <circle cx={0} cy={-1062} r={6} fill="#ff4b4b" opacity={0.5 + 0.5 * Math.sin(frame / 5)} />
    <rect x={-70} y={-130} width={140} height={120} fill={`url(#${prefix}-grid)`} />
  </g>
);

export const Liberty: React.FC<{x: number; base: number; s?: number; frame: number}> = ({x, base, s = 1, frame}) => {
  const flame = 1 + 0.15 * Math.sin(frame / 3) + 0.08 * Math.sin(frame / 1.7);
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      {/* pedestal */}
      <polygon points="-70,0 70,0 56,-120 -56,-120" fill="#c9b79c" />
      <rect x={-46} y={-190} width={92} height={70} fill="#d8c7ab" />
      <rect x={-56} y={-200} width={112} height={14} fill="#bba78a" />
      {/* figure */}
      <g fill="#5fb3a0" stroke="#3f8a78" strokeWidth={2}>
        <path d="M-30,-200 L-22,-330 Q0,-350 22,-330 L30,-200 Z" />
        <path d="M-22,-320 L-46,-300 L-40,-280 L-18,-300 Z" />
        <path d="M12,-330 L22,-440 L36,-438 L30,-326 Z" />
        <circle cx={0} cy={-355} r={20} />
      </g>
      {[-60, -30, 0, 30, 60].map((a, i) => (
        <polygon key={i} points={`-4,-368 4,-368 0,-398`} fill="#5fb3a0" transform={`rotate(${a} 0 -360)`} />
      ))}
      <rect x={24} y={-470} width={14} height={32} fill="#5fb3a0" />
      <g transform={`translate(31 -476) scale(${flame})`}>
        <path d="M0,0 C-14,-10 -8,-34 0,-44 C8,-34 14,-10 0,0Z" fill="#ffb627" />
        <path d="M0,-4 C-7,-10 -4,-24 0,-30 C4,-24 7,-10 0,-4Z" fill="#fff1a8" />
      </g>
      <circle cx={31} cy={-490} r={36} fill="#ffd27a" opacity={0.25} />
    </g>
  );
};

export const Capitol: React.FC<{x: number; base: number; s?: number}> = ({x, base, s = 1}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <rect x={-260} y={-110} width={520} height={110} fill="#f3eee4" />
    <rect x={-260} y={-120} width={520} height={14} fill="#d9d1c2" />
    {Array.from({length: 22}).map((_, i) => (
      <rect key={i} x={-248 + i * 23.5} y={-104} width={9} height={96} fill="#d8cfbf" />
    ))}
    <polygon points="-70,-120 70,-120 0,-160" fill="#e9e3d8" />
    <rect x={-90} y={-200} width={180} height={80} fill="#f6f2ea" />
    {Array.from({length: 10}).map((_, i) => (
      <rect key={i} x={-84 + i * 17.5} y={-196} width={7} height={72} fill="#d8cfbf" />
    ))}
    <rect x={-100} y={-210} width={200} height={12} fill="#d9d1c2" />
    <path d="M-92,-210 C-92,-330 92,-330 92,-210 Z" fill="#fbf8f2" />
    {[-60, -30, 0, 30, 60].map((dx) => (
      <path key={dx} d={`M${dx},-212 Q${dx * 0.6},-300 0,-318`} stroke="#d8cfbf" strokeWidth={3} fill="none" />
    ))}
    <rect x={-20} y={-345} width={40} height={30} fill="#f3eee4" />
    <path d="M-22,-345 C-22,-372 22,-372 22,-345Z" fill="#fbf8f2" />
    <rect x={-4} y={-392} width={8} height={30} fill="#cfc6b6" />
    <path d="M-92,-210 C-92,-330 0,-330 0,-318 L0,-210Z" fill="#000" opacity={0.0} />
    <path d="M10,-318 C60,-312 92,-270 92,-210 L40,-210 C40,-260 30,-300 10,-318Z" fill="#000" opacity={0.08} />
  </g>
);

export const WashingtonMonument: React.FC<{x: number; base: number; s?: number}> = ({x, base, s = 1}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <polygon points="-24,0 24,0 16,-520 -16,-520" fill="#efe9de" />
    <polygon points="0,0 24,0 16,-520 0,-520" fill="#000" opacity={0.08} />
    <polygon points="-16,-520 16,-520 0,-560" fill="#e2dbcc" />
  </g>
);

// ---------------------------------------------------------------- China landmarks
export const ShanghaiTower: React.FC<{x: number; base: number; s?: number; frame: number; prefix: string}> = ({x, base, s = 1, frame, prefix}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <defs>
      <linearGradient id={`${prefix}-sht`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8fe3e0" />
        <stop offset="0.55" stopColor="#3aa6b9" />
        <stop offset="1" stopColor="#1d5f7a" />
      </linearGradient>
    </defs>
    <path d="M-95,0 C-95,-400 -70,-800 -40,-1080 L40,-1110 C62,-800 95,-420 95,0 Z" fill={`url(#${prefix}-sht)`} />
    <path d="M-40,-1080 C-10,-760 40,-420 95,-40" stroke="#d6fffb" strokeWidth={5} fill="none" opacity={0.6} />
    <rect x={-80} y={-1000} width={150} height={990} fill={`url(#${prefix}-strip)`} opacity={0.45} />
    {Array.from({length: 9}).map((_, i) => (
      <path key={i} d={`M${-92 + i * 6},${-110 * (i + 1)} L${92 - i * 6},${-110 * (i + 1) - 6}`} stroke="#c9fffa" strokeWidth={3} opacity={0.5} />
    ))}
    <circle cx={0} cy={-1112} r={7} fill="#ff4b4b" opacity={0.5 + 0.5 * Math.sin(frame / 5)} />
  </g>
);

export const SWFC: React.FC<{x: number; base: number; s?: number; prefix: string}> = ({x, base, s = 1, prefix}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    <path
      d="M-80,0 L80,0 L46,-940 L-46,-940 Z M-30,-900 L30,-900 L36,-830 L-36,-830 Z"
      fillRule="evenodd"
      fill="#6d86b8"
    />
    <path d="M0,0 L80,0 L46,-940 L0,-940 Z M0,-900 L30,-900 L36,-830 L0,-830 Z" fillRule="evenodd" fill="#000" opacity={0.18} />
    <rect x={-66} y={-800} width={110} height={790} fill={`url(#${prefix}-grid)`} />
  </g>
);

export const JinMao: React.FC<{x: number; base: number; s?: number; prefix: string; frame: number}> = ({x, base, s = 1, prefix, frame}) => {
  const tiers = 9;
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <rect x={-70} y={-300} width={140} height={300} fill="#b9a27a" />
      {Array.from({length: tiers}).map((_, i) => {
        const w = 130 - i * 11;
        const y = -300 - i * 52;
        return (
          <g key={i}>
            <rect x={-w / 2} y={y - 52} width={w} height={52} fill="#c8b18a" />
            <rect x={-w / 2 - 6} y={y - 6} width={w + 12} height={8} fill="#8f7a55" />
          </g>
        );
      })}
      <polygon points="-18,-768 18,-768 0,-880" fill="#c8b18a" />
      <rect x={-2} y={-930} width={4} height={60} fill="#e8dcc3" />
      <rect x={-60} y={-290} width={90} height={280} fill={`url(#${prefix}-win)`} />
      <rect x={30} y={-300} width={40} height={300} fill="#000" opacity={0.16} />
      <circle cx={0} cy={-930} r={5} fill="#ffde00" opacity={0.6 + 0.4 * Math.sin(frame / 4)} />
    </g>
  );
};

export const OrientalPearl: React.FC<{x: number; base: number; s?: number; frame: number}> = ({x, base, s = 1, frame}) => {
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      {/* legs */}
      <polygon points="-90,0 -70,0 -18,-240 -30,-240" fill="#c7c9d6" />
      <polygon points="90,0 70,0 18,-240 30,-240" fill="#a9abb9" />
      <rect x={-8} y={-240} width={16} height={240} fill="#d9dbe6" />
      {/* columns */}
      <rect x={-22} y={-560} width={12} height={330} fill="#d9dbe6" />
      <rect x={10} y={-560} width={12} height={330} fill="#b9bbca" />
      <rect x={-6} y={-800} width={12} height={560} fill="#e6e8f0" />
      {/* spheres */}
      <circle cx={0} cy={-260} r={92} fill="#d63a7a" />
      <circle cx={-28} cy={-290} r={40} fill="#ff86b4" opacity={0.6} />
      <circle cx={0} cy={-260} r={92} fill="none" stroke="#ffb3d1" strokeWidth={4} opacity={0.4 + 0.6 * glow} />
      {[-470, -500, -530].map((y, i) => (
        <circle key={i} cx={(i - 1) * 28} cy={y} r={16} fill="#d63a7a" />
      ))}
      <circle cx={0} cy={-610} r={56} fill="#d63a7a" />
      <circle cx={-16} cy={-628} r={22} fill="#ff86b4" opacity={0.6} />
      <circle cx={0} cy={-760} r={22} fill="#d63a7a" />
      <rect x={-3} y={-900} width={6} height={140} fill="#eef0f6" />
      <circle cx={0} cy={-260} r={140} fill="#ff4f9a" opacity={0.12 * glow} />
      <circle cx={0} cy={-610} r={95} fill="#ff4f9a" opacity={0.12 * glow} />
    </g>
  );
};
