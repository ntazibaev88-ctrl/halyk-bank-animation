import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {C, F} from '../theme';

const people = [
  {ru: 'ДЖЕНСЕН ХУАНГ', en: 'Jensen Huang'},
  {ru: 'КРИС МАЛАХОВСКИ', en: 'Chris Malachowsky'},
  {ru: 'КЁРТИС ПРИЕМ', en: 'Curtis Priem'},
];

const GridBg: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #0d1c0b 0%, #030503 75%)'}}>
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(rgba(118,185,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(118,185,0,0.08) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        backgroundPosition: `0px ${frame * 0.8}px`,
        maskImage: 'radial-gradient(ellipse at 50% 45%, #000 20%, transparent 75%)',
      }}
    />
  </AbsoluteFill>
);

/** Co-founders card (facts: NVIDIA was co-founded in 1993 by Jensen Huang, Chris Malachowsky and Curtis Priem). */
export const Founders: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <GridBg frame={frame} />
      <div style={{position: 'absolute', left: 80, top: 540, fontFamily: F.semi, fontSize: 28, letterSpacing: 8, color: C.greenHi, opacity: interpolate(t, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'})}}>
        СООСНОВАТЕЛИ · 1993
      </div>
      {people.map((pp, i) => {
        const p = interpolate(t, [0.15 + i * 0.32, 0.75 + i * 0.32], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
        const y = 630 + i * 170;
        return (
          <div key={i} style={{position: 'absolute', left: 80, right: 120, top: y, opacity: p, transform: `translateX(${(1 - p) * -80}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{width: 6, height: 104, background: i === 0 ? C.greenHi : 'rgba(244,246,242,0.4)', boxShadow: i === 0 ? `0 0 20px ${C.green}` : undefined}} />
              <div>
                <div style={{fontFamily: F.black, fontSize: 62, color: C.white, letterSpacing: 1}}>{pp.ru}</div>
                <div style={{fontFamily: F.medium, fontSize: 28, color: 'rgba(244,246,242,0.55)', letterSpacing: 2, marginTop: 4}}>{pp.en}</div>
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Wordmark typeset in our own font (not the official logo), revealed letter by letter. */
export const Wordmark: React.FC<{frame: number; fps: number; sub?: string}> = ({frame, fps, sub = 'ОСНОВАНА В 1993'}) => {
  const t = frame / fps;
  const letters = 'NVIDIA'.split('');
  const line = interpolate(t, [0.6, 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const glow = 0.5 + 0.5 * Math.sin(t * 2.4);
  return (
    <AbsoluteFill>
      <GridBg frame={frame} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 44%, rgba(118,185,0,${0.18 + glow * 0.08}) 0%, transparent 45%)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', justifyContent: 'center'}}>
        {letters.map((l, i) => {
          const p = interpolate(t, [0.05 + i * 0.07, 0.55 + i * 0.07], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          return (
            <div key={i} style={{overflow: 'hidden', height: 190}}>
              <div
                style={{
                  fontFamily: F.black,
                  fontSize: 190,
                  lineHeight: 1,
                  color: C.white,
                  letterSpacing: 6,
                  transform: `translateY(${(1 - p) * 100}%)`,
                  textShadow: `0 0 ${40 + glow * 30}px rgba(118,185,0,0.55)`,
                }}
              >
                {l}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 540 - 380 * line, width: 760 * line, top: 920, height: 5, background: C.greenHi, boxShadow: `0 0 30px ${C.green}`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 955, textAlign: 'center', fontFamily: F.semi, fontSize: 34, letterSpacing: 12, color: C.white, opacity: line}}>
        {sub}
      </div>
    </AbsoluteFill>
  );
};

/** Reconstruction: founders' napkin sketch on a diner table — the idea of 3D graphics for PCs and games. */
export const DinerNotes: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const t = frame / fps;
  const draw = (a: number, b: number) => interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const d1 = draw(0.1, 0.9);
  const d2 = draw(0.6, 1.3);
  const d3 = draw(1.0, 1.7);
  const pen = '#1d2a12';
  // simple wireframe "teapot-ish" mesh sketch: triangle strip
  const mesh: Array<[number, number, number, number]> = [];
  const pts: [number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) pts.push([150 + c * 90 + (r % 2) * 45, 230 + r * 66 - Math.sin(c / 1.6) * 34]);
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++) {
      const i = r * 6 + c;
      if (c < 5) mesh.push([...pts[i], ...pts[i + 1]] as any);
      if (r < 3) mesh.push([...pts[i], ...pts[i + 6]] as any);
      if (r < 3 && c < 5) mesh.push([...pts[i + 1], ...pts[i + 6]] as any);
    }
  const shown = Math.floor(mesh.length * d1);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #3a2a1a 0%, #120c07 80%)'}}>
      {/* table texture lines */}
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(8deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 22px)'}} />
      {/* coffee cup from top */}
      <div style={{position: 'absolute', left: 700, top: 1180, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #2a1608 0%, #3b210d 52%, #e9e2d3 54%, #d8d0c0 66%, rgba(0,0,0,0.5) 70%, transparent 74%)'}} />
      {/* paper */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 330,
          width: 820,
          height: 840,
          transform: 'rotate(-4deg)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(60,90,160,0.18) 0 2px, transparent 2px 58px), linear-gradient(160deg, #f1ead8, #e2d8bf)',
        }}
      >
        <svg width={820} height={900} style={{position: 'absolute', left: 0, top: 0}}>
          {mesh.slice(0, shown).map((m, i) => (
            <line key={i} x1={m[0]} y1={m[1]} x2={m[2]} y2={m[3]} stroke={pen} strokeWidth={3} strokeLinecap="round" />
          ))}
          {/* chip square */}
          <rect x={80} y={560} width={170 * d2} height={170 * d2} fill="none" stroke={pen} strokeWidth={4} />
          {d2 > 0.9
            ? Array.from({length: 6}).map((_, i) => <line key={i} x1={95 + i * 28} y1={560} x2={95 + i * 28} y2={538} stroke={pen} strokeWidth={3} />)
            : null}
          <path d={`M 280 650 Q ${280 + 90 * d3} ${600} ${280 + 160 * d3} 640`} stroke={pen} strokeWidth={4} fill="none" />
        </svg>
        <div style={{position: 'absolute', left: 60, top: 40, fontFamily: F.hand, fontSize: 84, color: pen, opacity: draw(0.0, 0.5)}}>3D-графика</div>
        <div style={{position: 'absolute', left: 460, top: 590, fontFamily: F.hand, fontSize: 76, color: '#3d5a00', opacity: d3}}>игры!</div>
        <div style={{position: 'absolute', left: 70, top: 760, fontFamily: F.hand, fontSize: 66, color: pen, opacity: draw(1.2, 1.8)}}>графический чип для ПК</div>
      </div>
    </AbsoluteFill>
  );
};
