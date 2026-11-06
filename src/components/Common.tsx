import React from 'react';
import {rand} from '../lib/anim';

/** Twinkling star field. */
export const Stars: React.FC<{frame: number; n?: number; h?: number; seed?: number; drift?: number}> = ({frame, n = 140, h = 1920, seed = 1, drift = 0}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const x = (rand(i * 3 + seed) * 1180 - 50 + drift * frame * (0.3 + rand(i) * 0.7)) % 1180;
      const y = rand(i * 7 + seed * 13) * h;
      const r = 0.8 + rand(i * 11 + seed) * 2.2;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (8 + rand(i) * 14) + i));
      return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={tw * (0.4 + rand(i + 5) * 0.6)} />;
    })}
  </g>
);

/** Vignette overlay. */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Darkening band behind the subtitle area so text never fights the artwork. */
export const SubtitleBed: React.FC<{opacity?: number}> = ({opacity = 0.55}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 1220,
      height: 700,
      background: `linear-gradient(180deg, rgba(4,7,18,0) 0%, rgba(4,7,18,${opacity}) 30%, rgba(4,7,18,${opacity * 1.2}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Full-frame SVG canvas in 1080x1920 coordinates. */
export const Canvas: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, ...style}}>
    {children}
  </svg>
);
