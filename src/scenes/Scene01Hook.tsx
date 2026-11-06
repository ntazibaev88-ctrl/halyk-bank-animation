import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, Stars, SubtitleBed, Vignette} from '../components/Common';
import {Globe} from '../components/Globe';
import {WavingFlag} from '../components/Flag';
import {PLACES} from '../lib/geo';
import {easeIn, easeOut, io, pop, rand} from '../lib/anim';
import {C, FONT_TITLE} from '../theme';

export const Scene01Hook: React.FC = () => {
  const {f, dur} = useScene();
  // camera: rapid approach, slow push, final rush into the planet
  const approach = io(f, [0, 52], [0, 1], easeOut);
  const rush = io(f, [dur - 26, dur + 10], [0, 1], easeIn);
  const r = 70 + approach * 260 + io(f, [52, dur - 26], [0, 30]) + rush * 900;
  const cy = 860 + rush * 160;
  const rot: [number, number, number] = [-2 - f * 0.07, -70 + f * 0.012, 0];
  // camera shake on title impact
  const shakeAmt = io(f, [36, 52], [16, 0]);
  const sx = (rand(f) - 0.5) * shakeAmt;
  const sy = (rand(f + 100) - 0.5) * shakeAmt;

  const titleP = pop(f, 36, 11, 170, 0.9);
  const titleScale = 2.4 - 1.4 * titleP;
  const titleOut = io(f, [dur - 24, dur - 6], [1, 0]);
  const usFlag = pop(f, 61, 12, 130);
  const cnFlag = pop(f, 70, 12, 130);
  const flagsOut = io(f, [dur - 26, dur - 10], [1, 0]);
  const arcs = [
    {id: 'a1', from: PLACES.washington, to: PLACES.beijing, color: '#5d8fff', progress: io(f, [88, 128], [0, 1]), width: 7},
    {id: 'a2', from: PLACES.shanghai, to: PLACES.newYork, color: '#ff5a3c', progress: io(f, [98, 140], [0, 1]), width: 7, lift: r * 0.42},
    {id: 'a3', from: PLACES.sanFrancisco, to: PLACES.shenzhen, color: C.gold, progress: io(f, [110, 150], [0, 1]), width: 5, lift: r * 0.3},
  ];
  const sparks = io(f, [128, 150], [0, 1]);

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 18% 40%, rgba(40,80,200,0.45), rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 55%, rgba(200,30,20,0.38), rgba(0,0,0,0) 45%), linear-gradient(180deg,#03050c,#0a1230 60%,#05070f)',
        }}
      />
      <Canvas style={{transform: `translate(${sx}px, ${sy}px)`}}>
        <g transform={`translate(540 960) scale(${1 + approach * 0.08}) translate(-540 -960)`}>
          <Stars frame={f} n={170} seed={3} />
        </g>
        {/* shooting stars */}
        {[0, 1].map((k) => {
          const t0 = 20 + k * 95;
          const p = io(f, [t0, t0 + 22], [0, 1]);
          if (p <= 0 || p >= 1) return null;
          const x = 980 - p * 700 - k * 120;
          const y = 260 + p * 300 + k * 760;
          return <line key={k} x1={x} y1={y} x2={x + 120} y2={y - 52} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={Math.sin(p * Math.PI)} />;
        })}
        {/* orbit ring behind */}
        <g opacity={approach * (1 - rush)}>
          <ellipse cx={540} cy={cy} rx={r * 1.45} ry={r * 0.38} fill="none" stroke="#7fb8ff" strokeOpacity={0.25} strokeWidth={3} strokeDasharray="8 14" transform={`rotate(-14 540 ${cy})`} />
        </g>
        <Globe id="hook-globe" cx={540} cy={cy} r={r} rotate={rot} frame={f} highlight={io(f, [70, 100], [0.2, 1])} arcs={rush > 0.4 ? [] : arcs}
          markers={f > 90 && rush < 0.3 ? [
            {at: PLACES.washington, color: '#5d8fff', pulse: true},
            {at: PLACES.beijing, color: '#ff5a3c', pulse: true},
          ] : []}
        />
        {/* satellite on the orbit (front half) */}
        {(() => {
          const a = f / 30;
          const ex = 540 + Math.cos(a) * r * 1.45;
          const ey = cy + Math.sin(a) * r * 0.38;
          const front = Math.sin(a) > 0;
          const ang = (-14 * Math.PI) / 180;
          const x = 540 + (ex - 540) * Math.cos(ang) - (ey - cy) * Math.sin(ang);
          const y = cy + (ex - 540) * Math.sin(ang) + (ey - cy) * Math.cos(ang);
          return front && rush < 0.2 ? (
            <g transform={`translate(${x} ${y}) rotate(${f * 2})`} opacity={approach}>
              <rect x={-30} y={-6} width={22} height={12} fill="#3d6fe0" stroke="#bcd" strokeWidth={1.5} />
              <rect x={8} y={-6} width={22} height={12} fill="#3d6fe0" stroke="#bcd" strokeWidth={1.5} />
              <rect x={-8} y={-9} width={16} height={18} rx={3} fill="#e8edf5" />
              <circle r={3} fill={C.gold} />
            </g>
          ) : null;
        })()}
        {/* sparks where the energy lines meet */}
        {sparks > 0 && sparks < 1 &&
          Array.from({length: 18}).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            const d = sparks * (60 + rand(i) * 80);
            return <circle key={i} cx={540 + Math.cos(a) * d} cy={cy - r * 0.95 + Math.sin(a) * d} r={4} fill={i % 2 ? '#fff' : C.gold} opacity={1 - sparks} />;
          })}
        {/* flags on opposite sides */}
        <g opacity={flagsOut}>
          <g transform={`translate(60 ${1100 - (1 - usFlag) * 40}) scale(${usFlag}) translate(-60 -1100)`}>
            <WavingFlag kind="us" id="hook-us" x={60} y={1000} w={250} frame={f} poleH={330} />
          </g>
          <g transform={`translate(800 ${1100 - (1 - cnFlag) * 40}) scale(${cnFlag}) translate(-800 -1100)`}>
            <WavingFlag kind="cn" id="hook-cn" x={800} y={1000} w={225} frame={f + 13} poleH={330} />
          </g>
        </g>
      </Canvas>
      {/* title */}
      {f >= 34 && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 300,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 26,
            transform: `scale(${titleScale})`,
            opacity: Math.min(1, titleP * 1.6) * titleOut,
            fontFamily: FONT_TITLE,
            fontSize: 124,
            lineHeight: 1,
          }}
        >
          <span style={{color: '#fff', textShadow: `0 8px 0 ${C.usBlue}, 0 0 40px rgba(61,111,224,0.9)`}}>США</span>
          <span
            style={{
              fontSize: 72,
              color: '#111',
              background: C.gold,
              borderRadius: 999,
              width: 128,
              height: 128,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 50px rgba(255,200,61,0.8)',
              transform: `rotate(${(1 - titleP) * -40}deg)`,
            }}
          >
            VS
          </span>
          <span style={{color: C.cnGold, textShadow: `0 8px 0 ${C.cnRedDeep}, 0 0 40px rgba(222,41,16,0.9)`}}>КИТАЙ</span>
        </div>
      )}
      {/* impact flash */}
      <AbsoluteFill style={{background: '#fff', opacity: io(f, [34, 37], [0, 0.55]) * io(f, [37, 46], [1, 0])}} />
      <SubtitleBed opacity={0.35} />
      <Vignette strength={0.6} />
    </AbsoluteFill>
  );
};
