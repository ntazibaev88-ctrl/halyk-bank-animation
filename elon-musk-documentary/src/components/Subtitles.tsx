import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SAFE} from '../theme';
import type {SubT} from '../types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Tok = {w: string; hot: boolean};

/** "*keyword phrase*" -> highlighted tokens */
const tokenize = (s: string): Tok[] => {
  const out: Tok[] = [];
  let hot = false;
  for (const raw of s.split(' ')) {
    let w = raw;
    let startsHot = false;
    let endsHot = false;
    if (w.startsWith('*')) {
      startsHot = true;
      w = w.slice(1);
    }
    const m = w.match(/\*([.,:;?!—]*)$/);
    if (m) {
      endsHot = true;
      w = w.replace(/\*([.,:;?!—]*)$/, '$1');
    }
    if (startsHot) hot = true;
    out.push({w, hot});
    if (endsHot) hot = false;
  }
  return out;
};

/**
 * Russian subtitles: max two lines, white with yellow keywords, words rise in with a short stagger.
 * Sits in the lower-middle band, above the TikTok caption/UI zone and left of the action rail.
 */
export const Subtitles: React.FC<{subs: SubT[]}> = ({subs}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cur = subs.find((s) => t >= s.start && t < s.end);
  if (!cur) return null;
  const local = (t - cur.start) * fps;
  const remain = (cur.end - t) * fps;
  const toks = tokenize(cur.text);
  const out = interpolate(remain, [0, 4], [0, 1], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.left - 10,
        right: SAFE.right - 30,
        bottom: SAFE.bottom + 70,
        display: 'flex',
        justifyContent: 'center',
        opacity: out,
      }}
    >
      <div
        style={{
          maxWidth: 880,
          textAlign: 'center',
          textWrap: 'balance',
          fontFamily: F.body,
          fontSize: 54,
          fontWeight: 800,
          lineHeight: 1.18,
        } as React.CSSProperties}
      >
        {toks.map((tk, i) => {
          const d = i * 1.6;
          const k = interpolate(local, [d, d + 7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          return [
            <span
              key={`w${i}`}
              style={{
                display: 'inline-block',
                margin: '0 1px',
                fontFamily: F.body,
                fontWeight: 800,
                fontSize: 54,
                lineHeight: 1.18,
                color: tk.hot ? C.yellow : C.white,
                opacity: k,
                transform: `translateY(${(1 - k) * 18}px)`,
                textShadow:
                  '0 0 2px rgba(0,0,0,0.95), 0 3px 6px rgba(0,0,0,0.85), 0 8px 28px rgba(0,0,0,0.7)',
                WebkitTextStroke: '1.2px rgba(0,0,0,0.55)',
                paintOrder: 'stroke fill',
              }}
            >
              {tk.w}
            </span>,
            ' ',
          ];
        })}
      </div>
    </div>
  );
};
