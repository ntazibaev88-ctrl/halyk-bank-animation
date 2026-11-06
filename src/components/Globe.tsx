import React, {useMemo} from 'react';
import {geoCircle, geoDistance, geoGraticule10, geoOrthographic, geoPath} from 'd3-geo';
import {CHINA, LonLat, USA, land} from '../lib/geo';
import {rand, safeId} from '../lib/anim';

// Cloud clusters in geographic coordinates; they drift eastwards over time.
const CLOUDS = Array.from({length: 22}).map((_, i) => {
  const lon = rand(i + 1) * 360 - 180;
  const lat = (rand(i + 50) - 0.5) * 130;
  const blobs = Array.from({length: 4}).map((__, k) => ({
    dl: (rand(i * 10 + k) - 0.5) * 9,
    dp: (rand(i * 10 + k + 5) - 0.5) * 4,
    r: 2.2 + rand(i * 7 + k) * 3.2,
  }));
  return {lon, lat, blobs, speed: 0.06 + rand(i + 99) * 0.08};
});

const graticule = geoGraticule10();

export type GlobeArc = {from: LonLat; to: LonLat; color: string; progress: number; lift?: number; width?: number; id: string};

export const Globe: React.FC<{
  id: string;
  cx: number;
  cy: number;
  r: number;
  rotate: [number, number, number?];
  frame: number;
  highlight?: number; // 0..1 how strongly USA/China glow
  clouds?: boolean;
  night?: number; // 0..1 darken + city lights
  markers?: {at: LonLat; color: string; pulse?: boolean; size?: number}[];
  arcs?: GlobeArc[];
}> = ({id, cx, cy, r, rotate, frame, highlight = 1, clouds = true, night = 0, markers = [], arcs = []}) => {
  const sid = safeId(id);
  const proj = useMemo(() => geoOrthographic(), []);
  proj.scale(r).translate([cx, cy]).rotate([rotate[0], rotate[1], rotate[2] ?? 0]).clipAngle(90);
  const path = geoPath(proj);
  const center: LonLat = [-rotate[0], -rotate[1]];
  const visible = (p: LonLat) => geoDistance(p, center) < Math.PI / 2 - 0.05;

  const landD = path(land) ?? '';
  const usD = path(USA) ?? '';
  const cnD = path(CHINA) ?? '';
  const gratD = path(graticule) ?? '';
  const glowPulse = 0.55 + 0.45 * Math.sin(frame / 9);

  const cloudPaths: string[] = [];
  if (clouds) {
    for (const c of CLOUDS) {
      for (const b of c.blobs) {
        const circle = geoCircle()
          .center([c.lon + b.dl + frame * c.speed, c.lat + b.dp])
          .radius(b.r)
          .precision(6)();
        const d = path(circle);
        if (d) cloudPaths.push(d);
      }
    }
  }

  // city lights (only visible when night > 0) — sampled from land coordinates
  const lights: React.ReactNode[] = [];
  if (night > 0) {
    const cities: LonLat[] = [
      [-74, 40.7], [-87.6, 41.9], [-118.2, 34], [-122.4, 37.8], [-95.4, 29.8], [-77, 38.9], [-80.2, 25.8], [-84.4, 33.7],
      [-112, 33.4], [-104.9, 39.7], [-122.3, 47.6], [-93.3, 44.9], [-71, 42.3], [-75.2, 40], [-90, 30], [-97, 32.8],
      [116.4, 39.9], [121.5, 31.2], [114.1, 22.5], [113.3, 23.1], [104, 30.7], [108.9, 34.3], [117.2, 39.1], [120.2, 30.3],
      [118.8, 32], [106.5, 29.5], [114.3, 30.6], [126.6, 45.8], [123.4, 41.8], [112.9, 28.2], [102.7, 25], [87.6, 43.8],
      [139.7, 35.7], [127, 37.5], [77.2, 28.6], [72.9, 19], [2.35, 48.85], [-0.1, 51.5], [13.4, 52.5], [37.6, 55.7],
      [-46.6, -23.5], [-99.1, 19.4], [31.2, 30], [28, -26.2], [151.2, -33.9], [103.8, 1.35], [100.5, 13.7], [106.8, -6.2],
    ];
    cities.forEach((p, i) => {
      if (!visible(p)) return;
      const xy = proj(p);
      if (!xy) return;
      const tw = 0.6 + 0.4 * Math.sin(frame / 6 + i * 1.7);
      lights.push(<circle key={i} cx={xy[0]} cy={xy[1]} r={r * 0.012 * (1 + (i % 3) * 0.35)} fill="#ffe08a" opacity={night * tw} />);
    });
  }

  return (
    <g>
      <defs>
        <radialGradient id={`${sid}-ocean`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#3f93e8" />
          <stop offset="55%" stopColor="#1a5fb4" />
          <stop offset="100%" stopColor="#0a2a63" />
        </radialGradient>
        <radialGradient id={`${sid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="82%" stopColor="#5fb2ff" stopOpacity={0} />
          <stop offset="88%" stopColor="#6cc0ff" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#6cc0ff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={`${sid}-shade`} cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.22} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="80%" stopColor="#020818" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#020818" stopOpacity={0.7} />
        </radialGradient>
        <linearGradient id={`${sid}-land`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8dc8a" />
          <stop offset="100%" stopColor="#6fb466" />
        </linearGradient>
        <linearGradient id={`${sid}-us`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5a8cff" />
          <stop offset="100%" stopColor="#1f3f9a" />
        </linearGradient>
        <linearGradient id={`${sid}-cn`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff5a3c" />
          <stop offset="100%" stopColor="#b5160a" />
        </linearGradient>
        <clipPath id={`${sid}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <filter id={`${sid}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={r * 0.02} />
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.14} fill={`url(#${sid}-halo)`} />
      <circle cx={cx} cy={cy} r={r} fill={`url(#${sid}-ocean)`} />
      <g clipPath={`url(#${sid}-clip)`}>
        <path d={gratD} fill="none" stroke="#9fd0ff" strokeOpacity={0.14} strokeWidth={1.2} />
        <path d={landD} fill={`url(#${sid}-land)`} stroke="#2f6b47" strokeWidth={Math.max(1.5, r * 0.006)} strokeLinejoin="round" />
        {highlight > 0 && (
          <g>
            <path d={usD} fill="#8fb4ff" opacity={0.6 * highlight * glowPulse} filter={`url(#${sid}-blur)`} />
            <path d={cnD} fill="#ff8a6a" opacity={0.6 * highlight * glowPulse} filter={`url(#${sid}-blur)`} />
            <path d={usD} fill={`url(#${sid}-us)`} opacity={highlight} stroke="#e8f0ff" strokeWidth={r * 0.006} />
            <path d={cnD} fill={`url(#${sid}-cn)`} opacity={highlight} stroke={'#ffe066'} strokeWidth={r * 0.006} />
          </g>
        )}
        {cloudPaths.length > 0 && (
          <g opacity={0.82}>
            <g transform={`translate(${r * 0.015} ${r * 0.02})`} fill="#0a1d40" opacity={0.18}>
              {cloudPaths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
            <g fill="#ffffff">
              {cloudPaths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          </g>
        )}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${sid}-shade)`} />
        {night > 0 && <circle cx={cx} cy={cy} r={r} fill="#030a22" opacity={night * 0.45} />}
        {lights}
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#bfe3ff" strokeOpacity={0.55} strokeWidth={r * 0.012} />
      {/* raised arcs */}
      {arcs.map((a) => {
        const p0 = proj(a.from);
        const p1 = proj(a.to);
        if (!p0 || !p1) return null;
        const mx = (p0[0] + p1[0]) / 2;
        const my = (p0[1] + p1[1]) / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const len = Math.hypot(dx, dy) || 1;
        const lift = a.lift ?? r * 0.55;
        const qx = mx + (dx / len) * lift * 0.3;
        const qy = my + (dy / len) * lift * 0.3 - lift;
        const d = `M${p0[0]},${p0[1]} Q${qx},${qy} ${p1[0]},${p1[1]}`;
        const total = 2000;
        return (
          <g key={a.id}>
            <path d={d} fill="none" stroke={a.color} strokeWidth={(a.width ?? 6) * 3} opacity={0.25} strokeLinecap="round"
              strokeDasharray={total} strokeDashoffset={total * (1 - a.progress)} pathLength={total} filter={`url(#${sid}-blur)`} />
            <path d={d} fill="none" stroke={a.color} strokeWidth={a.width ?? 6} strokeLinecap="round"
              strokeDasharray={total} strokeDashoffset={total * (1 - a.progress)} pathLength={total} />
            <path d={d} fill="none" stroke="#ffffff" strokeWidth={(a.width ?? 6) * 0.35} strokeLinecap="round" opacity={0.9}
              strokeDasharray={`40 ${total}`} strokeDashoffset={-((frame * 22) % total)} pathLength={total} />
          </g>
        );
      })}
      {markers.map((m, i) => {
        if (!visible(m.at)) return null;
        const xy = proj(m.at);
        if (!xy) return null;
        const s = m.size ?? r * 0.03;
        const pp = (frame / 30 + i * 0.4) % 1.4;
        return (
          <g key={i}>
            {m.pulse && <circle cx={xy[0]} cy={xy[1]} r={s * (1 + pp * 3)} fill="none" stroke={m.color} strokeWidth={s * 0.3} opacity={Math.max(0, 1 - pp / 1.4)} />}
            <circle cx={xy[0]} cy={xy[1]} r={s} fill={m.color} stroke="#fff" strokeWidth={s * 0.35} />
          </g>
        );
      })}
    </g>
  );
};

/** Returns projected screen point of a lon/lat for a given globe configuration. */
export const projectOn = (cx: number, cy: number, r: number, rotate: [number, number, number?], p: LonLat) => {
  const proj = geoOrthographic().scale(r).translate([cx, cy]).rotate([rotate[0], rotate[1], rotate[2] ?? 0]);
  return proj(p) as [number, number];
};
