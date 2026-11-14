import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {C, SANS, SERIF, H, W} from '../theme';
import {Flag} from './Flag';
import {MapKZ, CITIES} from './MapKZ';
import {Ornament} from './Ornament';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Particles: React.FC<{n?: number; color?: string; seed?: string; rise?: number}> = ({n = 60, color = C.goldBright, seed = 'p', rise = 0.6}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * W; const y0 = random(`${seed}y${i}`) * H;
        const sp = 0.3 + random(`${seed}s${i}`) * 1.2; const sz = 2 + random(`${seed}z${i}`) * 5;
        const y = ((y0 - f * sp * rise) % H + H) % H; const x = x0 + Math.sin(f / 40 + i) * 12;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(f / 25 + i * 1.7));
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: sz, height: sz, borderRadius: '50%', background: color, opacity: 0.5 * tw, boxShadow: `0 0 ${sz * 3}px ${color}`}} />;
      })}
    </AbsoluteFill>
  );
};

export const DeepBg: React.FC<{hue?: 'navy' | 'dawn' | 'sunset' | 'night'}> = ({hue = 'navy'}) => {
  const bg = {
    navy: 'radial-gradient(ellipse 90% 70% at 50% 40%, #0b4a6b 0%, #052538 45%, #020d16 100%)',
    dawn: 'linear-gradient(180deg, #0d3b66 0%, #3f7fa8 38%, #f3b562 72%, #f7d08a 100%)',
    sunset: 'linear-gradient(180deg, #1b2a4a 0%, #6a4c7a 30%, #e0795a 62%, #f7b267 85%, #f9d28c 100%)',
    night: 'linear-gradient(180deg, #01060f 0%, #061a33 50%, #0e2f55 100%)',
  }[hue];
  const f = useCurrentFrame();
  const glow = hue === 'dawn' || hue === 'sunset';
  return (
    <AbsoluteFill style={{background: bg}}>
      {glow && <AbsoluteFill style={{background: `radial-gradient(circle at ${62 + f * 0.01}% ${hue === 'dawn' ? 70 : 74}%, rgba(255,236,170,0.85) 0%, rgba(255,190,110,0.35) 14%, rgba(255,160,90,0) 42%)`}} />}
      {glow && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 78%, rgba(40,26,10,0.85) 100%)'}} />}
    </AbsoluteFill>
  );
};

/** Waving flag hero shot. variant: wide (with pole), close (sun & eagle detail) */
export const FlagHero: React.FC<{variant?: 'wide' | 'close' | 'sunset'; durF: number}> = ({variant = 'wide', durF}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, durF], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  if (variant === 'close') {
    // tight framing on the sun and eagle, slow drift
    const fw = 4500; const s = 1 + 0.06 * p;
    return (
      <AbsoluteFill>
        <DeepBg hue="dawn" />
        <AbsoluteFill style={{transform: `scale(${s}) translateX(${-40 * p}px)`}}>
          <Flag width={W} height={H} fx={540 - 0.54 * fw} fy={780 - 0.42 * fw / 2} fw={fw} amp={0.03} speed={0.3} wavelength={0.42} light={0.3} timeOffset={3} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,240,200,0.18) 50%, rgba(255,255,255,0) 70%)', transform: `translateX(${(p * 2 - 1) * 900}px)`}} />
      </AbsoluteFill>
    );
  }
  const fw = 1250; const s = 1.0 + 0.08 * p;
  return (
    <AbsoluteFill>
      <DeepBg hue={variant === 'sunset' ? 'sunset' : 'dawn'} />
      <Particles n={30} seed={variant} rise={0.3} color="#fff3c4" />
      <AbsoluteFill style={{transform: `scale(${s}) translateY(${-30 * p}px)`, transformOrigin: '30% 40%'}}>
        <Flag width={W} height={H} fx={110} fy={560} fw={fw} amp={0.06} speed={0.38} wavelength={0.8} light={0.25} pole />
      </AbsoluteFill>
      {variant === 'sunset' && <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,150,60,0.0) 40%, rgba(255,140,50,0.25) 100%)', mixBlendMode: 'soft-light'}} />}
    </AbsoluteFill>
  );
};

/** 16 Dec 1991 — map draws in, date assembles */
export const Date1991: React.FC<{durF: number}> = ({durF}) => {
  const f = useCurrentFrame();
  const yr = Math.round(interpolate(f, [8, 48], [1986, 1991], {...clamp, easing: Easing.out(Easing.cubic)}));
  const a = (t0: number) => interpolate(f, [t0, t0 + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(f, [durF - 12, durF], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <DeepBg hue="navy" />
      <Particles n={45} seed="d91" />
      <div style={{position: 'absolute', left: 40, top: 640, opacity: 0.9}}>
        <MapKZ width={1000} height={620} drawStart={4} drawDur={70} fillStart={60} markers={[{at: CITIES.almaty, label: 'АЛМАТЫ', t0: 70, align: 'left'}]} />
      </div>
      <div style={{position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 210, color: C.white, lineHeight: 1, opacity: a(4), transform: `translateY(${(1 - a(4)) * 40}px)`, textShadow: '0 8px 40px rgba(0,0,0,0.5)'}}>16</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: 14, color: C.goldBright, marginTop: 6, opacity: a(14)}}>ЖЕЛТОҚСАН</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 92, color: C.white, marginTop: 8, letterSpacing: 6, opacity: a(10)}}>{yr} <span style={{fontSize: 60, letterSpacing: 8}}>ЖЫЛ</span></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 205, display: 'flex', justifyContent: 'center'}}>
        <Ornament t0={30} dur={40} width={520} />
      </div>
    </AbsoluteFill>
  );
};

/** 1992 UN membership / 1993 national currency */
export const Timeline9293: React.FC<{durF: number}> = ({durF}) => {
  const f = useCurrentFrame();
  const items = [
    {y: '1992', t: 'БҰҰ', sub: '2 НАУРЫЗ — БҰҰ-ҒА МҮШЕ БОЛДЫ', t0: 6},
    {y: '1993', t: 'ҰЛТТЫҚ ВАЛЮТА', sub: '15 ҚАРАША — ТЕҢГЕ ЕНГІЗІЛДІ', t0: Math.round(durF * 0.42)},
  ];
  const line = interpolate(f, [0, durF * 0.8], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const out = interpolate(f, [durF - 10, durF], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', left: 140, top: 330, width: 4, height: 760 * line, background: `linear-gradient(${C.goldBright}, rgba(233,196,106,0.2))`}} />
      {items.map((it, i) => {
        const p = interpolate(f, [it.t0, it.t0 + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{position: 'absolute', left: 116, top: 330 + i * 380, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
            <div style={{width: 52, height: 52, borderRadius: 26, background: C.goldBright, boxShadow: `0 0 30px ${C.goldBright}`, transform: `scale(${p})`}} />
            <div style={{position: 'absolute', left: 90, top: -38, width: 800}}>
              <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 120, color: C.white, lineHeight: 1, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>{it.y}</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.goldBright, letterSpacing: 3, marginTop: 6, textShadow: '0 4px 20px rgba(0,0,0,0.7)'}}>— {it.t}</div>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: 'rgba(255,255,255,0.85)', letterSpacing: 4, marginTop: 14, textShadow: '0 2px 10px rgba(0,0,0,0.8)'}}>{it.sub}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Capital moves: Almaty -> Akmola (1997) -> Astana (1998) */
export const CapitalMap: React.FC<{durF: number}> = ({durF}) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [durF - 10, durF], [1, 0], clamp);
  const lbl = interpolate(f, [56, 70], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <DeepBg hue="navy" />
      <Particles n={35} seed="cap" />
      <div style={{position: 'absolute', left: 40, top: 520}}>
        <MapKZ width={1000} height={620} drawStart={0} drawDur={24} fillStart={10}
          markers={[{at: CITIES.almaty, label: 'АЛМАТЫ', t0: 8, color: '#9fd8e3', align: 'left'}, {at: CITIES.astana, label: 'АҚМОЛА', sub: '1997 · ЕЛОРДА', t0: 50}]}
          route={{from: CITIES.almaty, to: CITIES.astana, t0: 18, dur: 34}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1210, textAlign: 'center', opacity: lbl}}>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: '#fff'}}>1998 — <span style={{color: C.goldBright}}>АСТАНА</span></span>
      </div>
    </AbsoluteFill>
  );
};
