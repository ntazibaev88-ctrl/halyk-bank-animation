import {AbsoluteFill, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Timeline} from '../types';

/** Film grain: 6 pre-rendered noise tiles, swapped and jittered every frame. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.11}) => {
  const frame = useCurrentFrame();
  const i = frame % 6;
  const ox = Math.floor(random(`gx${frame}`) * 256);
  const oy = Math.floor(random(`gy${frame}`) * 256);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`fx/grain_${i}.png`)})`,
        backgroundPosition: `${ox}px ${oy}px`,
        backgroundSize: '384px 384px',
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Cinematic vignette + top/bottom density for text legibility. */
export const Vignette: React.FC = () => (
  <>
    <AbsoluteFill
      style={{background: 'radial-gradient(ellipse 85% 70% at 50% 46%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)'}}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(4,6,9,0.78) 0%, rgba(4,6,9,0.25) 22%, rgba(4,6,9,0) 36%, rgba(4,6,9,0) 55%, rgba(4,6,9,0.55) 72%, rgba(4,6,9,0.86) 100%)',
      }}
    />
  </>
);

/** Slow drifting anamorphic light leak (screen-blended), adds depth and warmth. */
export const LightLeak: React.FC<{strength?: number}> = ({strength = 0.22}) => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 90) * 30;
  const y = 30 + Math.cos(frame / 120) * 18;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,150,60,0.55) 0%, rgba(255,120,40,0.12) 28%, rgba(0,0,0,0) 55%)`,
        mixBlendMode: 'screen',
        opacity: strength,
      }}
    />
  );
};

/** Flashes / dips at cut points (driven by the timeline). */
export const Flashes: React.FC<{tl: Timeline}> = ({tl}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  let white = 0;
  let warm = 0;
  let black = 0;
  for (const f of tl.flashes) {
    const d = f.dur;
    if (t < f.at - d || t > f.at + d * 1.6) continue;
    const v =
      t <= f.at
        ? interpolate(t, [f.at - d, f.at], [0, 1])
        : interpolate(t, [f.at, f.at + d * 1.6], [1, 0]);
    if (f.kind === 'white') white = Math.max(white, v);
    else if (f.kind === 'warm') warm = Math.max(warm, v);
    else black = Math.max(black, v);
  }
  return (
    <>
      {warm > 0 ? (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(255,214,150,1) 0%, rgba(255,140,50,0.9) 40%, rgba(120,40,0,0.6) 100%)',
            mixBlendMode: 'screen',
            opacity: warm * 0.85,
          }}
        />
      ) : null}
      {white > 0 ? <AbsoluteFill style={{backgroundColor: '#fff', opacity: white * 0.9}} /> : null}
      {black > 0 ? <AbsoluteFill style={{backgroundColor: '#000', opacity: black}} /> : null}
    </>
  );
};

/** Thin progress line at the very top: subtle retention device. */
export const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 6,
        width: `${(frame / durationInFrames) * 100}%`,
        background: 'linear-gradient(90deg, rgba(255,201,60,0.2), rgba(255,201,60,0.95))',
      }}
    />
  );
};
