import {Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, SAFE} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** fade in/out envelope for a graphic living `dur` seconds inside its Sequence */
const useEnv = (dur: number, fin = 12, fout = 12) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = dur * fps;
  return {
    frame,
    fps,
    env: Math.min(interpolate(frame, [0, fin], [0, 1], clamp), interpolate(frame, [total - fout, total], [1, 0], clamp)),
  };
};

/* ------------------------------------------------------------------ location / date caption */
export const LocationTag: React.FC<{dur: number; text: string; sub?: string}> = ({dur, text, sub}) => {
  const {frame, env} = useEnv(dur, 6, 14);
  const chars = Math.round(interpolate(frame, [0, 28], [0, text.length], clamp));
  const cursor = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: SAFE.left, top: 1080, opacity: env}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <svg width="30" height="38" viewBox="0 0 24 30">
          <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.5 12 30 12 30s12-9.5 12-18.3C24 5.2 18.6 0 12 0z" fill={C.yellow} />
          <circle cx="12" cy="11.5" r="4.6" fill={C.ink} />
        </svg>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: '0.12em',
            color: C.white,
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {text.slice(0, chars)}
          <span style={{opacity: cursor && chars < text.length + 6 ? 1 : 0, color: C.yellow}}>▌</span>
        </div>
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 8,
            marginLeft: 44,
            fontFamily: F.mono,
            fontSize: 24,
            letterSpacing: '0.16em',
            color: C.dim,
            opacity: interpolate(frame, [24, 36], [0, 1], clamp),
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ big year stamp */
export const YearStamp: React.FC<{dur: number; from: number; to: number; label?: string}> = ({dur, from, to, label}) => {
  const {frame, env} = useEnv(dur, 8, 14);
  const v = Math.round(interpolate(frame, [0, 26], [from, to], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{position: 'absolute', right: SAFE.right + 10, top: 640, textAlign: 'right', opacity: env}}>
      <div
        style={{
          fontFamily: F.title,
          fontWeight: 700,
          fontSize: 210,
          lineHeight: 0.9,
          color: 'transparent',
          WebkitTextStroke: `3px ${C.yellow}`,
          textShadow: '0 0 40px rgba(255,201,60,0.25)',
          letterSpacing: '0.02em',
        }}
      >
        {v}
      </div>
      {label ? (
        <div style={{fontFamily: F.mono, fontSize: 26, letterSpacing: '0.2em', color: C.white, marginTop: 10}}>{label}</div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ digital payments network */
export const Payments: React.FC<{dur: number}> = ({dur}) => {
  const {frame, env} = useEnv(dur, 14, 16);
  const nodes = Array.from({length: 9}, (_, i) => ({
    x: 140 + random(`px${i}`) * 760,
    y: 640 + random(`py${i}`) * 460,
  }));
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [0, 4], [1, 6], [2, 7], [3, 8], [0, 8],
  ];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: env * 0.95}}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {edges.map(([a, b], i) => {
        const draw = interpolate(frame, [i * 2, i * 2 + 18], [0, 1], clamp);
        const A = nodes[a];
        const B = nodes[b];
        const len = Math.hypot(B.x - A.x, B.y - A.y);
        const p = ((frame + i * 13) % 45) / 45;
        return (
          <g key={i}>
            <line
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke="rgba(62,198,224,0.55)"
              strokeWidth={2}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - draw)}
            />
            {draw > 0.99 ? (
              <g filter="url(#glow)">
                <circle cx={A.x + (B.x - A.x) * p} cy={A.y + (B.y - A.y) * p} r={7} fill={C.yellow} />
              </g>
            ) : null}
          </g>
        );
      })}
      {nodes.map((n, i) => {
        const k = interpolate(frame, [i * 2, i * 2 + 10], [0, 1], clamp);
        const pulse = 1 + 0.25 * Math.sin((frame + i * 9) / 6);
        return (
          <g key={i} filter="url(#glow)" opacity={k}>
            <circle cx={n.x} cy={n.y} r={16 * pulse} fill="none" stroke="rgba(62,198,224,0.5)" strokeWidth={2} />
            <circle cx={n.x} cy={n.y} r={8} fill={C.teal} />
            <text x={n.x + 18} y={n.y - 14} fontFamily="JetBrains Mono" fontSize={24} fill="rgba(245,243,238,0.85)">
              $
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ neural network / brain-computer */
export const Neural: React.FC<{dur: number}> = ({dur}) => {
  const {frame, env} = useEnv(dur, 14, 16);
  const layers = [4, 6, 6, 3];
  const x0 = 170;
  const dx = 240;
  const pts = layers.map((n, li) =>
    Array.from({length: n}, (_, i) => ({x: x0 + li * dx, y: 870 + (i - (n - 1) / 2) * 92})),
  );
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: env}}>
      <defs>
        <filter id="g2">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {pts.slice(0, -1).map((layer, li) =>
        layer.flatMap((a, ai) =>
          pts[li + 1].map((b, bi) => {
            const act = 0.5 + 0.5 * Math.sin(frame / 7 - li * 1.3 + ai * 0.9 + bi * 0.7);
            const draw = interpolate(frame, [li * 6, li * 6 + 16], [0, 1], clamp);
            return (
              <line
                key={`${li}-${ai}-${bi}`}
                x1={a.x}
                y1={a.y}
                x2={a.x + (b.x - a.x) * draw}
                y2={a.y + (b.y - a.y) * draw}
                stroke={act > 0.8 ? C.yellow : 'rgba(62,198,224,0.35)'}
                strokeWidth={act > 0.8 ? 2.6 : 1.4}
                opacity={0.35 + act * 0.6}
              />
            );
          }),
        ),
      )}
      {pts.flatMap((layer, li) =>
        layer.map((p, i) => {
          const act = 0.5 + 0.5 * Math.sin(frame / 6 - li + i);
          const k = interpolate(frame, [li * 6, li * 6 + 10], [0, 1], clamp);
          return (
            <g key={`n${li}-${i}`} filter="url(#g2)" opacity={k}>
              <circle cx={p.x} cy={p.y} r={13 + act * 5} fill={act > 0.75 ? C.yellow : C.teal} opacity={0.9} />
            </g>
          );
        }),
      )}
      <text
        x={540}
        y={1170}
        textAnchor="middle"
        fontFamily="JetBrains Mono"
        fontSize={26}
        letterSpacing={5}
        fill="rgba(245,243,238,0.8)"
        opacity={interpolate(frame, [20, 34], [0, 1], clamp)}
      >
        МОЗГ ⇄ КОМПЬЮТЕР
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ social feed (generic, no real posts) */
export const Feed: React.FC<{dur: number}> = ({dur}) => {
  const {frame, fps, env} = useEnv(dur, 12, 14);
  const scroll = interpolate(frame, [0, dur * fps], [40, -520], clamp);
  const cards = Array.from({length: 6}, (_, i) => i);
  const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${Math.round(n / 1e3)}K` : `${n}`);
  return (
    <div style={{position: 'absolute', left: 90, right: 200, top: 880, height: 380, overflow: 'hidden', opacity: env, maskImage: 'linear-gradient(180deg, transparent 0%, black 12%, black 82%, transparent 100%)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 12%, black 82%, transparent 100%)'}}>
      <div style={{transform: `translateY(${scroll}px)`}}>
        {cards.map((i) => {
          const base = 20000 + random(`f${i}`) * 900000;
          const grow = interpolate(frame, [i * 6, dur * fps], [0, 1], clamp);
          const likes = Math.round(base * (0.2 + 0.8 * grow));
          const reposts = Math.round(likes * 0.18);
          const k = interpolate(frame, [i * 5, i * 5 + 10], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                marginBottom: 22,
                padding: '22px 26px',
                borderRadius: 22,
                background: 'rgba(10,12,16,0.72)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                opacity: k,
                transform: `translateX(${(1 - k) * 60}px)`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <div style={{width: 46, height: 46, borderRadius: 23, background: 'rgba(255,255,255,0.22)'}} />
                <div style={{height: 14, width: 170 + random(`w${i}`) * 90, borderRadius: 7, background: 'rgba(255,255,255,0.4)'}} />
              </div>
              <div style={{marginTop: 16, height: 12, width: '92%', borderRadius: 6, background: 'rgba(255,255,255,0.18)'}} />
              <div style={{marginTop: 10, height: 12, width: `${55 + random(`l${i}`) * 35}%`, borderRadius: 6, background: 'rgba(255,255,255,0.18)'}} />
              <div
                style={{
                  marginTop: 16,
                  display: 'flex',
                  gap: 34,
                  fontFamily: F.mono,
                  fontSize: 24,
                  color: 'rgba(245,243,238,0.8)',
                }}
              >
                <span>♥ {fmt(likes)}</span>
                <span>⟲ {fmt(reposts)}</span>
                <span style={{color: C.yellow}}>💬 {fmt(Math.round(likes * 0.07))}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ Earth -> Mars trajectory */
export const MarsPath: React.FC<{dur: number}> = ({dur}) => {
  const {frame, env} = useEnv(dur, 12, 14);
  const draw = interpolate(frame, [6, 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const path = 'M 200 1080 C 380 760, 700 700, 880 880';
  const L = 820;
  // approximate point along the cubic for the craft
  const t = draw;
  const bx = (a: number, b: number, c: number, d: number) =>
    (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
  const cx = bx(200, 380, 700, 880);
  const cy = bx(1080, 760, 700, 880);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: env}}>
      <path d={path} stroke="rgba(245,243,238,0.25)" strokeWidth={2} strokeDasharray="6 12" fill="none" />
      <path d={path} stroke={C.yellow} strokeWidth={4} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
      <circle cx={200} cy={1080} r={30} fill="#2E7FD8" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
      <circle cx={880} cy={880} r={24} fill="#C1440E" stroke="rgba(255,255,255,0.7)" strokeWidth={2} />
      <circle cx={cx} cy={cy} r={9} fill={C.yellow} />
      <text x={200} y={1140} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={24} letterSpacing={4} fill={C.white}>
        ЗЕМЛЯ
      </text>
      <text x={880} y={938} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={24} letterSpacing={4} fill={C.white}>
        МАРС
      </text>
      <text
        x={540}
        y={690}
        textAnchor="middle"
        fontFamily="JetBrains Mono"
        fontSize={22}
        letterSpacing={4}
        fill="rgba(245,243,238,0.7)"
        opacity={interpolate(frame, [30, 44], [0, 1], clamp)}
      >
        ЦЕЛЬ · БУДУЩЕЕ
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ battery charge HUD */
export const Battery: React.FC<{dur: number}> = ({dur}) => {
  const {frame, fps, env} = useEnv(dur, 10, 14);
  const lvl = interpolate(frame, [6, dur * fps - 10], [0.08, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  return (
    <div style={{position: 'absolute', left: SAFE.left, top: 1060, opacity: env, display: 'flex', alignItems: 'center', gap: 20}}>
      <div style={{position: 'relative', width: 150, height: 66, border: `3px solid ${C.white}`, borderRadius: 12, padding: 5}}>
        <div
          style={{
            height: '100%',
            width: `${lvl * 100}%`,
            borderRadius: 6,
            background: lvl > 0.8 ? '#5BE37D' : C.yellow,
            boxShadow: `0 0 18px ${lvl > 0.8 ? 'rgba(91,227,125,0.7)' : 'rgba(255,201,60,0.6)'}`,
          }}
        />
        <div style={{position: 'absolute', right: -14, top: 20, width: 9, height: 22, background: C.white, borderRadius: 3}} />
      </div>
      <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 36, color: C.white, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>
        {Math.round(lvl * 100)}% <span style={{fontSize: 22, color: C.dim, letterSpacing: '0.14em'}}>⚡ ЗАРЯД</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ HUD scan line over tech shots */
export const Scan: React.FC<{dur: number}> = ({dur}) => {
  const {frame, fps, env} = useEnv(dur, 8, 10);
  const y = interpolate(frame % (fps * 2), [0, fps * 2], [300, 1500]);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: env * 0.8, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(62,198,224,0.9), transparent)',
          boxShadow: '0 0 24px rgba(62,198,224,0.8)',
        }}
      />
      {[0, 1, 2, 3].map((i) => {
        const pos = [
          {left: 90, top: 520},
          {right: 170, top: 520},
          {left: 90, top: 1250},
          {right: 170, top: 1250},
        ][i];
        const rot = [0, 90, 270, 180][i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: 60,
              height: 60,
              borderTop: `3px solid ${C.teal}`,
              borderLeft: `3px solid ${C.teal}`,
              transform: `rotate(${rot}deg)`,
              opacity: 0.8,
            }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ small archive / source label */
export const SourceTag: React.FC<{text: string}> = ({text}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.left,
      top: SAFE.top + 4,
      fontFamily: F.mono,
      fontSize: 21,
      letterSpacing: '0.16em',
      color: 'rgba(245,243,238,0.72)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textShadow: '0 1px 6px rgba(0,0,0,0.9)',
    }}
  >
    <span style={{width: 10, height: 10, borderRadius: 5, background: '#E5484D', display: 'inline-block'}} />
    {text}
  </div>
);
