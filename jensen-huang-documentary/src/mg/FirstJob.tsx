import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {C, F} from '../theme';

const Plate: React.FC = () => (
  <svg width={120} height={120} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={50} fill="none" stroke={C.greenHi} strokeWidth={5} />
    <circle cx={60} cy={60} r={32} fill="none" stroke={C.greenHi} strokeWidth={3} opacity={0.6} />
    <path d="M 20 30 q 6 -10 14 -4" stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
  </svg>
);
const Tray: React.FC = () => (
  <svg width={120} height={120} viewBox="0 0 120 120">
    <ellipse cx={60} cy={82} rx={52} ry={10} fill="none" stroke={C.greenHi} strokeWidth={5} />
    <rect x={38} y={44} width={20} height={34} rx={4} fill="none" stroke={C.greenHi} strokeWidth={4} />
    <path d="M 66 50 h 22 l -4 28 h -14 z" fill="none" stroke={C.greenHi} strokeWidth={4} />
  </svg>
);
const People: React.FC = () => (
  <svg width={120} height={120} viewBox="0 0 120 120">
    <circle cx={42} cy={42} r={14} fill="none" stroke={C.greenHi} strokeWidth={5} />
    <path d="M 16 96 q 26 -40 52 0" fill="none" stroke={C.greenHi} strokeWidth={5} />
    <circle cx={82} cy={46} r={12} fill="none" stroke={C.greenHi} strokeWidth={4} opacity={0.7} />
    <path d="M 64 96 q 20 -34 42 0" fill="none" stroke={C.greenHi} strokeWidth={4} opacity={0.7} />
  </svg>
);

/** Infographic of his roles at Denny's (dishwasher → busboy → waiter), as he has described them. */
export const FirstJob: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const t = frame / fps;
  const rows = [
    {icon: <Plate />, title: 'МОЙЩИК ПОСУДЫ', sub: 'dishwasher', at: 0.15},
    {icon: <Tray />, title: 'ПОМОЩНИК ОФИЦИАНТА', sub: 'busboy', at: 1.1},
    {icon: <People />, title: 'ОФИЦИАНТ', sub: 'waiter', at: 2.6},
  ];
  const line = interpolate(t, [0.3, 3.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #241a10 0%, #080604 78%)'}}>
      {/* warm diner light bokeh */}
      {Array.from({length: 9}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: (i * 137) % 1080 - 60,
            top: 180 + ((i * 251) % 1500),
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(255,170,80,0.10)' : 'rgba(118,185,0,0.06)',
            filter: 'blur(30px)',
            transform: `translateY(${Math.sin(t * 0.6 + i) * 12}px)`,
          }}
        />
      ))}
      <div style={{position: 'absolute', left: 92, top: 560, width: 4, height: 520 * line, background: `linear-gradient(${C.greenHi}, rgba(118,185,0,0.2))`}} />
      {rows.map((r, i) => {
        const p = interpolate(t, [r.at, r.at + 0.6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{position: 'absolute', left: 40, top: 520 + i * 200, display: 'flex', alignItems: 'center', gap: 34, opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
            <div style={{width: 120, height: 120, borderRadius: 60, background: '#0b0f08', boxShadow: `0 0 40px rgba(118,185,0,${0.25 * p})`}}>{r.icon}</div>
            <div>
              <div style={{fontFamily: F.black, fontSize: 52, color: C.white, letterSpacing: 1}}>{r.title}</div>
              <div style={{fontFamily: F.medium, fontSize: 26, color: C.dim, letterSpacing: 3, marginTop: 4}}>{r.sub}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
