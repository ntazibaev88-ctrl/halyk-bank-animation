import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, rand} from '../theme';

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.075}) => {
  const frame = useCurrentFrame();
  const ox = Math.floor(rand(frame) * 512);
  const oy = Math.floor(rand(frame + 77) * 512);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('fx/grain.png')})`,
        backgroundPosition: `${ox}px ${oy}px`,
        backgroundSize: '512px 512px',
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse 85% 70% at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.62) 100%)',
      pointerEvents: 'none',
    }}
  />
);

/** Slow drifting green/teal light leaks, used as a premium "lens" layer. */
export const LightLeak: React.FC<{strength?: number}> = ({strength = 1}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const a = 0.18 * strength + Math.sin(t * 0.7) * 0.05 * strength;
  const x = 80 + Math.sin(t * 0.31) * 18;
  const y = 18 + Math.cos(t * 0.23) * 10;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(118,185,0,${a}) 0%, rgba(118,185,0,0) 42%), radial-gradient(circle at ${100 - x}% ${100 - y}%, rgba(0,140,120,${a * 0.6}) 0%, rgba(0,0,0,0) 40%)`,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      }}
    />
  );
};

/** Flash frames at hard cuts (white-green bloom). times in seconds */
export const Flashes: React.FC<{times: number[]; color?: string}> = ({times, color = 'rgba(210,255,170,1)'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let o = 0;
  for (const t of times) {
    const f0 = t * fps;
    const d = frame - f0;
    if (d > -3 && d < 9) {
      o = Math.max(o, d < 0 ? interpolate(d, [-3, 0], [0, 0.9]) : interpolate(d, [0, 9], [0.9, 0], {easing: Easing.out(Easing.quad)}));
    }
  }
  if (o <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

/** fade to/from black at given ranges */
export const Dips: React.FC<{dips: Array<{t: number; len: number}>}> = ({dips}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let o = 0;
  for (const {t, len} of dips) {
    const d = frame / fps - t;
    if (Math.abs(d) < len) o = Math.max(o, 1 - Math.abs(d) / len);
  }
  if (o <= 0) return null;
  return <AbsoluteFill style={{backgroundColor: '#000', opacity: Easing.inOut(Easing.sin)(o)}} />;
};

/** Thin cinematic HUD: corner ticks + scanning line, for tech sections */
export const Hud: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const frame = useCurrentFrame();
  const L = 46;
  const corner = (style: React.CSSProperties) => (
    <div style={{position: 'absolute', width: L, height: L, borderColor: 'rgba(155,226,45,0.55)', borderStyle: 'solid', ...style}} />
  );
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {corner({left: 48, top: 300, borderWidth: '3px 0 0 3px'})}
      {corner({right: 48, top: 300, borderWidth: '3px 3px 0 0'})}
      {corner({left: 48, top: 1140, borderWidth: '0 0 3px 3px'})}
      {corner({right: 48, top: 1140, borderWidth: '0 3px 3px 0'})}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 300 + ((frame * 6) % 880),
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(155,226,45,0.35), transparent)',
        }}
      />
    </AbsoluteFill>
  );
};

export const ChapterTag: React.FC<{index: number; label: string; color?: string}> = ({index, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = interpolate(frame, [0, 0.6 * fps], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 236,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: inP,
        transform: `translateX(${(1 - inP) * -30}px)`,
        fontFamily: 'InterDisplaySemiBold',
        fontSize: 24,
        letterSpacing: 5,
        color: C.white,
      }}
    >
      <span style={{color: C.greenHi}}>{String(index).padStart(2, '0')}</span>
      <span style={{width: 60 * inP, height: 2, background: C.green, display: 'inline-block'}} />
      <span style={{opacity: 0.8}}>{label}</span>
    </div>
  );
};
