import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {geoGraticule10, geoInterpolate, geoOrthographic, geoPath, geoDistance} from 'd3-geo';
import {feature} from 'topojson-client';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore json import
import world from 'world-atlas/countries-110m.json';
import {C, F, rand} from '../theme';

const TAIWAN: [number, number] = [120.2, 23.0]; // Tainan
const USA: [number, number] = [-84.3, 37.3]; // eastern Kentucky region (arrival / school)

/** Motion-graphic globe: camera travels from Taiwan to the USA while a flight arc draws. */
export const Globe: React.FC<{frame: number; dur: number}> = ({frame, dur}) => {
  const land = useMemo(() => feature(world as any, (world as any).objects.countries) as any, []);
  const p = frame / Math.max(1, dur - 1);
  const travel = interpolate(p, [0.12, 0.88], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const lam = -121 + (-274.3 + 121) * travel; // eastward across the Pacific
  const phi = -23 + (-37 + 23) * travel;
  const scale = 470 + Math.sin(travel * Math.PI) * -40 + p * 30;
  const proj = geoOrthographic().scale(scale).translate([540, 860]).rotate([lam, phi, 0]).clipAngle(90);
  const path = geoPath(proj);
  const grat = geoGraticule10();
  const interp = geoInterpolate(TAIWAN, USA);
  const arcP = interpolate(p, [0.18, 0.86], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const arcPts: [number, number][] = [];
  for (let i = 0; i <= 80; i++) {
    const k = (i / 80) * arcP;
    arcPts.push(interp(k));
  }
  const arc = {type: 'LineString', coordinates: arcPts} as any;
  const head = interp(arcP);
  const center = proj.invert ? proj.invert([540, 860]) : [0, 0];
  const visible = (pt: [number, number]) => geoDistance(pt, center as [number, number]) < Math.PI / 2 - 0.05;
  const hp = proj(head);
  const tp = proj(TAIWAN);
  const up = proj(USA);
  const pulse = (frame % 30) / 30;
  // stars
  const stars = useMemo(() => Array.from({length: 120}, (_, i) => ({x: rand(i) * 1080, y: rand(i + 500) * 1920, r: rand(i + 900) * 1.6 + 0.3})), []);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #0b1a10 0%, #020403 70%)'}}>
      <svg width={1080} height={1920}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={0.25 + 0.25 * Math.sin(frame / 12 + i)} />
        ))}
        <defs>
          <radialGradient id="atmo" cx="50%" cy="50%" r="50%">
            <stop offset="86%" stopColor="rgba(118,185,0,0)" />
            <stop offset="95%" stopColor="rgba(118,185,0,0.35)" />
            <stop offset="100%" stopColor="rgba(118,185,0,0)" />
          </radialGradient>
          <radialGradient id="ocean" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#0f2418" />
            <stop offset="100%" stopColor="#030806" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={540} cy={860} r={scale * 1.12} fill="url(#atmo)" />
        <path d={path({type: 'Sphere'} as any) ?? ''} fill="url(#ocean)" stroke="rgba(155,226,45,0.35)" strokeWidth={1.5} />
        <path d={path(grat) ?? ''} fill="none" stroke="rgba(155,226,45,0.12)" strokeWidth={1} />
        <path d={path(land) ?? ''} fill="#1b2e1a" stroke="rgba(155,226,45,0.55)" strokeWidth={1.1} />
        <path d={path(arc) ?? ''} fill="none" stroke={C.greenHi} strokeWidth={5} filter="url(#glow)" strokeLinecap="round" />
        {tp && visible(TAIWAN) ? (
          <g>
            <circle cx={tp[0]} cy={tp[1]} r={10 + pulse * 30} fill="none" stroke={C.greenHi} strokeWidth={3} opacity={1 - pulse} />
            <circle cx={tp[0]} cy={tp[1]} r={9} fill={C.greenHi} filter="url(#glow)" />
          </g>
        ) : null}
        {up && visible(USA) && arcP > 0.97 ? (
          <g>
            <circle cx={up[0]} cy={up[1]} r={10 + pulse * 30} fill="none" stroke={C.white} strokeWidth={3} opacity={1 - pulse} />
            <circle cx={up[0]} cy={up[1]} r={9} fill={C.white} filter="url(#glow)" />
          </g>
        ) : null}
        {hp && arcP > 0 && arcP < 0.995 && visible(head) ? <circle cx={hp[0]} cy={hp[1]} r={11} fill="#fff" filter="url(#glow)" /> : null}
      </svg>
      {tp && visible(TAIWAN) ? (
        <div style={{position: 'absolute', left: tp[0] + 26, top: tp[1] - 26, fontFamily: F.bold, fontSize: 36, color: C.white, letterSpacing: 3, textShadow: '0 3px 14px #000', opacity: interpolate(travel, [0, 0.25], [1, 0], {extrapolateRight: 'clamp'})}}>
          ТАЙВАНЬ
        </div>
      ) : null}
      {up && visible(USA) ? (
        <div style={{position: 'absolute', left: up[0] - 40, top: up[1] + 26, fontFamily: F.bold, fontSize: 40, color: C.white, letterSpacing: 4, textShadow: '0 3px 14px #000', opacity: interpolate(arcP, [0.9, 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          США
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
