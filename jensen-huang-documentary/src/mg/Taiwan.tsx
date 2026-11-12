import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {geoMercator, geoPath} from 'd3-geo';
import {feature} from 'topojson-client';
// @ts-ignore json import
import world from 'world-atlas/countries-50m.json';
import {C, F, rand} from '../theme';

const TAINAN: [number, number] = [120.21, 22.99];

/** Archival-styled map of Taiwan that draws itself, with the birth year (motion graphic). */
export const Taiwan: React.FC<{frame: number; dur: number; fps: number}> = ({frame, dur, fps}) => {
  const {land, taiwan} = useMemo(() => {
    const all = feature(world as any, (world as any).objects.countries) as any;
    const tw = all.features.find((f: any) => String(f.id) === '158');
    return {land: all, taiwan: tw};
  }, []);
  const t = frame / fps;
  const p = frame / Math.max(1, dur - 1);
  const zoom = 1 + p * 0.12;
  const proj = geoMercator()
    .center([120.9, 23.6])
    .scale(9200 * zoom)
    .translate([540, 900]);
  const path = geoPath(proj);
  const d = path(taiwan) ?? '';
  const draw = interpolate(t, [0.2, 2.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const fill = interpolate(t, [1.6, 2.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pt = proj(TAINAN) ?? [0, 0];
  const pulse = (frame % 36) / 36;
  const yearP = interpolate(t, [0.1, 1.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const flicker = 0.92 + rand(frame * 1.7) * 0.1;
  const scratches = Array.from({length: 3}, (_, i) => ({x: rand(Math.floor(frame / 3) * 7 + i) * 1080, o: rand(frame + i * 13) > 0.6 ? 0.25 : 0}));
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1a12 0%, #070705 75%)', filter: `brightness(${flicker})`}}>
      {/* big outlined year */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 470,
          textAlign: 'center',
          fontFamily: F.black,
          fontSize: 330,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(155,226,45,0.28)',
          letterSpacing: 10,
          opacity: yearP,
          transform: `translateY(${(1 - yearP) * 40}px) scale(${1.05 - p * 0.05})`,
        }}
      >
        1963
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="tg">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={path(land) ?? ''} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
        <path d={d} fill={`rgba(118,185,0,${0.16 * fill})`} stroke={C.greenHi} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} filter="url(#tg)" />
        {draw > 0.95 ? (
          <g>
            <circle cx={pt[0]} cy={pt[1]} r={10 + pulse * 40} fill="none" stroke={C.white} strokeWidth={3} opacity={1 - pulse} />
            <circle cx={pt[0]} cy={pt[1]} r={10} fill={C.white} filter="url(#tg)" />
          </g>
        ) : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          left: pt[0] - 380,
          width: 350,
          top: pt[1] - 26,
          textAlign: 'right',
          fontFamily: F.bold,
          fontSize: 38,
          letterSpacing: 4,
          color: C.white,
          opacity: interpolate(t, [2.0, 2.5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          textShadow: '0 3px 12px #000',
        }}
      >
        ТАЙНАНЬ
        <div style={{fontFamily: F.medium, fontSize: 24, letterSpacing: 2, color: C.dim}}>место рождения</div>
      </div>
      {scratches.map((s, i) => (
        <div key={i} style={{position: 'absolute', left: s.x, top: 0, bottom: 0, width: 1.5, background: '#fff', opacity: s.o}} />
      ))}
    </AbsoluteFill>
  );
};
