import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {C, SANS} from '../theme';

export type Motion = {s?: [number, number]; x?: [number, number]; y?: [number, number]; r?: [number, number]};
export type ShotSpec = {
  id: string;
  clip?: string;        // preprocessed clip in public/clips (1080 wide fill or source for 'frame')
  img?: string;         // still in public/photos (used sparingly)
  start: number;        // seconds on master timeline (cut point)
  xf?: number;          // transition length in seconds (incoming)
  trans?: 'fade' | 'flash' | 'zoom' | 'wipe' | 'cut';
  motion?: Motion;
  grade?: string;       // CSS filter
  warm?: number;        // golden-hour tint 0..1
  mode?: 'fill' | 'frame';
  archive?: string;     // label for archival frames, e.g. "АРХИВ · 1992"
  credit?: string;      // tiny on-screen source line
  rate?: number;
};

const ease = Easing.inOut(Easing.sin);

export const ShotView: React.FC<{spec: ShotSpec; durF: number; xfF: number; children?: React.ReactNode}> = ({spec, durF, xfF, children}) => {
  const f = useCurrentFrame();
  const m = spec.motion ?? {};
  const p = interpolate(f, [0, durF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const s = m.s ? m.s[0] + (m.s[1] - m.s[0]) * p : 1.04;
  const x = m.x ? m.x[0] + (m.x[1] - m.x[0]) * p : 0;
  const y = m.y ? m.y[0] + (m.y[1] - m.y[0]) * p : 0;
  const r = m.r ? m.r[0] + (m.r[1] - m.r[0]) * p : 0;
  const trans = spec.trans ?? 'fade';
  const inP = xfF > 0 ? interpolate(f, [0, xfF], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)}) : 1;
  let opacity = trans === 'cut' ? 1 : inP;
  let extraScale = 1; let blur = 0; let clip: string | undefined;
  if (trans === 'zoom') { extraScale = 1 + 0.18 * (1 - inP); blur = 14 * (1 - inP); }
  if (trans === 'wipe') { opacity = 1; const w = inP * 135; clip = `polygon(0 0, ${w}% 0, ${w - 35}% 100%, 0 100%)`; }
  const media = spec.clip ? (
    <OffthreadVideo src={staticFile(`clips/${spec.clip}`)} muted playbackRate={spec.rate ?? 1}
      style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  ) : spec.img ? (
    <Img src={staticFile(`photos/${spec.img}`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
  ) : null;

  const graded = (
    <AbsoluteFill style={{filter: spec.grade ?? 'contrast(1.06) saturate(1.08)'}}>
      {media}
      {spec.warm ? <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(255,170,60,${0.22 * spec.warm}) 0%, rgba(255,120,40,${0.08 * spec.warm}) 60%, rgba(0,40,80,${0.12 * spec.warm}) 100%)`, mixBlendMode: 'soft-light'}} /> : null}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{opacity, clipPath: clip, filter: blur ? `blur(${blur}px)` : undefined, background: C.ink}}>
      {spec.mode === 'frame' ? (
        <AbsoluteFill>
          {/* blurred fill behind archival 4:3 frame */}
          <AbsoluteFill style={{filter: 'blur(38px) brightness(0.45) saturate(0.6)', transform: 'scale(1.25)'}}>{media}</AbsoluteFill>
          <div style={{position: 'absolute', left: 40, right: 40, top: 520, height: 1000 * 0.75 + 0, transform: `scale(${s * extraScale}) translate(${x}px, ${y}px)`,
            boxShadow: '0 30px 90px rgba(0,0,0,0.7)', border: '3px solid rgba(233,196,106,0.85)', overflow: 'hidden'}}>
            <AbsoluteFill style={{filter: (spec.grade ?? '') + ' sepia(0.25) contrast(1.1)'}}>{media}</AbsoluteFill>
          </div>
          {spec.archive && (
            <div style={{position: 'absolute', left: 40, top: 462, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.goldBright,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>● {spec.archive}</div>
          )}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transform: `scale(${s * extraScale}) translate(${x}px, ${y}px) rotate(${r}deg)`}}>{graded}</AbsoluteFill>
      )}
      {spec.archive && spec.mode !== 'frame' && (
        <div style={{position: 'absolute', left: 72, top: 230, fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: C.goldBright,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)'}}>● {spec.archive}</div>
      )}
      {spec.credit && (
        <div style={{position: 'absolute', right: 160, bottom: 432, fontFamily: SANS, fontWeight: 500, fontSize: 17, color: 'rgba(255,255,255,0.55)', letterSpacing: 1}}>{spec.credit}</div>
      )}
      {children}
      {trans === 'flash' && <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [0, 3, xfF + 6], [0.0, 0.85, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />}
    </AbsoluteFill>
  );
};
