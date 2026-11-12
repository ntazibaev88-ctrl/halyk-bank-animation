import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/** Section title: e.g. accent="1963" rest="ТАЙВАНЬ". Lives inside a Sequence; holds for `hold` seconds. */
export const SectionTitle: React.FC<{accent?: string; rest: string; hold: number; top?: number; accentFirstLine?: boolean}> = ({
  accent,
  rest,
  hold,
  top = 300,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const inP = interpolate(t, [0, 0.7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const outP = interpolate(t, [hold - 0.5, hold], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const bar = interpolate(t, [0.05, 0.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 120,
        top,
        opacity: 1 - outP,
        transform: `translateY(${-outP * 30}px)`,
      }}
    >
      <div style={{width: 120 * bar, height: 6, background: C.green, marginBottom: 22, boxShadow: `0 0 24px ${C.green}`}} />
      <div style={{overflow: 'hidden', paddingBottom: 6}}>
        <div
          style={{
            transform: `translateY(${(1 - inP) * 110}%)`,
            fontFamily: F.black,
            fontSize: 86,
            lineHeight: 1.02,
            letterSpacing: 1 + (1 - inP) * 10,
            color: C.white,
            textShadow: '0 6px 30px rgba(0,0,0,0.8)',
          }}
        >
          {accent ? (
            <span style={{color: C.greenHi, textShadow: `0 0 40px rgba(118,185,0,0.55), 0 6px 30px rgba(0,0,0,0.8)`}}>{accent}</span>
          ) : null}
          {accent ? <span style={{color: C.white}}> — </span> : null}
          {rest}
        </div>
      </div>
    </div>
  );
};

/** Opening / closing hero title. lines: array of {text, green?} */
export const HeroTitle: React.FC<{
  lines: Array<{text: string; green?: boolean; size?: number}>;
  hold: number;
  top?: number;
  stagger?: number;
  align?: 'left' | 'center';
}> = ({lines, hold, top = 520, stagger = 0.18, align = 'center'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const outP = interpolate(t, [hold - 0.45, hold], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: 56,
        right: 56,
        top,
        textAlign: align,
        opacity: 1 - outP,
        filter: outP > 0 ? `blur(${outP * 12}px)` : undefined,
      }}
    >
      {lines.map((l, i) => {
        const p = interpolate(t, [i * stagger, i * stagger + 0.75], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <div key={i} style={{overflow: 'hidden', paddingBottom: 4}}>
            <div
              style={{
                transform: `translateY(${(1 - p) * 105}%) scale(${1 + (1 - p) * 0.06})`,
                opacity: p,
                fontFamily: F.black,
                fontSize: l.size ?? 104,
                lineHeight: 1.0,
                letterSpacing: (1 - p) * 14 - 1,
                color: l.green ? C.greenHi : C.white,
                textShadow: l.green
                  ? '0 0 50px rgba(118,185,0,0.6), 0 8px 40px rgba(0,0,0,0.9)'
                  : '0 8px 40px rgba(0,0,0,0.9)',
              }}
            >
              {l.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Small source/credit line, honest labeling of archive / reconstruction / licensed footage */
export const Credit: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 150,
        top: 1432,
        fontFamily: F.medium,
        fontSize: 21,
        letterSpacing: 0.6,
        color: 'rgba(244,246,242,0.62)',
        opacity: o,
        textShadow: '0 2px 8px rgba(0,0,0,0.9)',
      }}
    >
      {text}
    </div>
  );
};

/** Label pinned on screen (e.g., names, places) */
export const Label: React.FC<{text: string; sub?: string; x: number; y: number; delay?: number; hold?: number; align?: 'left' | 'right'}> = ({
  text,
  sub,
  x,
  y,
  delay = 0,
  hold = 99,
  align = 'left',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps - delay;
  const p = interpolate(t, [0, 0.5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(t, [hold - 0.4, hold], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'left' ? x : undefined,
        right: align === 'right' ? 1080 - x : undefined,
        top: y,
        opacity: p * (1 - out),
        transform: `translateY(${(1 - p) * 16}px)`,
        textAlign: align,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12, flexDirection: align === 'left' ? 'row' : 'row-reverse'}}>
        <div style={{width: 10, height: 10, borderRadius: 5, background: C.greenHi, boxShadow: `0 0 16px ${C.green}`}} />
        <div style={{fontFamily: F.bold, fontSize: 34, color: C.white, letterSpacing: 2, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>
          {text}
        </div>
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: F.medium,
            fontSize: 24,
            color: 'rgba(244,246,242,0.7)',
            marginTop: 6,
            marginLeft: align === 'left' ? 22 : 0,
            marginRight: align === 'right' ? 22 : 0,
            letterSpacing: 1,
            textShadow: '0 3px 14px rgba(0,0,0,0.9)',
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};
