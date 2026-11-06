import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TL} from '../lib/timeline';
import {C, FONT_BODY} from '../theme';
import {io, easeOut, pop} from '../lib/anim';

const all = TL.scenes.flatMap((s) => s.phrases.map((p, i) => ({...p, last: i === s.phrases.length - 1})));

/** Large, bold Russian subtitles with word-level karaoke sync, kept inside TikTok safe margins. */
export const Subtitles: React.FC<{top?: number}> = ({top = 1335}) => {
  const frame = useCurrentFrame();
  const t = frame / TL.fps;
  let idx = -1;
  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    const until = p.last ? p.end + 0.35 : Math.min(all[i + 1]?.start ?? Infinity, p.end + 0.6);
    if (t >= p.start - 0.04 && t < until) idx = i;
  }
  if (idx < 0) return null;
  const p = all[idx];
  const lf = frame - Math.round(p.start * TL.fps);
  const s = 0.86 + 0.14 * pop(lf, -1, 14, 220, 0.6);
  const until = p.last ? p.end + 0.35 : Math.min(all[idx + 1]?.start ?? Infinity, p.end + 0.6);
  const outO = io(t, [until - 0.12, until], [1, 0]);
  const inO = io(lf, [-1, 3], [0, 1], easeOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top,
        display: 'flex',
        justifyContent: 'center',
        opacity: inO * outO,
        transform: `scale(${s}) translateY(${(1 - inO) * 18}px)`,
        transformOrigin: '50% 50%',
      }}
    >
      <div
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 900,
          fontSize: 70,
          lineHeight: 1.12,
          textAlign: 'center',
          color: C.sub,
          padding: '16px 30px 20px',
          borderRadius: 28,
          background: 'rgba(6,10,24,0.58)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
          maxWidth: 900,
          letterSpacing: -0.5,
        }}
      >
        {p.words.map((w, i) => {
          const spoken = t >= w.s - 0.03;
          const active = t >= w.s - 0.03 && t < w.e;
          return (
            <React.Fragment key={i}>
            <span
              style={{
                color: w.hl ? C.subHi : C.sub,
                opacity: spoken ? 1 : 0.5,
                display: 'inline-block',
                transform: `scale(${active ? 1.03 : 1})`,
                margin: i < p.words.length - 1 ? '0 0.42em 0 0' : 0,
                textShadow: '0 4px 0 rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.5)',
              }}
            >
              {w.t}
            </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
