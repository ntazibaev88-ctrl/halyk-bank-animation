import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, Stars, SubtitleBed, Vignette} from '../components/Common';
import {JinMao, OrientalPearl, SWFC, ShanghaiTower, Tower, WindowPatterns} from '../components/Buildings';
import {Car, LightTrail} from '../components/Vehicles';
import {RobotArm} from '../components/Robot';
import {WavingFlag} from '../components/Flag';
import {easeInOut, easeOut, io, pop, rand, wrap} from '../lib/anim';
import {FONT_BODY} from '../theme';

const P = 'cn';
const BASE = 1020;

const TOWERS = Array.from({length: 18}).map((_, i) => ({
  x: 40 + i * 74 + rand(i + 2) * 20,
  h: 220 + rand(i * 7 + 1) * 360,
  w: 64 + rand(i * 3) * 30,
  color: ['#3b2a63', '#4a2f6e', '#2f2d5e', '#55306b'][i % 4],
  led: i % 3 === 0,
}));

// Drone light-show target: a lightning bolt (the EV symbol)
const BOLT: [number, number][] = [];
const boltPoly: [number, number][] = [[20, -150], [-70, 10], [-5, 10], [-30, 150], [70, -20], [5, -20], [20, -150]];
for (let i = 0; i < boltPoly.length - 1; i++) {
  const [x0, y0] = boltPoly[i];
  const [x1, y1] = boltPoly[i + 1];
  const n = 8;
  for (let k = 0; k < n; k++) BOLT.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
}

export const Scene03China: React.FC = () => {
  const {f} = useScene();
  const cam = io(f, [0, 125], [0, 1380], easeInOut) + io(f, [125, 242], [0, 90]);
  const farX = -cam * 0.3;
  const midX = -cam * 0.65;
  const nearX = -cam;
  const drones = io(f, [120, 175], [0, 1], easeInOut);
  const assembly = (f * 3.2) % 300;

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <linearGradient id="cn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#120a2c" />
            <stop offset="0.4" stopColor="#3d1046" />
            <stop offset="0.72" stopColor="#b8352d" />
            <stop offset="1" stopColor="#f6a43f" />
          </linearGradient>
          <linearGradient id="cn-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a1f3d" />
            <stop offset="1" stopColor="#140b26" />
          </linearGradient>
          <linearGradient id="cn-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#ffe6a0" stopOpacity={0.5} />
            <stop offset="1" stopColor="#ffe6a0" stopOpacity={0} />
          </linearGradient>
          <WindowPatterns prefix={P} lit="#ffd27a" dim="#2a1c48" />
        </defs>
        <rect width={1080} height={BASE + 10} fill="url(#cn-sky)" />
        <g opacity={0.7}>
          <Stars frame={f} n={70} h={520} seed={9} />
        </g>
        <circle cx={260 + farX * 0.1} cy={330} r={58} fill="#ffe9c4" opacity={0.9} />
        <circle cx={240 + farX * 0.1} cy={318} r={58} fill="#3d1046" opacity={0.15} />
        {/* searchlights */}
        {[0, 1, 2].map((k) => (
          <polygon key={k} points="-8,0 8,0 70,-900 -70,-900" fill="url(#cn-beam)" transform={`translate(${220 + k * 330 + midX * 0.3} ${BASE - 200}) rotate(${Math.sin(f / 25 + k * 2) * 24})`} opacity={0.6} />
        ))}
        {/* drone show forming the EV lightning bolt */}
        <g transform="translate(600 400)">
          {BOLT.map(([tx, ty], i) => {
            const sx = (rand(i) - 0.5) * 900;
            const sy = (rand(i + 40) - 0.5) * 400 + 80;
            const x = sx + (tx * 1.25 - sx) * drones;
            const y = sy + (ty * 1.25 - sy) * drones;
            const tw = 0.6 + 0.4 * Math.sin(f / 4 + i);
            const col = drones > 0.9 ? '#7ffcff' : i % 2 ? '#ffde00' : '#ff6a4a';
            return f > 112 ? (
              <g key={i}>
                <circle cx={x} cy={y} r={11} fill={col} opacity={0.25 * tw} />
                <circle cx={x} cy={y} r={5} fill={col} opacity={tw} />
              </g>
            ) : null;
          })}
        </g>
        {/* far skyline */}
        <g transform={`translate(${farX} 0)`} opacity={0.6}>
          {Array.from({length: 34}).map((_, i) => {
            const h = 140 + rand(i * 5 + 2) * 260;
            return <rect key={i} x={i * 60} y={BASE - h} width={52} height={h} fill="#5b2a6b" />;
          })}
        </g>
        {/* mid layer: Pudong skyline */}
        <g transform={`translate(${midX} 0)`}>
          {TOWERS.map((t, i) => (
            <g key={i}>
              <Tower x={t.x} base={BASE} w={t.w} h={t.h} color={t.color} prefix={P} seed={i + 30} frame={f} pattern={i % 2 ? 'win' : 'grid'} roof={i % 4 === 1 ? 'spire' : 'flat'} />
              {t.led && (
                <rect x={t.x + 6} y={BASE - t.h + 20} width={t.w * 0.6} height={t.h - 40}
                  fill={['#ff3b6b', '#ffde00', '#3bf0ff', '#ff8a2b'][Math.floor(f / 18 + i) % 4]} opacity={0.22} />
              )}
            </g>
          ))}
          <OrientalPearl x={300} base={BASE} s={0.95} frame={f} />
          <JinMao x={690} base={BASE} s={0.85} prefix={P} frame={f} />
          <SWFC x={860} base={BASE} s={0.88} prefix={P} />
          <ShanghaiTower x={1040} base={BASE} s={0.88} frame={f} prefix={P} />
        </g>
        {/* near layer: Shenzhen-style EV factory (cut-away) */}
        <g transform={`translate(${nearX} 0)`}>
          <g transform="translate(1440 0)">
            {/* roof with solar panels */}
            <path d="M0,520 L120,440 L120,520 L240,440 L240,520 L360,440 L360,520 L480,440 L480,520 L600,440 L600,520 L720,440 L720,520 L840,440 L840,520 Z" fill="#2e3a66" />
            {Array.from({length: 7}).map((_, i) => (
              <path key={i} d={`M${i * 120 + 6},516 L${i * 120 + 116},446 L${i * 120 + 116},470 L${i * 120 + 40},516 Z`} fill="#3b6fd8" opacity={0.85} />
            ))}
            <rect x={0} y={520} width={840} height={BASE - 520} fill="#d9e2f2" />
            <rect x={24} y={560} width={792} height={BASE - 580} fill="#eef3fb" />
            {/* overhead lights */}
            {Array.from({length: 6}).map((_, i) => (
              <g key={i}>
                <rect x={80 + i * 130} y={566} width={70} height={10} rx={5} fill="#fffbe6" />
                <polygon points={`${80 + i * 130},576 ${150 + i * 130},576 ${180 + i * 130},760 ${50 + i * 130},760`} fill="#fff8d6" opacity={0.25} />
              </g>
            ))}
            {/* big screen */}
            <rect x={560} y={600} width={220} height={120} rx={10} fill="#0f1a3a" />
            <rect x={590} y={640} width={130} height={50} rx={8} fill="none" stroke="#7ffcff" strokeWidth={6} />
            <rect x={720} y={655} width={10} height={20} fill="#7ffcff" />
            <rect x={598} y={648} width={114 * ((f % 90) / 90)} height={34} rx={4} fill="#49f28a" />
            <text x={670} y={625} fontFamily={FONT_BODY} fontWeight={800} fontSize={18} fill="#7ffcff" textAnchor="middle">ЗАРЯДКА</text>
            {/* conveyor */}
            <rect x={24} y={930} width={792} height={30} fill="#3a3f52" />
            {Array.from({length: 24}).map((_, i) => (
              <circle key={i} cx={40 + i * 33} cy={945} r={9} fill="#6b7489" stroke="#2a2f3d" strokeWidth={2} transform={`rotate(${f * 12} ${40 + i * 33} 945)`} />
            ))}
            {/* car bodies moving along the line */}
            <clipPath id="cn-line">
              <rect x={24} y={560} width={792} height={460} />
            </clipPath>
            <g clipPath="url(#cn-line)">
              {[0, 1, 2, 3].map((k) => {
                const x = -150 + ((assembly + k * 300) % 1200);
                const done = x > 520;
                return <Car key={k} x={x} y={930} s={1.25} body={done ? '#e9f1ff' : '#b9c3d6'} kind="ev" dist={0} />;
              })}
            </g>
            {/* robots welding */}
            {[0, 1, 2].map((k) => {
              const t = f / 30 + k * 1.3;
              return (
                <RobotArm key={k} x={170 + k * 230} y={1010} s={0.62} frame={f + k * 7}
                  a1={-30 + Math.sin(t * 1.6) * 18} a2={110 + Math.sin(t * 2.1 + 1) * 22} a3={40 + Math.sin(t * 2.7) * 25}
                  color={k === 1 ? '#e8402a' : '#f2b233'} sparks={Math.sin(t * 3) > 0 ? 1 : 0} />
              );
            })}
            {/* glass mullions + reflections */}
            {Array.from({length: 8}).map((_, i) => (
              <rect key={i} x={24 + i * 113} y={560} width={6} height={BASE - 580} fill="#9fb2d6" />
            ))}
            <polygon points="100,560 220,560 60,1000 0,1000" fill="#fff" opacity={0.12} />
            <polygon points="480,560 540,560 380,1000 350,1000" fill="#fff" opacity={0.1} />
            <rect x={0} y={520} width={840} height={40} fill="#c7342a" />
            <text x={420} y={550} fontFamily={FONT_BODY} fontWeight={900} fontSize={26} fill="#ffde00" textAnchor="middle" letterSpacing={3}>ЗАВОД ЭЛЕКТРОМОБИЛЕЙ</text>
          </g>
          <WavingFlag kind="cn" id="cn-factory-flag" x={2330} y={330} w={170} frame={f} poleH={690} />
        </g>
        {/* river */}
        <rect x={0} y={BASE} width={1080} height={90} fill="url(#cn-water)" />
        {Array.from({length: 22}).map((_, i) => {
          const x = wrap(rand(i) * 1200 + midX, 1200) - 60;
          return (
            <rect key={i} x={x + Math.sin(f / 8 + i) * 8} y={BASE + 10 + (i % 6) * 13} width={30 + rand(i + 1) * 60} height={4} rx={2}
              fill={['#ffde00', '#ff6a8a', '#7ffcff'][i % 3]} opacity={0.35 + 0.25 * Math.sin(f / 5 + i)} />
          );
        })}
        {/* elevated highway with EVs */}
        <rect x={0} y={1110} width={1080} height={24} fill="#40345f" />
        <rect x={0} y={1106} width={1080} height={5} fill="#ffde00" opacity={0.7} />
        <g transform={`translate(${-wrap(cam, 200)} 0)`}>
          {Array.from({length: 8}).map((_, i) => (
            <rect key={i} x={i * 200 + 60} y={1134} width={26} height={160} fill="#2c2448" />
          ))}
        </g>
        {Array.from({length: 4}).map((_, i) => {
          const d = f * (16 + i * 2) + i * 380;
          const x = wrap(d - cam * 0.4, 1600) - 250;
          return (
            <g key={'e' + i}>
              <LightTrail x={x - 70} y={1080} len={260} color={i % 2 ? '#7ffcff' : '#ffde00'} />
              <Car x={x} y={1106} s={0.82} body={['#ffffff', '#e8402a', '#2fd3c7', '#ffde00'][i]} kind="ev" dist={d} />
            </g>
          );
        })}
        <rect x={0} y={1294} width={1080} height={626} fill="#140b26" />
        {Array.from({length: 60}).map((_, i) => (
          <circle key={'cl' + i} cx={wrap(rand(i) * 1300 - cam * 0.8, 1300) - 110} cy={1310 + rand(i + 9) * 600} r={2 + rand(i + 4) * 3}
            fill={['#ffd27a', '#ff6a8a', '#7ffcff'][i % 3]} opacity={0.25 + 0.2 * Math.sin(f / 6 + i)} />
        ))}
        {/* tech-growth chips floating up when "технологии" is said */}
        {[0, 1, 2].map((k) => {
          const p = pop(f, 140 + k * 8, 12, 120);
          const up = io(f, [140 + k * 8, 242], [0, 60], easeOut);
          return p > 0.01 ? (
            <g key={k} transform={`translate(${190} ${330 + k * 150 - up * 0.4}) scale(${p})`}>
              <rect x={-54} y={-38} width={108} height={76} rx={16} fill="#1b0f33" stroke="#ffde00" strokeWidth={4} opacity={0.92} />
              <text x={0} y={14} fontFamily={FONT_BODY} fontWeight={900} fontSize={36} fill="#ffde00" textAnchor="middle">{['5G', 'EV', 'AI'][k]}</text>
            </g>
          ) : null;
        })}
      </Canvas>
      <SubtitleBed opacity={0.45} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
