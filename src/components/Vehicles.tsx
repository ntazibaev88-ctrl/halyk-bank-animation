import React from 'react';

/** Wheel with rotating spokes. */
export const Wheel: React.FC<{cx: number; cy: number; r: number; angle: number; rim?: string}> = ({cx, cy, r, angle, rim = '#c9d1de'}) => (
  <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
    <circle r={r} fill="#1b1f2a" />
    <circle r={r * 0.58} fill={rim} />
    {[0, 72, 144, 216, 288].map((a) => (
      <rect key={a} x={-r * 0.07} y={-r * 0.55} width={r * 0.14} height={r * 0.55} fill="#6b7489" transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.16} fill="#3b4256" />
  </g>
);

/** Side-view car. dir = 1 faces right, -1 faces left. */
export const Car: React.FC<{
  x: number;
  y: number; // road line (bottom of wheels)
  s?: number;
  body: string;
  dir?: 1 | -1;
  dist: number; // distance travelled, drives wheel rotation
  kind?: 'taxi' | 'sedan' | 'ev' | 'bus';
}> = ({x, y, s = 1, body, dir = 1, dist, kind = 'sedan'}) => {
  const ang = ((dist / (2 * Math.PI * 18)) * 360) % 360;
  if (kind === 'bus') {
    return (
      <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
        <rect x={-120} y={-92} width={240} height={74} rx={14} fill={body} />
        <rect x={-110} y={-82} width={200} height={30} rx={6} fill="#bfe3ff" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-108 + i * 40} y={-82} width={4} height={30} fill={body} />
        ))}
        <rect x={98} y={-82} width={16} height={46} rx={4} fill="#bfe3ff" />
        <rect x={-120} y={-40} width={240} height={8} fill="#fff" opacity={0.5} />
        <Wheel cx={-70} cy={-18} r={18} angle={ang} />
        <Wheel cx={70} cy={-18} r={18} angle={ang} />
      </g>
    );
  }
  const ev = kind === 'ev';
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`}>
      <ellipse cx={0} cy={-2} rx={78} ry={7} fill="#000" opacity={0.25} />
      {ev ? (
        <path d="M-78,-20 C-80,-44 -60,-50 -40,-52 C-18,-74 30,-76 52,-56 C70,-54 82,-44 80,-20 Z" fill={body} />
      ) : (
        <path d="M-76,-18 L-76,-44 C-70,-50 -52,-52 -44,-52 L-28,-76 L36,-76 L54,-52 C70,-50 78,-46 78,-36 L78,-18 Z" fill={body} />
      )}
      {ev ? (
        <path d="M-34,-53 C-16,-70 26,-71 44,-55 Z" fill="#9fd8ff" />
      ) : (
        <g fill="#bfe3ff">
          <path d="M-38,-54 L-24,-72 L2,-72 L2,-54 Z" />
          <path d="M8,-54 L8,-72 L32,-72 L46,-54 Z" />
        </g>
      )}
      {ev && <rect x={-70} y={-36} width={146} height={4} rx={2} fill="#7ffcff" opacity={0.85} />}
      {ev && <path d="M-6,-46 L-12,-36 L-4,-36 L-9,-26 L4,-40 L-3,-40 L2,-46 Z" fill="#7ffcff" />}
      {kind === 'taxi' && (
        <g>
          <rect x={-16} y={-88} width={32} height={12} rx={3} fill="#fff6c2" stroke="#222" strokeWidth={1.5} />
          <text x={0} y={-79} fontSize={9} fontWeight={900} textAnchor="middle" fill="#222" fontFamily="Montserrat">TAXI</text>
          <g fill="#222">
            {Array.from({length: 8}).map((_, i) => (
              <rect key={i} x={-60 + i * 15} y={-34} width={7} height={7} opacity={i % 2 ? 1 : 0} />
            ))}
          </g>
        </g>
      )}
      <rect x={70} y={-42} width={10} height={8} rx={2} fill={ev ? '#e9ffff' : '#fff4b0'} />
      <rect x={-80} y={-40} width={8} height={8} rx={2} fill="#ff3b3b" />
      <Wheel cx={-46} cy={-18} r={18} angle={ang} />
      <Wheel cx={48} cy={-18} r={18} angle={ang} />
    </g>
  );
};

/** Light trail used behind fast EVs. */
export const LightTrail: React.FC<{x: number; y: number; len: number; color: string; dir?: 1 | -1}> = ({x, y, len, color, dir = 1}) => (
  <g>
    <defs>
      <linearGradient id={`trail-${color.replace('#', '')}-${dir}`} x1={dir === 1 ? '1' : '0'} y1="0" x2={dir === 1 ? '0' : '1'} y2="0">
        <stop offset="0" stopColor={color} stopOpacity={0.9} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect x={dir === 1 ? x - len : x} y={y - 3} width={len} height={6} rx={3} fill={`url(#trail-${color.replace('#', '')}-${dir})`} />
  </g>
);

/** Elevated metro / subway train made of n cars. x = front of the train (moving left). */
export const Train: React.FC<{x: number; y: number; cars?: number; body?: string; stripe?: string; dist: number}> = ({
  x,
  y,
  cars = 6,
  body = '#d7dde8',
  stripe = '#2d5bd7',
  dist,
}) => {
  const L = 250;
  const ang = ((dist / (2 * Math.PI * 12)) * 360) % 360;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({length: cars}).map((_, i) => (
        <g key={i} transform={`translate(${i * (L + 8)} 0)`}>
          {i === 0 ? (
            <path d={`M30,-96 L${L},-96 L${L},-16 L0,-16 L0,-60 Q4,-92 30,-96Z`} fill={body} />
          ) : (
            <rect x={0} y={-96} width={L} height={80} rx={8} fill={body} />
          )}
          <rect x={0} y={-44} width={L} height={10} fill={stripe} />
          {Array.from({length: 6}).map((_, k) => (
            <rect key={k} x={(i === 0 ? 36 : 14) + k * 36} y={-84} width={26} height={30} rx={4} fill="#fff1b8" opacity={0.9} />
          ))}
          <rect x={L / 2 - 14} y={-86} width={28} height={66} rx={3} fill="#9aa6bb" />
          <Wheel cx={40} cy={-10} r={12} angle={ang} />
          <Wheel cx={L - 40} cy={-10} r={12} angle={ang} />
        </g>
      ))}
    </g>
  );
};

/** Large container ship. rock = degrees of roll. */
export const CargoShip: React.FC<{x: number; y: number; s?: number; rock?: number; frame: number; dir?: 1 | -1; seed?: number; hull?: string}> = ({
  x,
  y,
  s = 1,
  rock = 0,
  frame,
  dir = 1,
  seed = 0,
  hull = '#1f2a44',
}) => {
  const colors = ['#d94a3a', '#2f6fd6', '#f2b233', '#2fae7a', '#e9edf3', '#8a4fd0', '#ef7d2b'];
  const containers: React.ReactNode[] = [];
  for (let row = 0; row < 3; row++) {
    for (let c = 0; c < 9; c++) {
      if (row === 2 && (c + seed) % 4 === 0) continue;
      const col = colors[(c * 3 + row * 5 + seed) % colors.length];
      containers.push(
        <g key={`${row}-${c}`}>
          <rect x={-250 + c * 46} y={-86 - row * 30} width={44} height={28} fill={col} />
          <rect x={-250 + c * 46} y={-86 - row * 30} width={44} height={28} fill="url(#ship-ribs)" opacity={0.35} />
        </g>,
      );
    }
  }
  const smoke = Array.from({length: 5}).map((_, i) => {
    const p = ((frame / 40 + i / 5) % 1 + 1) % 1;
    return <circle key={i} cx={232 - p * 120} cy={-210 - p * 110} r={14 + p * 30} fill="#dfe6ef" opacity={0.55 * (1 - p)} />;
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${dir * s} ${s}) rotate(${rock})`}>
      <defs>
        <pattern id="ship-ribs" width={6} height={28} patternUnits="userSpaceOnUse">
          <rect width={2} height={28} fill="#000" />
        </pattern>
      </defs>
      {smoke}
      <path d="M-300,-30 L330,-30 L300,40 L-270,40 Z" fill={hull} />
      <path d="M-300,-30 L330,-30 L322,-10 L-294,-10 Z" fill="#c43a2e" />
      <path d="M-275,30 L305,30 L300,40 L-270,40 Z" fill="#9e2a20" />
      <rect x={-300} y={-44} width={630} height={14} fill="#e9edf3" />
      {containers}
      {/* bridge */}
      <rect x={180} y={-190} width={70} height={160} fill="#f1f3f7" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={186} y={-180 + i * 36} width={58} height={12} fill="#35507e" />
      ))}
      <rect x={220} y={-232} width={26} height={44} fill="#d94a3a" />
      <rect x={220} y={-232} width={26} height={8} fill="#1f2a44" />
      <text x={-40} y={20} fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#fff" opacity={0.85} textAnchor="middle" transform={dir === -1 ? 'scale(-1 1) translate(80 0)' : undefined}>
        CARGO
      </text>
    </g>
  );
};

/** Port gantry crane carrying a container. t in 0..1 is the lift cycle. */
export const Crane: React.FC<{x: number; y: number; s?: number; t: number; color?: string; box?: string}> = ({x, y, s = 1, t, color = '#f2b233', box = '#2f6fd6'}) => {
  // trolley moves out over the ship, lowers, lifts, returns
  const trolley = t < 0.5 ? -40 - t * 2 * 260 : -300 + (t - 0.5) * 2 * 260;
  const drop = Math.sin(Math.min(1, t * 2) * Math.PI) * 80;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-60} y={-420} width={18} height={420} fill={color} />
      <rect x={40} y={-420} width={18} height={420} fill={color} />
      <rect x={-60} y={-230} width={118} height={14} fill={color} />
      <path d="M-60,-230 L58,-420 M58,-230 L-60,-420" stroke={color} strokeWidth={8} />
      <rect x={-360} y={-440} width={480} height={22} fill={color} />
      <path d="M-51,-440 L-10,-520 L40,-440" stroke={color} strokeWidth={10} fill="none" />
      <path d="M-10,-520 L-350,-442 M-10,-520 L110,-442" stroke="#c98d17" strokeWidth={4} />
      <rect x={trolley - 20} y={-420} width={40} height={16} fill="#3b4256" />
      <line x1={trolley} y1={-404} x2={trolley} y2={-300 + drop} stroke="#2a2f3d" strokeWidth={3} />
      <rect x={trolley - 40} y={-300 + drop} width={80} height={36} fill={box} />
      <rect x={trolley - 40} y={-300 + drop} width={80} height={36} fill="url(#ship-ribs)" opacity={0.3} />
    </g>
  );
};
