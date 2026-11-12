import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PHOS = '#7CFF9B';

const CODE = [
  '10 REM *** SPACE GAME ***',
  '20 PRINT CHR$(147)',
  '30 X=20 : Y=22 : S=0',
  '40 FOR I=1 TO 8',
  '50 A(I)=INT(RND(1)*38)',
  '60 NEXT I',
  '70 GET K$',
  '80 IF K$="A" THEN X=X-1',
  '90 IF K$="D" THEN X=X+1',
  '100 IF K$=" " THEN GOSUB 500',
  '110 POKE 1024+Y*40+X,30',
  '120 S=S+10 : GOTO 70',
  'RUN',
];

/** Phosphor CRT screen with scanlines, curvature shading and flicker. */
const Screen: React.FC<{children: React.ReactNode; frame: number}> = ({children, frame}) => {
  const flick = 0.94 + 0.06 * random(`fl${frame}`);
  return (
    <div
      style={{
        position: 'absolute',
        left: 70,
        right: 70,
        top: 520,
        height: 760,
        borderRadius: 46,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 45%, #0c2a17 0%, #06140b 60%, #020604 100%)',
        boxShadow: '0 0 0 18px #15171a, 0 0 0 22px #2a2d31, 0 40px 120px rgba(0,0,0,0.9), 0 0 140px rgba(124,255,155,0.18)',
        opacity: flick,
      }}
    >
      {children}
      <AbsoluteFill
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0px, rgba(0,0,0,0.32) 2px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 5px)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 120,
          top: ((frame * 9) % 900) - 120,
          background: 'linear-gradient(180deg, rgba(124,255,155,0), rgba(124,255,155,0.06), rgba(124,255,155,0))',
        }}
      />
    </div>
  );
};

const CodeView: React.FC<{frame: number}> = ({frame}) => {
  const charsPerFrame = 2.2;
  let budget = Math.floor(frame * charsPerFrame);
  const shown: string[] = [];
  for (const line of CODE) {
    if (budget <= 0) break;
    shown.push(line.slice(0, budget));
    budget -= line.length + 4;
  }
  const cursorOn = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{padding: '46px 52px', fontFamily: F.mono, fontSize: 36, lineHeight: 1.36, color: PHOS, textShadow: `0 0 10px ${PHOS}`}}>
      <div style={{opacity: 0.85}}>**** BASIC V2 ****</div>
      <div style={{opacity: 0.85, marginBottom: 18}}>READY.</div>
      {shown.map((l, i) => (
        <div key={i}>
          {l}
          {i === shown.length - 1 && cursorOn ? <span style={{background: PHOS, color: 'transparent'}}>█</span> : null}
        </div>
      ))}
    </div>
  );
};

const GameView: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const t = frame / fps;
  const shipX = 470 + Math.sin(t * 1.7) * 260;
  const px = 10;
  const ship = ['..#..', '.###.', '#####', '#.#.#'];
  const alien = ['#...#', '.###.', '##.##', '.#.#.'];
  const sprite = (rows: string[], x: number, y: number, color: string, key: string) =>
    rows.flatMap((r, ry) =>
      r.split('').map((c, rx) =>
        c === '#' ? (
          <div key={`${key}-${rx}-${ry}`} style={{position: 'absolute', left: x + rx * px, top: y + ry * px, width: px, height: px, background: color}} />
        ) : null,
      ),
    );
  const aliens = Array.from({length: 12}, (_, i) => ({
    x: 120 + (i % 6) * 120 + Math.sin(t * 2) * 40,
    y: 110 + Math.floor(i / 6) * 90 + ((t * 12) % 30),
    alive: random(`al${i}`) * 4 > t - 0.5,
  }));
  const bullets = Array.from({length: 4}, (_, i) => {
    const phase = (t * 1.6 + i * 0.25) % 1;
    return {x: shipX + 20, y: 640 - phase * 560};
  });
  const score = Math.floor(t * 130) * 10;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 40}, (_, i) => (
        <div
          key={`s${i}`}
          style={{
            position: 'absolute',
            left: random(`sx${i}`) * 940,
            top: (random(`sy${i}`) * 760 + t * 60 * (1 + random(`sv${i}`))) % 760,
            width: 4,
            height: 4,
            background: 'rgba(124,255,155,0.55)',
          }}
        />
      ))}
      {aliens.filter((a) => a.alive).flatMap((a, i) => sprite(alien, a.x, a.y, '#FFD23F', `a${i}`))}
      {bullets.map((b, i) => (
        <div key={`b${i}`} style={{position: 'absolute', left: b.x, top: b.y, width: 6, height: 22, background: PHOS, boxShadow: `0 0 10px ${PHOS}`}} />
      ))}
      {sprite(ship, shipX, 650, PHOS, 'ship')}
      <div style={{position: 'absolute', left: 40, top: 26, fontFamily: F.mono, fontSize: 30, color: PHOS, textShadow: `0 0 8px ${PHOS}`}}>
        SCORE {String(score).padStart(6, '0')}
      </div>
    </div>
  );
};

const WebView: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const t = frame / fps;
  const typed = Math.round(interpolate(t, [0.3, 1.4], [0, 6], clamp));
  const amount = '$25.00'.slice(0, typed + 1);
  const progress = interpolate(t, [1.6, 2.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const done = t > 2.7;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#c3c7cb', fontFamily: F.mono}}>
      <div style={{height: 54, background: 'linear-gradient(90deg,#0a1f7a,#2c5be0)', color: '#fff', fontSize: 26, padding: '12px 22px'}}>
        ▣ Netscape — www.payments.example
      </div>
      <div style={{padding: '40px 46px', color: '#111'}}>
        <div style={{fontSize: 40, fontWeight: 600, marginBottom: 28}}>ОНЛАЙН-ПЛАТЁЖ</div>
        <div style={{fontSize: 28, marginBottom: 10}}>Получатель: user@mail.example</div>
        <div style={{fontSize: 28, display: 'flex', gap: 14, alignItems: 'center'}}>
          Сумма:
          <span style={{background: '#fff', border: '3px inset #888', padding: '6px 14px', minWidth: 220}}>{amount}</span>
        </div>
        <div style={{marginTop: 40, height: 40, border: '3px inset #888', background: '#fff'}}>
          <div style={{height: '100%', width: `${progress * 100}%`, background: '#1d3fbf'}} />
        </div>
        <div style={{marginTop: 30, fontSize: 34, fontWeight: 600, color: done ? '#0b7a2e' : '#333'}}>
          {done ? '✓ ПЕРЕВОД ВЫПОЛНЕН' : progress > 0 ? 'ОТПРАВКА…' : ''}
        </div>
      </div>
    </div>
  );
};

/** Full-frame illustrative reconstruction (clearly labelled on screen as an illustration). */
export const RetroCRT: React.FC<{mode: 'code' | 'game' | 'web'; dur: number}> = ({mode, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const push = interpolate(frame, [0, dur * fps], [1.0, 1.08], clamp);
  const tilt = interpolate(frame, [0, dur * fps], [-1.2, 0.6], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, #12161b 0%, #050608 70%)'}}>
      <AbsoluteFill style={{transform: `scale(${push}) rotate(${tilt}deg)`}}>
        <Screen frame={frame}>
          {mode === 'code' ? <CodeView frame={frame} /> : mode === 'game' ? <GameView frame={frame} fps={fps} /> : <WebView frame={frame} fps={fps} />}
        </Screen>
        {/* keyboard edge hint */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            top: 1380,
            height: 120,
            borderRadius: 18,
            background: 'linear-gradient(180deg,#3a3530,#1c1916)',
            boxShadow: '0 -4px 0 #57504a inset, 0 30px 60px rgba(0,0,0,0.8)',
          }}
        >
          {Array.from({length: 26}, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 24 + (i % 13) * 74,
                top: 16 + Math.floor(i / 13) * 50,
                width: 62,
                height: 40,
                borderRadius: 6,
                background: random(`k${i}${Math.floor(frame / 3)}`) > 0.93 && mode === 'code' ? '#6b645c' : '#4a443e',
                boxShadow: '0 4px 0 #24201c',
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
