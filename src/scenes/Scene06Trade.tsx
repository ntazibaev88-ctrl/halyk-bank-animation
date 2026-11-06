import React from 'react';
import {AbsoluteFill} from 'remotion';
import {geoInterpolate, geoNaturalEarth1, geoPath} from 'd3-geo';
import {useScene} from '../components/SceneShell';
import {Canvas, SubtitleBed, Vignette} from '../components/Common';
import {CargoShip, Crane} from '../components/Vehicles';
import {CHINA, LonLat, PLACES, USA, land} from '../lib/geo';
import {easeOut, io, pop, rand, wrap} from '../lib/anim';
import {FONT_BODY} from '../theme';

const MAP = {x0: 50, y0: 300, x1: 1030, y1: 790};
const proj = geoNaturalEarth1().rotate([-150, 0]).fitExtent([[MAP.x0 + 10, MAP.y0 + 10], [MAP.x1 - 10, MAP.y1 - 10]], {type: 'Sphere'});
const path = geoPath(proj);
const SPHERE = path({type: 'Sphere'}) ?? '';
const LAND = path(land) ?? '';
const US_D = path(USA) ?? '';
const CN_D = path(CHINA) ?? '';

const densify = (pts: LonLat[], n = 24): LonLat[] => {
  const out: LonLat[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const ip = geoInterpolate(pts[i], pts[i + 1]);
    for (let k = 0; k < n; k++) out.push(ip(k / n) as LonLat);
  }
  out.push(pts[pts.length - 1]);
  return out;
};

const ROUTES = [
  {color: '#ffd400', pts: densify([PLACES.shanghai, [150, 36], [-170, 42], [-140, 38], PLACES.losAngeles])},
  {color: '#ff6a4a', pts: densify([PLACES.shenzhen, [110, 10], PLACES.singapore, [80, 6], [60, 13], [45, 12.5], [38, 20], PLACES.suez, [28, 33.5], [15, 36], [-6, 36], [-10, 44], [-4, 48.5], PLACES.rotterdam], 10)},
  {color: '#7fd0ff', pts: densify([PLACES.shanghai, [140, 28], [180, 22], [-140, 16], [-100, 9], PLACES.panama, [-78, 15], [-74, 26], PLACES.newYork], 12)},
  {color: '#9dff8a', pts: densify([PLACES.houston, [-88, 24], [-60, 30], [-20, 38], [-6, 36], [15, 36], [28, 33.5], PLACES.suez, [45, 12.5], [80, 6], PLACES.singapore, [115, 15], PLACES.shanghai], 10)},
];
const routeD = ROUTES.map((r) => {
  // project per point and break where the line wraps around the map edge
  let d = '';
  let prev: [number, number] | null = null;
  for (const p of r.pts) {
    const xy = proj(p) as [number, number];
    if (!prev || Math.abs(xy[0] - prev[0]) > 300) d += `M${xy[0].toFixed(1)},${xy[1].toFixed(1)}`;
    else d += `L${xy[0].toFixed(1)},${xy[1].toFixed(1)}`;
    prev = xy;
  }
  return d;
});
const at = (r: number, t: number) => {
  const pts = ROUTES[r].pts;
  const i = Math.min(pts.length - 1, Math.floor(t * (pts.length - 1)));
  return proj(pts[i]) as [number, number];
};

const HORIZON = 840;

export const Scene06Trade: React.FC = () => {
  const {f} = useScene();
  const panel = pop(f, 6, 13, 110);
  const linkP = io(f, [100, 140], [0, 1], easeOut);
  const shipX = io(f, [0, 239], [1250, 330], (t) => t);
  const rock = Math.sin(f / 14) * 1.6;
  const bob = Math.sin(f / 14 + 1) * 6;
  const us = proj(PLACES.losAngeles) as [number, number];
  const cn = proj(PLACES.shanghai) as [number, number];

  return (
    <AbsoluteFill>
      <Canvas>
        <defs>
          <linearGradient id="tr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f7fd8" />
            <stop offset="1" stopColor="#bfe8ff" />
          </linearGradient>
          <linearGradient id="tr-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a8ad6" />
            <stop offset="0.4" stopColor="#1567b4" />
            <stop offset="1" stopColor="#082c62" />
          </linearGradient>
          <clipPath id="tr-map-clip">
            <path d={SPHERE} />
          </clipPath>
        </defs>
        <rect width={1080} height={HORIZON} fill="url(#tr-sky)" />
        {/* clouds */}
        {Array.from({length: 5}).map((_, i) => (
          <g key={i} transform={`translate(${wrap(rand(i) * 1300 + f * (0.5 + rand(i + 1)), 1400) - 200} ${560 + rand(i + 3) * 220})`} fill="#fff" opacity={0.85}>
            <ellipse rx={90} ry={30} />
            <ellipse cx={-50} cy={8} rx={56} ry={24} />
            <ellipse cx={40} cy={-16} rx={56} ry={32} />
          </g>
        ))}
        {/* sea */}
        <rect y={HORIZON} width={1080} height={1920 - HORIZON} fill="url(#tr-sea)" />
        <rect y={HORIZON - 2} width={1080} height={6} fill="#e8f6ff" opacity={0.6} />
        {/* distant ship */}
        <CargoShip x={wrap(-200 + f * 2.2, 1500) - 200} y={HORIZON + 6} s={0.22} frame={f} seed={3} dir={1} rock={Math.sin(f / 10) * 1} />
        {/* port with crane on the left */}
        <g>
          <rect x={0} y={930} width={330} height={60} fill="#7b8396" />
          <rect x={0} y={984} width={330} height={14} fill="#4b5266" />
          {Array.from({length: 3}).map((_, r) =>
            Array.from({length: 3}).map((__, c) => (
              <rect key={`${r}-${c}`} x={20 + c * 62} y={900 - r * 30} width={58} height={28} fill={['#d94a3a', '#2f6fd6', '#f2b233', '#2fae7a'][(r + c * 2) % 4]} />
            )),
          )}
          <Crane x={260} y={932} s={0.62} t={((f / 90) % 1)} />
          {/* moving container truck on the dock */}
          <g transform={`translate(${wrap(f * 3, 420) - 60} 930)`}>
            <rect x={-40} y={-30} width={70} height={26} fill="#2fae7a" />
            <rect x={32} y={-26} width={22} height={22} rx={3} fill="#e9edf3" />
            <circle cx={-26} cy={-2} r={7} fill="#1b1f2a" />
            <circle cx={40} cy={-2} r={7} fill="#1b1f2a" />
          </g>
        </g>
        {/* wave rows behind the ship */}
        {[0, 1].map((row) => (
          <path key={row}
            d={`M-100,${960 + row * 70} ` + Array.from({length: 16}).map((_, i) => `q40,-${14 + row * 4} 80,0`).join(' ') + ` L1300,1920 L-100,1920 Z`}
            fill={row ? '#1567b4' : '#1d76c4'} opacity={0.9}
            transform={`translate(${-wrap(f * (1.5 + row), 80)} ${Math.sin(f / 12 + row) * 4})`} />
        ))}
        {/* main cargo ship crossing */}
        <g>
          <ellipse cx={shipX} cy={1145} rx={360} ry={22} fill="#e8f6ff" opacity={0.25} />
          <CargoShip x={shipX} y={1108 + bob} s={1.05} frame={f} rock={rock} dir={-1} seed={1} />
          {/* bow wave foam */}
          {Array.from({length: 6}).map((_, i) => (
            <circle key={i} cx={shipX - 330 - i * 14 + Math.sin(f / 3 + i) * 4} cy={1146 + Math.sin(f / 4 + i) * 3} r={10 - i} fill="#fff" opacity={0.8 - i * 0.1} />
          ))}
        </g>
        {/* foreground waves */}
        {[0, 1, 2].map((row) => (
          <path key={row}
            d={`M-100,${1160 + row * 60} ` + Array.from({length: 14}).map(() => `q50,-${18 - row * 3} 100,0`).join(' ') + ` L1300,1920 L-100,1920 Z`}
            fill={['#1a6fbf', '#135aa3', '#0d4687'][row]}
            transform={`translate(${-wrap(f * (2.5 + row * 0.8) + row * 30, 100)} ${Math.sin(f / 10 + row * 2) * 6})`} />
        ))}
        {Array.from({length: 18}).map((_, i) => (
          <rect key={i} x={wrap(rand(i) * 1100 - f * (1 + rand(i + 2)), 1150) - 40} y={1250 + rand(i + 5) * 600} width={40 + rand(i) * 60} height={4} rx={2} fill="#bfe8ff" opacity={0.3} />
        ))}
        {/* seagulls */}
        {Array.from({length: 4}).map((_, i) => {
          const x = wrap(rand(i) * 1100 + f * (2 + rand(i + 1)), 1300) - 100;
          const y = 880 - rand(i + 2) * 90 + Math.sin(f / 9 + i) * 10;
          const flap = Math.sin(f / 3 + i) * 10;
          return <path key={i} d={`M${x - 22},${y + flap} Q${x - 10},${y - 8} ${x},${y} Q${x + 10},${y - 8} ${x + 22},${y + flap}`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />;
        })}
        {/* world map with trade routes */}
        <g transform={`translate(540 ${MAP.y0}) scale(${panel}) translate(-540 ${-MAP.y0})`} opacity={Math.min(1, panel)}>
          <rect x={MAP.x0 - 16} y={MAP.y0 - 60} width={MAP.x1 - MAP.x0 + 32} height={MAP.y1 - MAP.y0 + 76} rx={28} fill="#06142e" opacity={0.9} stroke="#7fd0ff" strokeWidth={3} />
          <text x={MAP.x0 + 14} y={MAP.y0 - 18} fontFamily={FONT_BODY} fontWeight={900} fontSize={30} fill="#fff" letterSpacing={2}>МОРСКИЕ ТОРГОВЫЕ ПУТИ</text>
          <path d={SPHERE} fill="#0e3a6e" />
          <g clipPath="url(#tr-map-clip)">
            <path d={LAND} fill="#5b7fa8" stroke="#8fb4dd" strokeWidth={1} />
            <path d={US_D} fill="#3d6fe0" stroke="#cfe0ff" strokeWidth={1.5} />
            <path d={CN_D} fill="#de2910" stroke="#ffde00" strokeWidth={1.5} />
            {routeD.map((d, i) => {
              const p = io(f, [16 + i * 10, 70 + i * 10], [0, 1], easeOut);
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke={ROUTES[i].color} strokeWidth={4} opacity={0.35} pathLength={1} strokeDasharray={`${p} 1`} />
                  <path d={d} fill="none" stroke={ROUTES[i].color} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-f * 1.5} opacity={p >= 1 ? 1 : 0} />
                </g>
              );
            })}
            {ROUTES.map((_, i) =>
              [0, 1, 2].map((k) => {
                const t = wrap(f / 150 + k / 3 + i * 0.13, 1);
                const [x, y] = at(i, t);
                return f > 40 + i * 10 ? (
                  <g key={`${i}-${k}`} transform={`translate(${x} ${y})`}>
                    <rect x={-9} y={-5} width={18} height={10} rx={3} fill="#fff" />
                    <rect x={-6} y={-9} width={8} height={5} fill={ROUTES[i].color} />
                  </g>
                ) : null;
              }),
            )}
          </g>
          {/* USA <-> China trade link */}
          {linkP > 0 && (
            <g>
              <path d={`M${cn[0]},${cn[1]} Q${(cn[0] + us[0]) / 2},${cn[1] - 170} ${us[0]},${us[1]}`} fill="none" stroke="#ffd400" strokeWidth={8} pathLength={1} strokeDasharray={`${linkP} 1`} strokeLinecap="round" />
              <path d={`M${us[0]},${us[1]} Q${(cn[0] + us[0]) / 2},${cn[1] + 120} ${cn[0]},${cn[1]}`} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${linkP} 1`} strokeLinecap="round" opacity={0.8} />
              {[cn, us].map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={10 + 6 * Math.sin(f / 5)} fill="none" stroke="#ffd400" strokeWidth={4} />
              ))}
            </g>
          )}
        </g>
      </Canvas>
      <SubtitleBed opacity={0.4} />
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};
