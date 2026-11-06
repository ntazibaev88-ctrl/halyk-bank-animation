import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, Stars, SubtitleBed, Vignette} from '../components/Common';
import {Globe} from '../components/Globe';
import {WavingFlag} from '../components/Flag';
import {Capitol, EmpireState, Liberty, OneWTC, OrientalPearl, ShanghaiTower, WindowPatterns} from '../components/Buildings';
import {easeInOut, easeOut, io, pop, rand} from '../lib/anim';
import {FONT_TITLE} from '../theme';

const TempleOfHeaven: React.FC<{x: number; base: number; s?: number}> = ({x, base, s = 1}) => (
  <g transform={`translate(${x} ${base}) scale(${s})`}>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={-150 + i * 22} y={-22 - i * 22} width={300 - i * 44} height={22} fill="#f1eee6" />
        <rect x={-150 + i * 22} y={-22 - i * 22} width={300 - i * 44} height={4} fill="#d3cdbf" />
      </g>
    ))}
    {[0, 1, 2].map((t) => {
      const w = 190 - t * 46;
      const y = -66 - t * 70;
      return (
        <g key={t}>
          <rect x={-w / 2 + 14} y={y - 46} width={w - 28} height={46} fill="#b8262a" />
          {Array.from({length: 6}).map((_, k) => (
            <rect key={k} x={-w / 2 + 22 + k * ((w - 44) / 5) - 3} y={y - 44} width={6} height={42} fill="#ffcf4a" opacity={0.7} />
          ))}
          <path d={`M${-w / 2 - 14},${y - 40} Q0,${y - 92} ${w / 2 + 14},${y - 40} Z`} fill="#2a4f9e" />
          <path d={`M${-w / 2 - 14},${y - 40} L${w / 2 + 14},${y - 40}`} stroke="#ffcf4a" strokeWidth={5} />
        </g>
      );
    })}
    <circle cx={0} cy={-286} r={12} fill="#ffcf4a" />
    <rect x={-3} y={-310} width={6} height={20} fill="#ffcf4a" />
  </g>
);

const Beam: React.FC<{x: number; y: number; angle: number; color: string; o: number}> = ({x, y, angle, color, o}) => (
  <polygon points="-10,0 10,0 90,-1100 -90,-1100" fill={color} opacity={0.18 * o} transform={`translate(${x} ${y}) rotate(${angle})`} />
);

export const Scene09Question: React.FC = () => {
  const {f} = useScene();
  const R = 290 + io(f, [0, 267], [0, 60], easeInOut);
  const usOn = io(f, [0, 20], [0.3, 1]) * io(f, [100, 125], [1, 0.55]);
  const cnOn = io(f, [108, 130], [0.35, 1]);
  const rise = pop(f, 0, 14, 90);
  const qP = io(f, [205, 240], [0, 1], easeOut);
  const icons = (side: number) => {
    const base = side ? 118 : 12;
    const syms = side ? ['🏭', '⚡', 'AI', '↗'] : ['$', '★', 'AI', '🚀'];
    return syms.map((sym, k) => {
      const p = pop(f, base + k * 10, 11, 140);
      const x = side ? 640 + k * 105 : 60 + k * 105;
      const y = 820 + Math.sin(f / 10 + k) * 8;
      const col = side ? '#ff5a3c' : '#5d8fff';
      return p > 0.01 ? (
        <g key={`${side}-${k}`} transform={`translate(${x + 40} ${y}) scale(${p})`}>
          <circle r={38} fill="#0a0f26" stroke={col} strokeWidth={4} />
          {sym === '$' && <text y={16} fontFamily={FONT_TITLE} fontSize={44} fill="#49f28a" textAnchor="middle">$</text>}
          {sym === '★' && <path d="M0,-22 L6,-7 L22,-7 L9,3 L14,19 L0,9 L-14,19 L-9,3 L-22,-7 L-6,-7Z" fill="#e8f0ff" />}
          {sym === 'AI' && <text y={12} fontFamily={FONT_TITLE} fontSize={32} fill={side ? '#ffde00' : '#7fb2ff'} textAnchor="middle">AI</text>}
          {sym === '🚀' && (
            <g transform="rotate(35)">
              <path d="M0,-24 C9,-14 10,0 7,12 L-7,12 C-10,0 -9,-14 0,-24Z" fill="#e8f0ff" />
              <path d="M-5,12 L0,24 L5,12Z" fill="#ffd400" />
            </g>
          )}
          {sym === '🏭' && <path d="M-22,16 L-22,-4 L-10,4 L-10,-4 L2,4 L2,-16 L10,-16 L10,4 L22,4 L22,16Z" fill="#e8f0ff" />}
          {sym === '⚡' && <path d="M4,-24 L-12,4 L0,4 L-4,24 L12,-4 L0,-4Z" fill="#ffde00" />}
          {sym === '↗' && (
            <g stroke="#49f28a" strokeWidth={6} fill="none" strokeLinecap="round">
              <path d="M-18,14 L-4,0 L4,8 L18,-10" />
              <path d="M6,-10 L18,-10 L18,2" />
            </g>
          )}
        </g>
      ) : null;
    });
  };

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 15% 70%, rgba(40,80,220,0.5), rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 70%, rgba(220,40,20,0.45), rgba(0,0,0,0) 45%), linear-gradient(180deg,#03050c,#0a1230 60%,#05070f)',
      }}
    >
      <Canvas>
        <defs>
          <WindowPatterns prefix="q" lit="#ffe7a8" />
        </defs>
        <Stars frame={f} n={160} seed={33} />
        {/* big question mark hologram */}
        <text x={540} y={760} fontFamily={FONT_TITLE} fontSize={900} fill="#ffd400" opacity={0.1 * qP} textAnchor="middle">?</text>
        {/* searchlights */}
        {[0, 1].map((k) => (
          <Beam key={'u' + k} x={120 + k * 200} y={1180} angle={20 + Math.sin(f / 22 + k * 2) * 22} color="#8fb4ff" o={usOn} />
        ))}
        {[0, 1].map((k) => (
          <Beam key={'c' + k} x={760 + k * 200} y={1180} angle={-20 + Math.sin(f / 20 + k * 2 + 1) * 22} color="#ff8a6a" o={cnOn} />
        ))}
        <Globe id="q-globe" cx={540} cy={600} r={R} rotate={[-2 - f * 0.06, -66, 0]} frame={f} night={0.75} highlight={1} />
        {/* light particles orbiting the planet */}
        {Array.from({length: 24}).map((_, i) => {
          const a = f / 40 + (i / 24) * Math.PI * 2;
          const rr = R + 40 + (i % 3) * 18;
          const x = 540 + Math.cos(a) * rr;
          const y = 600 + Math.sin(a) * rr * 0.32 + 0;
          const front = Math.sin(a) > 0;
          return front ? <circle key={i} cx={x} cy={y + R * 0.2} r={4 + (i % 3)} fill={x < 540 ? '#8fb4ff' : '#ff8a6a'} opacity={0.8} /> : null;
        })}
        {/* USA platform */}
        <g transform={`translate(0 ${(1 - rise) * 300})`}>
          <path d="M-20,1250 L-20,1120 Q230,1060 480,1120 L480,1250Z" fill="#14204a" />
          <g opacity={0.45 + 0.55 * usOn}>
            <EmpireState x={300} base={1110} s={0.38} prefix="q" frame={f} />
            <OneWTC x={390} base={1115} s={0.32} prefix="q" frame={f} />
            <Capitol x={190} base={1116} s={0.42} />
            <Liberty x={70} base={1122} s={0.48} frame={f} />
          </g>
          <WavingFlag kind="us" id="q-us" x={420} y={860} w={150} frame={f} poleH={260} />
          <ellipse cx={230} cy={1124} rx={260} ry={20} fill="#5d8fff" opacity={0.35 * usOn} />
        </g>
        {/* China platform */}
        <g transform={`translate(0 ${(1 - rise) * 300})`}>
          <path d="M600,1250 L600,1120 Q850,1060 1100,1120 L1100,1250Z" fill="#3a1020" />
          <g opacity={0.45 + 0.55 * cnOn}>
            <OrientalPearl x={1010} base={1118} s={0.36} frame={f} />
            <ShanghaiTower x={920} base={1115} s={0.33} frame={f} prefix="q" />
            <TempleOfHeaven x={760} base={1118} s={0.62} />
          </g>
          <WavingFlag kind="cn" id="q-cn" x={612} y={860} w={140} frame={f + 11} poleH={260} />
          <ellipse cx={850} cy={1124} rx={260} ry={20} fill="#ff5a3c" opacity={0.35 * cnOn} />
        </g>
        {/* advantages */}
        {icons(0)}
        {icons(1)}
        {/* spark sweep between the sides */}
        {Array.from({length: 10}).map((_, i) => {
          const t = ((f / 60 + i / 10) % 1);
          const x = 240 + t * 600;
          const y = 1080 - Math.sin(t * Math.PI) * 120 + (rand(i) - 0.5) * 20;
          return <circle key={i} cx={x} cy={y} r={3.5} fill="#ffd400" opacity={Math.sin(t * Math.PI) * 0.9} />;
        })}
      </Canvas>
      <SubtitleBed opacity={0.45} />
      <Vignette strength={0.55} />
    </AbsoluteFill>
  );
};
