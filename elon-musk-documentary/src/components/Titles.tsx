import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SAFE} from '../theme';
import type {TitleT} from '../types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Splits "A|B" into lines (| = forced break). */
const lines = (s: string) => s.split('|');

/** Chapter title: mono kicker + yellow rule + big condensed headline revealed line by line. */
export const ChapterTitle: React.FC<{t: TitleT}> = ({t}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const f = frame; // local to the Sequence
  const total = t.dur * fps;
  const out = interpolate(f, [total - 12, total], [1, 0], clamp);
  const ruleW = interpolate(f, [0, 16], [0, 120], {...clamp, easing: Easing.out(Easing.cubic)});
  const kick = interpolate(f, [4, 18], [0, 1], clamp);
  const kickerChars = Math.round(interpolate(f, [4, 26], [0, t.kicker.length], clamp));
  const ls = lines(t.text);
  const big = t.variant === 'question' ? 104 : 96;

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE.top + 70,
        left: SAFE.left,
        right: SAFE.right - 40,
        opacity: out,
        filter: out < 1 ? `blur(${(1 - out) * 8}px)` : undefined,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: kick}}>
        <div style={{width: ruleW, height: 5, background: C.yellow, boxShadow: '0 0 18px rgba(255,201,60,0.6)'}} />
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: '0.18em',
            color: C.yellow,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            whiteSpace: 'nowrap',
          }}
        >
          {t.kicker.slice(0, kickerChars)}
        </div>
      </div>
      <div style={{marginTop: 22}}>
        {ls.map((line, i) => {
          const d = 10 + i * 6;
          const k = interpolate(f, [d, d + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const track = interpolate(f, [d, d + 40], [0.16, 0.035], {...clamp, easing: Easing.out(Easing.quad)});
          return (
            <div key={i} style={{overflow: 'hidden', paddingBottom: 6}}>
              <div
                style={{
                  fontFamily: F.title,
                  fontWeight: 600,
                  fontSize: big,
                  lineHeight: 1.04,
                  textTransform: 'uppercase',
                  color: i === ls.length - 1 && t.variant === 'question' ? C.yellow : C.white,
                  letterSpacing: `${track}em`,
                  transform: `translateY(${(1 - k) * 105}%)`,
                  textShadow: '0 6px 30px rgba(0,0,0,0.75)',
                }}
              >
                {line}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Opening hook line: appears within the first second to stop the scroll. */
export const HookTitle: React.FC<{t: TitleT}> = ({t}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = t.dur * fps;
  const out = interpolate(frame, [total - 10, total], [1, 0], clamp);
  const words = t.text.split(' ');
  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE.top + 90,
        left: SAFE.left,
        right: SAFE.right - 30,
        opacity: out,
        transform: `scale(${interpolate(frame, [0, total], [1.04, 1], clamp)})`,
        transformOrigin: 'left top',
      }}
    >
      <div
        style={{
          fontFamily: F.mono,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: C.yellow,
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
          marginBottom: 18,
        }}
      >
        {t.kicker}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 24}}>
        {words.map((w, i) => {
          const d = 2 + i * 3;
          const k = interpolate(frame, [d, d + 10], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
          return (
            <span
              key={i}
              style={{
                fontFamily: F.title,
                fontWeight: 700,
                fontSize: 112,
                lineHeight: 1.02,
                textTransform: 'uppercase',
                color: w.startsWith('ИЗМЕНИТЬ') || w.startsWith('МИР') ? C.yellow : C.white,
                opacity: k,
                transform: `translateY(${(1 - k) * 40}px) scale(${0.9 + 0.1 * k})`,
                display: 'inline-block',
                textShadow: '0 8px 40px rgba(0,0,0,0.8)',
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Main documentary title card "ИЛОН МАСК" with sub-line, centred. */
export const MainTitle: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = dur * fps;
  const inK = interpolate(frame, [0, 22], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = interpolate(frame, [total - 12, total], [1, 0], clamp);
  const track = interpolate(frame, [0, total], [0.32, 0.12], clamp);
  const line = interpolate(frame, [8, 30], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        top: 700,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: out * inK,
        filter: `blur(${(1 - inK) * 14}px)`,
      }}
    >
      <div
        style={{
          fontFamily: F.title,
          fontWeight: 700,
          fontSize: 168,
          letterSpacing: `${track}em`,
          color: C.white,
          paddingLeft: `${track}em`,
          textShadow: '0 10px 60px rgba(0,0,0,0.85)',
        }}
      >
        ИЛОН МАСК
      </div>
      <div style={{margin: '18px auto 0', width: 560 * line, height: 3, background: C.yellow}} />
      <div
        style={{
          marginTop: 22,
          fontFamily: F.mono,
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: '0.22em',
          color: C.dim,
          opacity: line,
        }}
      >
        ДОКУМЕНТАЛЬНАЯ ИСТОРИЯ
      </div>
    </div>
  );
};
