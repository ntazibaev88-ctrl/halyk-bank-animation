import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, SubtitleBed, Vignette} from '../components/Common';
import {Capitol, Chrysler, EmpireState, Liberty, OneWTC, Tower, WashingtonMonument, WindowPatterns} from '../components/Buildings';
import {Car, Train} from '../components/Vehicles';
import {WavingFlag} from '../components/Flag';
import {easeInOut, easeOut, io, pop, rand, wrap} from '../lib/anim';
import {FONT_BODY, FONT_TITLE} from '../theme';

const P = 'us';
const camAt = (f: number) => io(f, [0, 200], [0, 1400], easeInOut);
const MID = 0.75;

// procedurally laid out Manhattan towers (world x for the mid layer)
const TOWERS = Array.from({length: 24}).map((_, i) => {
  const x = 880 + i * 62 + rand(i + 3) * 30;
  const h = 260 + rand(i * 5) * 420;
  const palette = ['#5b6fb3', '#4a5c9e', '#6c80c4', '#7a6fb0', '#3f5592', '#8a99cf'];
  const roofs = ['flat', 'antenna', 'stepped', 'spire', 'flat', 'slant'] as const;
  return {x, h, w: 70 + rand(i * 9) * 40, color: palette[i % palette.length], roof: roofs[i % roofs.length], seed: i + 1};
});

const enterFrame = (worldX: number, factor: number) => {
  for (let f = 0; f <= 220; f += 4) if (worldX - camAt(f) * factor < 1120) return f;
  return 220;
};
const DELAYS = TOWERS.map((t) => Math.max(0, enterFrame(t.x, MID) - 14));

const TechIcon: React.FC<{x: number; y: number; p: number; kind: number; f: number}> = ({x, y, p, kind, f}) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 12 + kind) * 8}) scale(${p})`} opacity={Math.min(1, p)}>
    <circle r={58} fill="#0d1a3d" stroke="#7fb2ff" strokeWidth={5} />
    <circle r={74} fill="none" stroke="#7fb2ff" strokeWidth={2} opacity={0.5} strokeDasharray="6 10" transform={`rotate(${f * 2})`} />
    {kind === 0 && (
      <g>
        <rect x={-24} y={-24} width={48} height={48} rx={6} fill="#3d6fe0" />
        {[-14, 0, 14].map((d) => (
          <g key={d} stroke="#bcd3ff" strokeWidth={4}>
            <line x1={d} y1={-24} x2={d} y2={-36} />
            <line x1={d} y1={24} x2={d} y2={36} />
            <line x1={-24} y1={d} x2={-36} y2={d} />
            <line x1={24} y1={d} x2={36} y2={d} />
          </g>
        ))}
        <rect x={-10} y={-10} width={20} height={20} fill="#ffd400" />
      </g>
    )}
    {kind === 1 && <path d="M-30,14 C-44,14 -44,-8 -28,-8 C-26,-26 2,-30 8,-12 C24,-20 38,-6 30,10 C34,14 30,14 26,14 Z" fill="#e8f0ff" />}
    {kind === 2 && (
      <g>
        <rect x={-20} y={-34} width={40} height={68} rx={8} fill="#e8f0ff" />
        <rect x={-15} y={-26} width={30} height={46} rx={3} fill="#3d6fe0" />
        <circle cy={27} r={3} fill="#3d6fe0" />
      </g>
    )}
    {kind === 3 && (
      <g fill="none" stroke="#e8f0ff" strokeWidth={5}>
        <circle r={10} fill="#ffd400" stroke="none" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line x1={0} y1={-12} x2={0} y2={-26} />
            <circle cy={-32} r={6} fill="#e8f0ff" />
          </g>
        ))}
      </g>
    )}
  </g>
);

export const Scene02USA: React.FC = () => {
  const {f} = useScene();
  const cam = camAt(f);
  const farX = -cam * 0.35;
  const midX = -cam * MID;
  const nearX = -cam * 1.0;
  const panelP = pop(f, 88, 13, 120);
  const jetsP = io(f, [118, 178], [0, 1], (t) => t);
  const iconsP = [0, 1, 2, 3].map((k) => pop(f, 150 + k * 7, 11, 140));
  const trainX = 1500 - (f - 30) * 18;

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <linearGradient id="us-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d3a8f" />
            <stop offset="0.45" stopColor="#4f80dc" />
            <stop offset="0.75" stopColor="#f7b98a" />
            <stop offset="1" stopColor="#ffd9a0" />
          </linearGradient>
          <radialGradient id="us-sun">
            <stop offset="0" stopColor="#fff6d6" />
            <stop offset="0.35" stopColor="#ffd27a" stopOpacity={0.9} />
            <stop offset="1" stopColor="#ffb36b" stopOpacity={0} />
          </radialGradient>
          <WindowPatterns prefix={P} lit="#ffe9b0" />
        </defs>
        <rect width={1080} height={1150} fill="url(#us-sky)" />
        {/* sun & rays */}
        <g transform={`translate(${800 + farX * 0.2} 760)`}>
          <g transform={`rotate(${f * 0.25})`} opacity={0.18}>
            {Array.from({length: 12}).map((_, i) => (
              <polygon key={i} points="-14,0 14,0 0,-520" fill="#fff3c9" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r={260} fill="url(#us-sun)" />
          <circle r={70} fill="#fff1c7" />
        </g>
        {/* clouds */}
        {Array.from({length: 6}).map((_, i) => {
          const x = wrap(rand(i) * 1400 + f * (0.4 + rand(i + 4) * 0.5) - cam * 0.12, 1500) - 220;
          const y = 300 + rand(i + 8) * 380;
          const s = 0.7 + rand(i + 2) * 0.8;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.75}>
              <ellipse cx={0} cy={0} rx={90} ry={34} />
              <ellipse cx={-50} cy={8} rx={60} ry={26} />
              <ellipse cx={40} cy={-18} rx={58} ry={36} />
            </g>
          );
        })}
        {/* far skyline */}
        <g transform={`translate(${farX} 0)`} opacity={0.55}>
          {Array.from({length: 30}).map((_, i) => {
            const x = 600 + i * 58;
            const h = 160 + rand(i * 3 + 1) * 280;
            return <rect key={i} x={x} y={1100 - h} width={50} height={h} fill="#8ea3d8" />;
          })}
        </g>
        {/* mid layer: Washington then Manhattan */}
        <g transform={`translate(${midX} 0)`}>
          <WashingtonMonument x={660} base={1100} s={0.9} />
          <Capitol x={330} base={1100} s={0.95} />
          {Array.from({length: 9}).map((_, i) => (
            <g key={i} transform={`translate(${60 + i * 92} 1100)`}>
              <rect x={-4} y={-30} width={8} height={30} fill="#5b4532" />
              <circle cx={0} cy={-46} r={26 + (i % 3) * 4} fill={i % 2 ? '#3f8f4f' : '#4fa35d'} />
            </g>
          ))}
          {TOWERS.map((t, i) => (
            <Tower key={i} x={t.x} base={1100} w={t.w} h={t.h} color={t.color} prefix={P} roof={t.roof} seed={t.seed} frame={f} rise={pop(f, DELAYS[i], 13, 110)} />
          ))}
          <EmpireState x={1290} base={1100} s={0.95} prefix={P} frame={f} />
          <Chrysler x={1560} base={1100} s={0.9} prefix={P} />
          <OneWTC x={1960} base={1100} s={0.9} prefix={P} frame={f} />
          {/* ticker board */}
          <g transform="translate(1660 900)">
            <rect x={0} y={0} width={340} height={56} rx={6} fill="#0b0f1e" stroke="#ffd400" strokeWidth={3} />
            <clipPath id="us-ticker">
              <rect x={6} y={4} width={328} height={48} />
            </clipPath>
            <g clipPath="url(#us-ticker)">
              <text x={340 - wrap(f * 6, 1100)} y={38} fontFamily={FONT_BODY} fontWeight={800} fontSize={28} fill="#49f28a">
                NYSE ▲ NASDAQ ▲ DOW JONES ▲ S&amp;P 500 ▲ USD ▲ NYSE ▲ NASDAQ ▲
              </text>
            </g>
          </g>
        </g>
        {/* fighter jets flyover with tri-colour smoke */}
        {jetsP > 0 && jetsP < 1 &&
          [0, 1, 2].map((k) => {
            const jx = -200 + jetsP * 1500 - k * 70;
            const jy = 520 - jetsP * 140 + k * 46;
            const col = ['#e8364a', '#ffffff', '#3d6fe0'][k];
            return (
              <g key={k}>
                <path d={`M${jx - 600},${jy + 40} Q${jx - 300},${jy + 18} ${jx - 30},${jy}`} stroke={col} strokeWidth={16} fill="none" opacity={0.55} strokeLinecap="round" />
                <g transform={`translate(${jx} ${jy}) rotate(-6)`}>
                  <path d="M-46,0 L30,-6 L52,0 L30,6 Z" fill="#9aa7bd" />
                  <path d="M-6,-4 L-24,-30 L-14,-30 L12,-4 Z" fill="#7d8aa3" />
                  <path d="M-6,4 L-24,28 L-14,28 L12,4 Z" fill="#6b778f" />
                  <path d="M-40,-2 L-50,-18 L-42,-18 L-30,-2 Z" fill="#7d8aa3" />
                  <ellipse cx={22} cy={-3} rx={10} ry={4} fill="#bfe3ff" />
                </g>
              </g>
            );
          })}
        {/* Statue of Liberty on its island */}
        <g transform={`translate(${nearX} 0)`}>
          <ellipse cx={2330} cy={1104} rx={150} ry={18} fill="#3c7a52" />
          <Liberty x={2330} base={1100} s={0.85} frame={f} />
        </g>
        {/* ground, viaduct and train */}
        <rect x={0} y={1100} width={1080} height={820} fill="#1a2240" />
        <rect x={0} y={1100} width={1080} height={26} fill="#5d6680" />
        <g transform={`translate(${wrap(nearX, 160) - 160} 0)`}>
          {Array.from({length: 9}).map((_, i) => (
            <rect key={i} x={i * 160 + 40} y={1036} width={20} height={70} fill="#4b5470" />
          ))}
        </g>
        <rect x={0} y={1024} width={1080} height={16} fill="#3a4360" />
        <Train x={trainX} y={1024} cars={6} dist={f * 18} />
        <rect x={0} y={1036} width={1080} height={8} fill="#2a3048" />
        {/* road */}
        <rect x={0} y={1140} width={1080} height={150} fill="#2b3046" />
        <g transform={`translate(${-wrap(cam, 120)} 0)`}>
          {Array.from({length: 11}).map((_, i) => (
            <rect key={i} x={i * 120} y={1212} width={64} height={6} rx={3} fill="#f7d36b" opacity={0.8} />
          ))}
        </g>
        {Array.from({length: 4}).map((_, i) => {
          const d = f * (9 + i) + i * 340;
          const x = wrap(d - cam * 0.6, 1500) - 200;
          return <Car key={'r' + i} x={x} y={1205} s={0.85} body={i === 2 ? '#e8364a' : '#ffc61a'} kind={i === 2 ? 'sedan' : 'taxi'} dist={d} dir={1} />;
        })}
        {Array.from({length: 3}).map((_, i) => {
          const d = f * (10 + i * 2) + i * 520;
          const x = 1300 - wrap(d + cam * 0.6, 1600);
          return <Car key={'l' + i} x={x} y={1280} s={0.9} body={i === 1 ? '#2d5bd7' : '#ffc61a'} kind={i === 1 ? 'bus' : 'taxi'} dist={d} dir={-1} />;
        })}
        {/* river with shimmering reflections */}
        <rect x={0} y={1290} width={1080} height={630} fill="#14254f" />
        <rect x={0} y={1290} width={1080} height={10} fill="#0c1430" />
        {Array.from({length: 26}).map((_, i) => {
          const y = 1320 + (i % 13) * 46;
          const x = wrap(rand(i) * 1200 - cam * 0.9 + Math.sin(f / 10 + i) * 14, 1200) - 60;
          const w = 40 + rand(i + 3) * 120;
          return <rect key={i} x={x} y={y} width={w} height={5} rx={2.5} fill={i % 3 ? '#ffd79a' : '#8fb4ff'} opacity={0.25 + 0.2 * Math.sin(f / 7 + i)} />;
        })}
        {/* foreground flag (screen-fixed) */}
        <WavingFlag kind="us" id="usa-flag" x={70} y={300} w={330} frame={f} poleH={1100} amp={1.1} />
        {/* financial panel: the dollar */}
        {panelP > 0.01 && (
          <g transform={`translate(800 470) scale(${panelP}) translate(-800 -470)`} opacity={Math.min(1, panelP)}>
            <rect x={590} y={330} width={430} height={290} rx={26} fill="#0b1433" opacity={0.88} stroke="#7fb2ff" strokeWidth={3} />
            <circle cx={660} cy={400} r={42} fill="#2fae5f" stroke="#c9f5d8" strokeWidth={4} />
            <text x={660} y={418} fontFamily={FONT_TITLE} fontSize={52} fill="#fff" textAnchor="middle">$</text>
            <text x={720} y={392} fontFamily={FONT_BODY} fontWeight={900} fontSize={34} fill="#fff">USD</text>
            <text x={720} y={426} fontFamily={FONT_BODY} fontWeight={700} fontSize={22} fill="#9fbaf0">РЕЗЕРВНАЯ ВАЛЮТА</text>
            {(() => {
              const pts = Array.from({length: 12}).map((_, i) => [620 + i * 34, 590 - i * 9 - Math.sin(i * 1.7) * 18 - (i > 8 ? (i - 8) * 6 : 0)] as const);
              const n = io(f, [96, 150], [1, pts.length], easeOut);
              const vis = pts.slice(0, Math.floor(n));
              const d = vis.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
              const last = vis[vis.length - 1];
              return (
                <g>
                  {pts.map((p, i) => (
                    <rect key={i} x={p[0] - 9} y={p[1] + 10} width={18} height={600 - p[1] - 10} fill="#3d6fe0" opacity={i < n ? 0.35 : 0} />
                  ))}
                  <path d={d} stroke="#49f28a" strokeWidth={6} fill="none" strokeLinejoin="round" />
                  {last && <circle cx={last[0]} cy={last[1]} r={9} fill="#49f28a" stroke="#fff" strokeWidth={3} />}
                </g>
              );
            })()}
          </g>
        )}
        {/* tech companies */}
        {iconsP.map((p, k) => (p > 0.01 ? <TechIcon key={k} x={330 + k * 190} y={720 + (k % 2) * 70} p={p} kind={k} f={f} /> : null))}
      </Canvas>
      <SubtitleBed opacity={0.5} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};
