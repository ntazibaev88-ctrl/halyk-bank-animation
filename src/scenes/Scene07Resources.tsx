import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, SubtitleBed, Vignette} from '../components/Common';
import {Wheel} from '../components/Vehicles';
import {easeInOut, easeOut, io, pop, rand, wrap} from '../lib/anim';
import {FONT_BODY, FONT_TITLE} from '../theme';

const ELEMENTS = [
  {s: 'La', n: 57, name: 'Лантан', c: '#5d8fff'},
  {s: 'Ce', n: 58, name: 'Церий', c: '#2fd3c7'},
  {s: 'Pr', n: 59, name: 'Празеодим', c: '#49f28a'},
  {s: 'Nd', n: 60, name: 'Неодим', c: '#ffd400'},
  {s: 'Tb', n: 65, name: 'Тербий', c: '#ff8a2b'},
  {s: 'Dy', n: 66, name: 'Диспрозий', c: '#ff5a8a'},
];
const GEM = ['#b06cff', '#2fd3c7', '#ff5a8a', '#ffd400', '#5d8fff'];

const Excavator: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => {
  const t = (f % 60) / 60;
  const boom = -35 + Math.sin(t * Math.PI * 2) * 14;
  const stick = 70 + Math.sin(t * Math.PI * 2 + 1.2) * 26;
  const bucket = 40 + Math.sin(t * Math.PI * 2 + 2.2) * 40;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-80} y={-28} width={160} height={28} rx={14} fill="#2b2f3d" />
      {[-56, -20, 16, 52].map((cx) => (
        <circle key={cx} cx={cx} cy={-14} r={9} fill="#6b7489" />
      ))}
      <rect x={-70} y={-82} width={130} height={54} rx={8} fill="#f2b233" />
      <rect x={-64} y={-128} width={56} height={48} rx={6} fill="#f2b233" />
      <rect x={-58} y={-122} width={40} height={30} rx={4} fill="#bfe3ff" />
      <rect x={30} y={-96} width={10} height={20} fill="#3a3f52" />
      <g transform={`translate(30 -70) rotate(${boom})`}>
        <rect x={0} y={-12} width={150} height={24} rx={10} fill="#f2b233" />
        <g transform={`translate(146 0) rotate(${stick})`}>
          <rect x={0} y={-9} width={110} height={18} rx={8} fill="#e0a020" />
          <g transform={`translate(108 0) rotate(${bucket})`}>
            <path d="M0,-6 L34,-18 L44,10 L10,22 Z" fill="#6b7489" />
            <circle cx={22} cy={-6} r={7} fill={GEM[Math.floor(f / 60) % GEM.length]} opacity={t > 0.5 ? 1 : 0} />
          </g>
        </g>
      </g>
    </g>
  );
};

const ChainIcon: React.FC<{kind: number}> = ({kind}) => {
  if (kind === 0)
    return (
      <g>
        <path d="M-26,18 L18,-26" stroke="#c9a77a" strokeWidth={8} strokeLinecap="round" />
        <path d="M-6,-30 Q22,-36 30,-8" stroke="#c9d1de" strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>
    );
  if (kind === 1)
    return (
      <g>
        <rect x={-28} y={-6} width={56} height={30} fill="#c9d1de" />
        <path d="M-28,-6 L-28,-20 L-12,-10 L-12,-24 L4,-14 L4,-6Z" fill="#c9d1de" />
        <rect x={12} y={-32} width={10} height={26} fill="#9aa6bb" />
      </g>
    );
  if (kind === 2)
    return (
      <g>
        <path d="M-24,-22 L-24,6 A24,24 0 0 0 24,6 L24,-22 L10,-22 L10,6 A10,10 0 0 1 -10,6 L-10,-22Z" fill="#e8402a" />
        <rect x={-24} y={-26} width={14} height={10} fill="#e8eef8" />
        <rect x={10} y={-26} width={14} height={10} fill="#e8eef8" />
      </g>
    );
  if (kind === 3)
    return (
      <g>
        <rect x={-15} y={-28} width={30} height={56} rx={6} fill="#e8f0ff" />
        <rect x={-11} y={-22} width={22} height={38} rx={2} fill="#3d6fe0" />
      </g>
    );
  if (kind === 4)
    return (
      <g>
        <path d="M-30,8 L-30,-2 C-24,-8 -14,-10 -8,-10 L0,-22 L18,-22 L26,-10 C32,-8 34,-4 34,0 L34,8 Z" fill="#e8f0ff" />
        <circle cx={-16} cy={10} r={7} fill="#1b1f2a" />
        <circle cx={20} cy={10} r={7} fill="#1b1f2a" />
      </g>
    );
  return (
    <g>
      <rect x={-3} y={-10} width={6} height={40} fill="#e8f0ff" />
      {[0, 120, 240].map((a) => (
        <path key={a} d="M0,-10 C6,-20 6,-34 0,-40 C-4,-30 -4,-20 0,-10Z" fill="#e8f0ff" transform={`rotate(${a} 0 -10)`} />
      ))}
    </g>
  );
};

export const Scene07Resources: React.FC = () => {
  const {f} = useScene();
  const cam = io(f, [0, 210], [0, 60], easeInOut);
  const truckX = wrap(f * 3.4, 1400) - 200;
  const chainP = io(f, [92, 150], [0, 1], easeOut);

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2b1d4f" />
            <stop offset="0.55" stopColor="#d9644a" />
            <stop offset="1" stopColor="#ffc27a" />
          </linearGradient>
          <linearGradient id="rs-pit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c47a4a" />
            <stop offset="1" stopColor="#7a4630" />
          </linearGradient>
        </defs>
        <rect width={1080} height={1160} fill="url(#rs-sky)" />
        <circle cx={760} cy={720} r={110} fill="#ffe2a8" opacity={0.85} />
        {/* mountain layers */}
        <path d={`M${-40 - cam * 0.2},880 L120,640 L260,760 L420,560 L600,740 L780,600 L960,760 L1140,620 L1140,1100 L-40,1100Z`} fill="#8a4a5e" opacity={0.75} />
        <path d={`M${-40 - cam * 0.4},940 L180,760 L330,860 L520,720 L700,860 L880,740 L1140,880 L1140,1100 L-40,1100Z`} fill="#a85a4f" />
        <g transform={`translate(${-cam} 0)`}>
          {/* open-pit mine terraces */}
          {Array.from({length: 5}).map((_, i) => (
            <path key={i} d={`M${-60 + i * 40},${900 + i * 38} L${560 - i * 40},${900 + i * 38} L${540 - i * 40},${938 + i * 38} L${-40 + i * 40},${938 + i * 38}Z`} fill={i % 2 ? '#b8693f' : '#c97a4a'} />
          ))}
          <rect x={-60} y={1090} width={680} height={70} fill="#7a4630" />
          {/* glittering ore seams */}
          {Array.from({length: 16}).map((_, i) => (
            <polygon key={i} points="0,-9 7,0 0,9 -7,0" fill={GEM[i % GEM.length]}
              transform={`translate(${20 + rand(i) * 480} ${915 + rand(i + 4) * 160}) scale(${0.7 + 0.5 * Math.abs(Math.sin(f / 7 + i))})`} />
          ))}
          <Excavator x={200} y={938} f={f} />
          {/* processing plant */}
          <g transform="translate(700 0)">
            {[0, 1, 2].map((k) => (
              <g key={k}>
                <rect x={170 + k * 70} y={720 - k * 30} width={40} height={300 + k * 30} fill="#5b6378" />
                <rect x={170 + k * 70} y={720 - k * 30} width={40} height={14} fill="#e8402a" />
                {Array.from({length: 4}).map((_, i) => {
                  const p = wrap(f / 50 + i / 4 + k * 0.3, 1);
                  return <circle key={i} cx={190 + k * 70 + p * 60} cy={700 - k * 30 - p * 200} r={18 + p * 40} fill="#f1eef4" opacity={0.6 * (1 - p)} />;
                })}
              </g>
            ))}
            <rect x={0} y={860} width={380} height={230} fill="#7d8aa3" />
            <path d="M0,860 L60,800 L120,860 L180,800 L240,860 L300,800 L380,860Z" fill="#5b6378" />
            <rect x={40} y={920} width={120} height={80} rx={8} fill="#2a1f2f" />
            <rect x={48} y={928} width={104} height={64} rx={6} fill="#ff8a2b" opacity={0.65 + 0.35 * Math.sin(f / 4)} />
            <rect x={210} y={930} width={130} height={140} fill="#5b6378" />
            {/* refined output ingots */}
            {[0, 1, 2].map((k) => (
              <path key={k} d={`M${226 + k * 36},${1060} l8,-18 h24 l8,18z`} fill={['#c9d1de', '#ffd400', '#9fe8ff'][k]} opacity={io(f, [60 + k * 20, 70 + k * 20], [0, 1])} />
            ))}
          </g>
          {/* conveyor belt from pit to plant */}
          <g>
            <path d="M420,1060 L720,960" stroke="#3a3f52" strokeWidth={26} strokeLinecap="round" />
            <path d="M420,1060 L720,960" stroke="#6b7489" strokeWidth={6} strokeDasharray="12 10" strokeDashoffset={-f * 3} />
            {[0, 1, 2, 3, 4].map((k) => (
              <rect key={k} x={448 + k * 62} y={1056 - k * 21} width={8} height={70 + k * 21} fill="#3a3f52" />
            ))}
            {Array.from({length: 7}).map((_, i) => {
              const p = wrap(f / 70 + i / 7, 1);
              const x = 420 + p * 300;
              const y = 1060 - p * 100 - 18;
              return <polygon key={i} points="0,-12 10,-2 6,10 -6,10 -10,-2" fill={GEM[i % GEM.length]} stroke="#fff" strokeWidth={2} transform={`translate(${x} ${y}) rotate(${f * 2 + i * 40})`} />;
            })}
          </g>
        </g>
        {/* haul road with dump truck */}
        <rect y={1100} width={1080} height={60} fill="#5e3a2c" />
        <g transform={`translate(${truckX} 1150)`}>
          <path d="M-80,-40 L40,-40 L60,-80 L-90,-80Z" fill="#f2b233" />
          {Array.from({length: 4}).map((_, i) => (
            <circle key={i} cx={-60 + i * 30} cy={-86} r={14} fill={GEM[i]} />
          ))}
          <rect x={44} y={-74} width={40} height={36} rx={6} fill="#f2b233" />
          <rect x={52} y={-68} width={24} height={16} rx={3} fill="#bfe3ff" />
          <rect x={-82} y={-42} width={168} height={14} fill="#3a3f52" />
          <Wheel cx={-50} cy={-16} r={18} angle={f * 12} />
          <Wheel cx={60} cy={-16} r={18} angle={f * 12} />
        </g>
        <rect y={1160} width={1080} height={760} fill="#20142a" />
        {/* rare-earth element tiles */}
        {ELEMENTS.map((e, i) => {
          const p = pop(f, 38 + i * 6, 11, 140);
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = 120 + col * 300;
          const y = 300 + row * 190 + Math.sin(f / 14 + i) * 5;
          return p > 0.01 ? (
            <g key={e.s} transform={`translate(${x + 120} ${y + 80}) scale(${p}) rotate(${(1 - p) * 20})`}>
              <rect x={-120} y={-80} width={240} height={160} rx={22} fill="#120c22" opacity={0.92} stroke={e.c} strokeWidth={5} />
              <rect x={-120} y={-80} width={240} height={160} rx={22} fill={e.c} opacity={0.12 + 0.08 * Math.sin(f / 5 + i)} />
              <text x={-100} y={-44} fontFamily={FONT_BODY} fontWeight={800} fontSize={24} fill={e.c}>{e.n}</text>
              <text x={0} y={22} fontFamily={FONT_TITLE} fontSize={74} fill="#fff" textAnchor="middle">{e.s}</text>
              <text x={0} y={62} fontFamily={FONT_BODY} fontWeight={800} fontSize={22} fill="#e6dcff" textAnchor="middle">{e.name}</text>
            </g>
          ) : null;
        })}
        {/* supply chain strip */}
        <g opacity={io(f, [86, 100], [0, 1])}>
          <rect x={30} y={1172} width={1020} height={130} rx={24} fill="#0e0a1c" opacity={0.85} stroke="#ffd400" strokeOpacity={0.6} strokeWidth={2} />
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const x = 110 + k * 172;
            const p = pop(f, 92 + k * 8, 12, 140);
            return (
              <g key={k}>
                {k < 5 && (
                  <g>
                    <line x1={x + 46} y1={1237} x2={x + 126} y2={1237} stroke="#ffd400" strokeWidth={4} strokeDasharray="8 8" strokeDashoffset={-f * 2} opacity={chainP > k / 5 ? 1 : 0.15} />
                    <polygon points={`${x + 126},1229 ${x + 138},1237 ${x + 126},1245`} fill="#ffd400" opacity={chainP > k / 5 ? 1 : 0.15} />
                  </g>
                )}
                <g transform={`translate(${x} 1237) scale(${p})`}>
                  <circle r={44} fill="#1f1636" stroke={k === 0 ? '#c9a77a' : k === 1 ? '#9aa6bb' : k === 2 ? '#e8402a' : '#7ffcff'} strokeWidth={4} />
                  <ChainIcon kind={k} />
                </g>
              </g>
            );
          })}
        </g>
      </Canvas>
      <SubtitleBed opacity={0.45} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
