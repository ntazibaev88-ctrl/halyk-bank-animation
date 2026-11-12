import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

export type Transition = 'cut' | 'fade' | 'whip' | 'zoom' | 'glitch' | 'flash' | 'rise' | 'dip';
export type Grade = 'doc' | 'tech' | 'archival' | 'warm' | 'mg' | 'cool';

export type Cam = {
  s0?: number; s1?: number; // scale
  x0?: number; x1?: number; // translate px
  y0?: number; y1?: number;
  r0?: number; r1?: number; // rotate deg
  ease?: 'inout' | 'out' | 'linear' | 'in';
};

export type ShotCtx = {frame: number; dur: number; p: number; fps: number};

export type ShotDef = {
  id: string;
  start: number; // seconds (the moment this shot is fully on screen)
  end: number;
  transition?: Transition;
  tIn?: number; // transition length seconds (overlap with previous shot)
  grade?: Grade;
  credit?: string;
  cam?: Cam;
  el: (ctx: ShotCtx) => React.ReactNode;
};

const easeFn = (e?: Cam['ease']) =>
  e === 'linear' ? Easing.linear : e === 'out' ? Easing.out(Easing.cubic) : e === 'in' ? Easing.in(Easing.quad) : Easing.inOut(Easing.sin);

const gradeFilter: Record<Grade, string> = {
  doc: 'contrast(1.12) saturate(0.78) brightness(0.9)',
  tech: 'contrast(1.18) saturate(0.85) brightness(0.86)',
  archival: 'grayscale(1) sepia(0.28) contrast(1.22) brightness(0.9)',
  warm: 'contrast(1.1) saturate(0.8) sepia(0.18) brightness(0.88)',
  cool: 'contrast(1.15) saturate(0.7) brightness(0.85) hue-rotate(-8deg)',
  mg: 'none',
};

const GradeOverlay: React.FC<{grade: Grade}> = ({grade}) => {
  if (grade === 'mg') return null;
  const tint =
    grade === 'tech' || grade === 'cool'
      ? 'linear-gradient(180deg, rgba(20,60,20,0.35) 0%, rgba(0,30,25,0.18) 45%, rgba(10,40,10,0.4) 100%)'
      : grade === 'warm'
        ? 'linear-gradient(180deg, rgba(60,35,10,0.28) 0%, rgba(20,30,20,0.15) 50%, rgba(10,25,15,0.35) 100%)'
        : grade === 'archival'
          ? 'linear-gradient(180deg, rgba(40,30,15,0.25), rgba(10,10,5,0.3))'
          : 'linear-gradient(180deg, rgba(10,40,25,0.3) 0%, rgba(0,20,20,0.12) 50%, rgba(5,30,15,0.35) 100%)';
  return (
    <>
      <AbsoluteFill style={{background: tint, mixBlendMode: 'soft-light'}} />
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </>
  );
};

export const ShotLayer: React.FC<{shot: ShotDef; tInFrames: number; durFrames: number}> = ({shot, tInFrames, durFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = Math.min(1, Math.max(0, frame / Math.max(1, durFrames - 1)));
  const cam = shot.cam ?? {};
  const e = easeFn(cam.ease)(p);
  const lerp = (a: number | undefined, b: number | undefined, d: number) => {
    const A = a ?? d;
    const B = b ?? A;
    return A + (B - A) * e;
  };
  const s = lerp(cam.s0, cam.s1, 1.06);
  const x = lerp(cam.x0, cam.x1, 0);
  const y = lerp(cam.y0, cam.y1, 0);
  const r = lerp(cam.r0, cam.r1, 0);

  // transition-in
  const tr = shot.transition ?? 'fade';
  const tp = tInFrames > 0 ? Math.min(1, frame / tInFrames) : 1;
  const te = Easing.out(Easing.cubic)(tp);
  let opacity = 1;
  let tx = 0;
  let ts = 1;
  let blur = 0;
  let extraFilter = '';
  if (tInFrames > 0) {
    switch (tr) {
      case 'fade':
      case 'dip':
        opacity = Easing.inOut(Easing.sin)(tp);
        break;
      case 'whip':
        opacity = interpolate(tp, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'});
        tx = (1 - te) * 520;
        blur = (1 - te) * 38;
        break;
      case 'zoom':
        opacity = interpolate(tp, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'});
        ts = 1 + (1 - te) * 0.35;
        blur = (1 - te) * 26;
        break;
      case 'rise':
        opacity = interpolate(tp, [0, 0.5], [0, 1], {extrapolateRight: 'clamp'});
        tx = 0;
        ts = 1 + (1 - te) * 0.08;
        blur = (1 - te) * 12;
        break;
      case 'glitch': {
        const flick = frame % 2 === 0 ? 1 : 0.55;
        opacity = tp < 1 ? flick * interpolate(tp, [0, 0.3], [0.3, 1], {extrapolateRight: 'clamp'}) : 1;
        tx = tp < 1 ? (Math.sin(frame * 7.3) * 40 * (1 - tp)) : 0;
        extraFilter = tp < 1 ? ` hue-rotate(${(1 - tp) * 60}deg) saturate(${1 + (1 - tp) * 2})` : '';
        break;
      }
      case 'flash':
        opacity = tp > 0.5 ? 1 : 0;
        break;
      default:
        opacity = 1;
    }
  }
  const grade = shot.grade ?? 'doc';
  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden', backgroundColor: C.ink}}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, 0px) scale(${ts})`,
          filter: blur > 0.3 || extraFilter ? `blur(${blur}px)${extraFilter}` : undefined,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `translate(${x}px, ${y}px) scale(${s}) rotate(${r}deg)`,
            filter: gradeFilter[grade],
          }}
        >
          {shot.el({frame, dur: durFrames, p, fps})}
        </AbsoluteFill>
        <GradeOverlay grade={grade} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
