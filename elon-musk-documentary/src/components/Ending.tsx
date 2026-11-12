import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Final statement + question, then the subscribe call-to-action. Times are local seconds. */
export const Ending: React.FC<{ctaAt: number; credits: string}> = ({ctaAt, credits}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const a = interpolate(frame, [0, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const b = interpolate(frame, [20, 40], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const cta = interpolate(t, [ctaAt, ctaAt + 0.6], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const shade = interpolate(frame, [0, 24], [0, 0.55], clamp);
  const bell = Math.sin(Math.max(0, t - ctaAt - 0.5) * 18) * 14 * Math.exp(-Math.max(0, t - ctaAt - 0.5) * 2.2);
  const pulse = 1 + 0.035 * Math.sin(Math.max(0, t - ctaAt) * 6);
  const fadeAll = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0.0], clamp);

  return (
    <AbsoluteFill style={{opacity: fadeAll}}>
      <AbsoluteFill style={{backgroundColor: `rgba(3,4,6,${shade})`}} />
      <div style={{position: 'absolute', top: 560, left: 80, right: 120, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: F.title,
            fontWeight: 700,
            fontSize: 112,
            lineHeight: 1.02,
            color: C.white,
            letterSpacing: `${interpolate(frame, [0, 60], [0.12, 0.03], clamp)}em`,
            opacity: a,
            transform: `translateY(${(1 - a) * 40}px)`,
            textShadow: '0 10px 50px rgba(0,0,0,0.85)',
          }}
        >
          ОН ИЗМЕНЯЕТ
          <br />
          БУДУЩЕЕ.
        </div>
        <div style={{width: 160 * b, height: 4, background: C.yellow, margin: '34px auto'}} />
        <div
          style={{
            fontFamily: F.title,
            fontWeight: 500,
            fontSize: 70,
            lineHeight: 1.12,
            color: C.yellow,
            opacity: b,
            transform: `translateY(${(1 - b) * 30}px)`,
            textShadow: '0 8px 40px rgba(0,0,0,0.85)',
          }}
        >
          НО КАКОЙ БУДЕТ
          <br />
          ЕГО СЛЕДУЮЩАЯ ЦЕЛЬ?
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1200,
          left: 90,
          right: 130,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, cta * 1.2),
          transform: `scale(${(0.7 + 0.3 * cta) * pulse})`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '26px 38px',
            borderRadius: 999,
            background: 'linear-gradient(90deg, #FFC93C, #FF9F1C)',
            boxShadow: '0 12px 50px rgba(255,159,28,0.45)',
          }}
        >
          <svg width="46" height="50" viewBox="0 0 24 26" style={{transform: `rotate(${bell}deg)`, transformOrigin: '50% 10%'}}>
            <path
              d="M12 26a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3zm9-7v-1l-2-2v-5c0-3.3-2-6-5-6.8V3a2 2 0 1 0-4 0v1.2C7 5 5 7.7 5 11v5l-2 2v1z"
              fill={C.ink}
            />
          </svg>
          <div
            style={{
              fontFamily: F.body,
              fontWeight: 900,
              fontSize: 34,
              lineHeight: 1.15,
              color: C.ink,
              textAlign: 'left',
            }}
          >
            ПОДПИСЫВАЙСЯ НА КАНАЛ
            <br />
            <span style={{fontWeight: 700, fontSize: 28}}>ЗА НОВЫМИ ИСТОРИЯМИ</span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 470,
          left: 90,
          right: 150,
          textAlign: 'center',
          fontFamily: F.mono,
          fontSize: 17,
          lineHeight: 1.45,
          letterSpacing: '0.06em',
          color: 'rgba(245,243,238,0.5)',
          opacity: Math.min(1, cta),
        }}
      >
        {credits}
      </div>
    </AbsoluteFill>
  );
};
