import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, SubtitleBed, Vignette} from '../components/Common';
import {FlagBadge} from '../components/Flag';
import {backOut, easeInOut, easeOut, io, pop, rand} from '../lib/anim';
import {C, FONT_BODY, FONT_TITLE} from '../theme';

const CX = 540;
const CY = 770;
const HALF = 190; // half chip size
const PINS = 9;

type Trace = {d: string; color: string; delay: number; end: [number, number]};
const TRACES: Trace[] = [];
// left (USA, blue) and right (China, red) traces; top/bottom gold
for (let side = 0; side < 4; side++) {
  for (let i = 0; i < PINS; i++) {
    const t = (i + 0.5) / PINS;
    const off = -HALF + t * HALF * 2;
    const bend = 60 + rand(side * 20 + i) * 140;
    const shift = (rand(side * 30 + i + 3) - 0.5) * 160;
    let d = '';
    let end: [number, number] = [0, 0];
    if (side === 0) {
      const x0 = CX - HALF - 34, y0 = CY + off;
      end = [-20, y0 + shift * 1.6];
      d = `M${x0},${y0} L${x0 - bend},${y0} L${x0 - bend - Math.abs(shift)},${y0 + shift} L${end[0]},${y0 + shift}`;
    } else if (side === 1) {
      const x0 = CX + HALF + 34, y0 = CY + off;
      end = [1100, y0 + shift];
      d = `M${x0},${y0} L${x0 + bend},${y0} L${x0 + bend + Math.abs(shift)},${y0 + shift} L${end[0]},${y0 + shift}`;
    } else if (side === 2) {
      const x0 = CX + off, y0 = CY - HALF - 34;
      end = [x0 + shift, 260];
      d = `M${x0},${y0} L${x0},${y0 - bend * 0.6} L${x0 + shift},${y0 - bend * 0.6 - Math.abs(shift) * 0.6} L${end[0]},${end[1]}`;
    } else {
      const x0 = CX + off, y0 = CY + HALF + 34;
      end = [x0 + shift, 1300];
      d = `M${x0},${y0} L${x0},${y0 + bend * 0.6} L${x0 + shift},${y0 + bend * 0.6 + Math.abs(shift) * 0.6} L${end[0]},${end[1]}`;
    }
    TRACES.push({d, end, delay: 46 + i * 2 + side * 3, color: side === 0 ? '#5d8fff' : side === 1 ? '#ff5a3c' : '#ffc83d'});
  }
}

const FutureIcon: React.FC<{x: number; y: number; p: number; kind: number; f: number}> = ({x, y, p, kind, f}) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 10 + kind) * 6}) scale(${p})`}>
    <circle r={62} fill="#071a26" stroke="#7ffcff" strokeWidth={4} />
    <circle r={62} fill="#7ffcff" opacity={0.08 + 0.06 * Math.sin(f / 6 + kind)} />
    {kind === 0 && (
      <g>
        <rect x={-26} y={-22} width={52} height={40} rx={10} fill="#e8f0ff" />
        <circle cx={-10} cy={-3} r={6} fill="#071a26" />
        <circle cx={10} cy={-3} r={6} fill="#071a26" />
        <rect x={-3} y={-38} width={6} height={16} fill="#e8f0ff" />
        <circle cx={0} cy={-40} r={6} fill="#ffd400" />
        <rect x={-18} y={22} width={36} height={14} rx={4} fill="#7ffcff" />
      </g>
    )}
    {kind === 1 && (
      <g transform="rotate(35)">
        <path d="M0,-40 C14,-26 16,0 12,22 L-12,22 C-16,0 -14,-26 0,-40Z" fill="#e8f0ff" />
        <circle cy={-10} r={7} fill="#3d6fe0" />
        <path d="M-12,10 L-24,28 L-12,24Z M12,10 L24,28 L12,24Z" fill="#ff5a3c" />
        <path d={`M-7,24 L0,${40 + 8 * Math.sin(f)} L7,24Z`} fill="#ffd400" />
      </g>
    )}
    {kind === 2 && (
      <g>
        <path d="M-36,10 L-36,-2 C-30,-8 -20,-10 -14,-10 L-4,-24 L18,-24 L28,-10 C36,-8 38,-4 38,2 L38,10 Z" fill="#e8f0ff" />
        <circle cx={-20} cy={12} r={8} fill="#071a26" stroke="#7ffcff" strokeWidth={3} />
        <circle cx={22} cy={12} r={8} fill="#071a26" stroke="#7ffcff" strokeWidth={3} />
        <path d="M2,-20 L-4,-12 L2,-12 L-2,-4 L8,-15 L2,-15 L5,-20Z" fill="#ffd400" />
      </g>
    )}
    {kind === 3 && (
      <g>
        <rect x={-20} y={-34} width={40} height={68} rx={8} fill="#e8f0ff" />
        <rect x={-15} y={-26} width={30} height={46} rx={3} fill="#3d6fe0" />
        <rect x={-10} y={-18} width={20 * ((f % 40) / 40)} height={6} fill="#ffd400" />
        <circle cy={27} r={3} fill="#3d6fe0" />
      </g>
    )}
  </g>
);

export const Scene04Chips: React.FC = () => {
  const {f} = useScene();
  const zoom = 1 + io(f, [0, 210], [0, 0.1], easeInOut);
  const sub = pop(f, 0, 13, 110);
  const die = io(f, [26, 42], [-520, 0], backOut);
  const lid = io(f, [40, 56], [0, 1], easeOut);
  const keyP = pop(f, 98, 12, 130);
  const tug = Math.sin(f / 14) * 0.12 + Math.sin(f / 5.3) * 0.03;
  const badges = pop(f, 30, 12, 120);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, #0f3a4d, #071824 60%, #040b12)'}}>
      <Canvas>
        <defs>
          <pattern id="pcb" width={60} height={60} patternUnits="userSpaceOnUse">
            <path d="M0,30 L20,30 L30,20 L60,20 M30,60 L30,40 L40,30" stroke="#1d6070" strokeWidth={2} fill="none" />
            <circle cx={20} cy={30} r={3} fill="#1d6070" />
            <circle cx={40} cy={30} r={3} fill="#1d6070" />
          </pattern>
          <linearGradient id="chip-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3f52" />
            <stop offset="1" stopColor="#151925" />
          </linearGradient>
          <radialGradient id="chip-core">
            <stop offset="0" stopColor="#fff6c2" />
            <stop offset="0.4" stopColor="#ffd400" stopOpacity={0.8} />
            <stop offset="1" stopColor="#ff8a00" stopOpacity={0} />
          </radialGradient>
          <filter id="glow4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={6} />
          </filter>
        </defs>
        <g transform={`translate(${CX} ${CY}) scale(${zoom}) translate(${-CX} ${-CY})`}>
          <rect x={-200} y={-200} width={1480} height={2320} fill="url(#pcb)" opacity={0.55} transform={`translate(${(f * 0.6) % 60} 0)`} />
          {/* rotating silicon wafer diagram */}
          <g transform={`translate(${CX} ${CY}) rotate(${f * 0.4})`} opacity={0.35}>
            <circle r={430} fill="#123c52" stroke="#5fd3ff" strokeWidth={3} />
            <path d="M-60,428 L60,428" stroke="#071824" strokeWidth={10} />
            {Array.from({length: 13}).map((_, i) =>
              Array.from({length: 13}).map((__, j) => {
                const x = -390 + i * 60;
                const y = -390 + j * 60;
                return Math.hypot(x + 28, y + 28) < 400 ? <rect key={`${i}-${j}`} x={x} y={y} width={54} height={54} fill="#1e5d78" stroke="#5fd3ff" strokeOpacity={0.4} /> : null;
              }),
            )}
          </g>
          {/* dimension line */}
          <g opacity={io(f, [60, 80], [0, 0.8])} stroke="#9fe8ff" strokeWidth={2} fill="#9fe8ff">
            <line x1={CX - 430} y1={CY + 470} x2={CX + 430} y2={CY + 470} />
            <line x1={CX - 430} y1={CY + 455} x2={CX - 430} y2={CY + 485} />
            <line x1={CX + 430} y1={CY + 455} x2={CX + 430} y2={CY + 485} />
            <text x={CX} y={CY + 460} fontFamily={FONT_BODY} fontWeight={800} fontSize={24} textAnchor="middle" stroke="none">Ø 300 мм</text>
          </g>
          {/* circuit traces */}
          {TRACES.map((t, i) => {
            const p = io(f, [t.delay, t.delay + 24], [0, 1], easeOut);
            if (p <= 0) return null;
            const pulse = ((f - t.delay) * 0.025 + rand(i)) % 1;
            return (
              <g key={i}>
                <path d={t.d} fill="none" stroke={t.color} strokeWidth={10} opacity={0.25} pathLength={1} strokeDasharray={`${p} 1`} filter="url(#glow4)" />
                <path d={t.d} fill="none" stroke={t.color} strokeWidth={4} pathLength={1} strokeDasharray={`${p} 1`} strokeLinejoin="round" />
                {p >= 1 && <path d={t.d} fill="none" stroke="#fff" strokeWidth={6} pathLength={1} strokeDasharray="0.05 1" strokeDashoffset={-pulse} strokeLinecap="round" />}
              </g>
            );
          })}
          {/* small components snapping onto the board */}
          {Array.from({length: 14}).map((_, i) => {
            const ang = rand(i + 70) * Math.PI * 2;
            const dist = 270 + rand(i + 20) * 120;
            const tx = CX + Math.cos(ang) * dist;
            const ty = CY + Math.sin(ang) * dist;
            const p = io(f, [18 + i * 2.5, 30 + i * 2.5], [0, 1], backOut);
            const fx = tx + (1 - p) * Math.cos(ang) * 500;
            const fy = ty + (1 - p) * Math.sin(ang) * 500;
            return p > 0 ? (
              <g key={i} transform={`translate(${fx} ${fy}) rotate(${(rand(i) > 0.5 ? 90 : 0) + (1 - p) * 180})`}>
                {i % 2 ? (
                  <g>
                    <rect x={-20} y={-9} width={40} height={18} rx={4} fill="#c7a46a" />
                    <rect x={-8} y={-9} width={5} height={18} fill="#8b3a3a" />
                    <rect x={3} y={-9} width={5} height={18} fill="#3a5a8b" />
                  </g>
                ) : (
                  <g>
                    <rect x={-14} y={-14} width={28} height={28} rx={4} fill="#222838" />
                    <rect x={-18} y={-10} width={4} height={20} fill="#c9d1de" />
                    <rect x={14} y={-10} width={4} height={20} fill="#c9d1de" />
                  </g>
                )}
              </g>
            ) : null;
          })}
          {/* chip */}
          <g transform={`translate(${CX} ${CY}) scale(${sub}) rotate(${(1 - sub) * -30})`}>
            <rect x={-HALF - 26} y={-HALF - 26} width={2 * HALF + 52} height={2 * HALF + 52} rx={18} fill="#1f6b45" stroke="#3fa86f" strokeWidth={4} />
            {/* pins */}
            {[0, 1, 2, 3].map((side) =>
              Array.from({length: PINS}).map((_, i) => {
                const p = io(f, [12 + i * 2 + side, 26 + i * 2 + side], [0, 1], easeOut);
                const off = -HALF + ((i + 0.5) / PINS) * HALF * 2;
                const len = 34 * p;
                const props =
                  side === 0 ? {x: -HALF - 26 - len, y: off - 7, width: len, height: 14}
                  : side === 1 ? {x: HALF + 26, y: off - 7, width: len, height: 14}
                  : side === 2 ? {x: off - 7, y: -HALF - 26 - len, width: 14, height: len}
                  : {x: off - 7, y: HALF + 26, width: 14, height: len};
                return <rect key={`${side}-${i}`} {...props} rx={3} fill="#e8c46a" />;
              }),
            )}
            {/* die + lid */}
            <g transform={`translate(0 ${die})`}>
              <rect x={-HALF + 10} y={-HALF + 10} width={2 * HALF - 20} height={2 * HALF - 20} rx={14} fill="url(#chip-top)" stroke="#5a6178" strokeWidth={4} />
              <g opacity={lid}>
                {Array.from({length: 6}).map((_, i) =>
                  Array.from({length: 6}).map((__, j) => {
                    const on = Math.sin(f / 4 + i * 1.3 + j * 0.7) > 0.3;
                    return <rect key={`${i}-${j}`} x={-120 + i * 42} y={-120 + j * 42} width={34} height={34} rx={4} fill={on ? '#ffd400' : '#2a3044'} opacity={on ? 0.85 : 1} />;
                  }),
                )}
                <circle r={150} fill="url(#chip-core)" opacity={0.35 + 0.15 * Math.sin(f / 5)} />
              </g>
              <text x={-HALF + 34} y={HALF - 34} fontFamily={FONT_TITLE} fontSize={26} fill="#9aa6bb" opacity={lid}>CHIP</text>
            </g>
            {/* key: chips unlock the future */}
            {keyP > 0.01 && (
              <g transform={`scale(${keyP}) rotate(${(1 - keyP) * 90 + Math.sin(f / 9) * 4})`}>
                <circle r={110} fill="#ffd400" opacity={0.18} filter="url(#glow4)" />
                <circle cx={-46} cy={0} r={40} fill="none" stroke="#fff3b0" strokeWidth={18} />
                <rect x={-8} y={-9} width={110} height={18} rx={6} fill="#fff3b0" />
                <rect x={62} y={8} width={14} height={26} fill="#fff3b0" />
                <rect x={86} y={8} width={14} height={18} fill="#fff3b0" />
              </g>
            )}
          </g>
          {/* future tech icons at trace endpoints */}
          {[
            [170, 430],
            [910, 430],
            [170, 1130],
            [910, 1130],
          ].map(([x, y], k) => {
            const p = pop(f, 140 + k * 6, 11, 140);
            return p > 0.01 ? <FutureIcon key={k} x={x} y={y} p={p} kind={k} f={f} /> : null;
          })}
        </g>
        {/* USA vs China badges + tug of war meter */}
        <g opacity={Math.min(1, badges)}>
          <g transform={`translate(${110 + (1 - badges) * -200} 770)`}>
            <FlagBadge kind="us" id="chip-us" cx={0} cy={0} r={62} />
            <text y={104} fontFamily={FONT_TITLE} fontSize={34} fill="#fff" textAnchor="middle">США</text>
          </g>
          <g transform={`translate(${970 + (1 - badges) * 200} 770)`}>
            <FlagBadge kind="cn" id="chip-cn" cx={0} cy={0} r={62} ring={C.cnGold} />
            <text y={104} fontFamily={FONT_TITLE} fontSize={34} fill={C.cnGold} textAnchor="middle">КИТАЙ</text>
          </g>
          <g transform="translate(540 330)">
            <rect x={-330} y={-16} width={660} height={32} rx={16} fill="#0a1620" stroke="#fff" strokeOpacity={0.4} strokeWidth={2} />
            <rect x={-326} y={-12} width={326 + tug * 652} height={24} rx={12} fill="#3d6fe0" />
            <rect x={tug * 652} y={-12} width={326 - tug * 652} height={24} rx={12} fill="#de2910" />
            <circle cx={tug * 652} r={22} fill="#ffd400" stroke="#fff" strokeWidth={4} />
            <text y={-36} fontFamily={FONT_BODY} fontWeight={900} fontSize={26} fill="#fff" textAnchor="middle" letterSpacing={3}>БИТВА ЗА МИКРОЧИПЫ</text>
          </g>
        </g>
      </Canvas>
      <SubtitleBed opacity={0.4} />
      <Vignette strength={0.55} />
    </AbsoluteFill>
  );
};
