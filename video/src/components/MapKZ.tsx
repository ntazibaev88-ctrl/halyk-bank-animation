import React, {useMemo} from 'react';
import {geoConicEqualArea, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, SANS} from '../theme';

// Natural Earth 1:50m boundaries (public domain) via world-atlas.
const kz = (() => {
  const w: any = world;
  return (feature(w, w.objects.countries) as any).features.find((f: any) => f.id === '398');
})();

export const CITIES = {
  astana: [71.4304, 51.1282] as [number, number],
  almaty: [76.8897, 43.2389] as [number, number],
};

type Marker = {at: [number, number]; label: string; sub?: string; t0: number; color?: string; align?: 'left' | 'right'};

export const MapKZ: React.FC<{
  width?: number; height?: number; drawStart?: number; drawDur?: number; fillStart?: number;
  markers?: Marker[]; route?: {from: [number, number]; to: [number, number]; t0: number; dur: number};
  opacity?: number;
}> = ({width = 1000, height = 640, drawStart = 0, drawDur = 60, fillStart = 50, markers = [], route, opacity = 1}) => {
  const frame = useCurrentFrame();
  const {d, proj} = useMemo(() => {
    const proj = geoConicEqualArea().parallels([45, 52]).rotate([-67, 0]).fitExtent([[30, 30], [width - 30, height - 30]], kz);
    return {d: geoPath(proj)(kz) as string, proj};
  }, [width, height]);
  const draw = interpolate(frame, [drawStart, drawStart + drawDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const fill = interpolate(frame, [fillStart, fillStart + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const P = 6000;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible', opacity}}>
      <defs>
        <linearGradient id="kzfill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.blue} stopOpacity="0.55" />
          <stop offset="1" stopColor="#0a5f86" stopOpacity="0.35" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={d} fill="url(#kzfill)" opacity={fill} />
      <path d={d} fill="none" stroke={C.goldBright} strokeWidth={4} filter="url(#glow)"
        pathLength={P} strokeDasharray={P} strokeDashoffset={P * (1 - draw)} strokeLinejoin="round" />
      {route && (() => {
        const a = proj(route.from)!; const b = proj(route.to)!;
        const p = interpolate(frame, [route.t0, route.t0 + route.dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
        const mx = (a[0] + b[0]) / 2 - 120; const my = (a[1] + b[1]) / 2;
        const pathD = `M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`;
        return <path d={pathD} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="1000" strokeDashoffset={1000 * (1 - p)} pathLength={1000} opacity={0.9} strokeLinecap="round" />;
      })()}
      {markers.map((mk, i) => {
        const p = proj(mk.at)!;
        const s = interpolate(frame, [mk.t0, mk.t0 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
        const pulse = (frame - mk.t0) / 30;
        const ring = pulse > 0 ? (pulse % 1.4) / 1.4 : 0;
        const col = mk.color ?? C.goldBright;
        const right = mk.align !== 'left';
        return (
          <g key={i} opacity={s}>
            <circle cx={p[0]} cy={p[1]} r={8 + 40 * ring} fill="none" stroke={col} strokeWidth={3} opacity={1 - ring} />
            <circle cx={p[0]} cy={p[1]} r={11 * s} fill={col} />
            <text x={p[0] + (right ? 26 : -26)} y={p[1] + 12} textAnchor={right ? 'start' : 'end'} fill="#fff"
              style={{font: `800 38px ${SANS}`, letterSpacing: 2, paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.55)', strokeWidth: 6}}>{mk.label}</text>
            {mk.sub && <text x={p[0] + (right ? 26 : -26)} y={p[1] + 50} textAnchor={right ? 'start' : 'end'} fill={C.goldBright}
              style={{font: `600 28px ${SANS}`, letterSpacing: 3, paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.55)', strokeWidth: 5}}>{mk.sub}</text>}
          </g>
        );
      })}
    </svg>
  );
};
