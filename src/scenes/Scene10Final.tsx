import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, Stars, Vignette} from '../components/Common';
import {Globe} from '../components/Globe';
import {WavingFlag} from '../components/Flag';
import {NoirxLogo} from '../components/Logo';
import {PLACES} from '../lib/geo';
import {easeInOut, easeOut, io, pop} from '../lib/anim';
import {C, FONT_BODY, FONT_TITLE} from '../theme';

const LOGO = 214;
const CTA = 240;

export const Scene10Final: React.FC = () => {
  const {f, dur} = useScene();
  // globe decelerates and stops in the centre
  const spin = 40 * (1 - Math.pow(1 - Math.min(1, f / 60), 3));
  const rot: [number, number, number] = [-42 + spin, -64, 0];
  const outro = io(f, [LOGO - 8, LOGO + 16], [0, 1], easeInOut);
  const R = 300 * (1 - outro * 0.25);
  const gy = 820 - outro * 40;
  const q1 = pop(f, 14, 11, 150);
  const q2 = pop(f, 128, 10, 170);
  const textOut = 1 - outro;
  const cta = pop(f, CTA, 12, 120);
  const fadeEnd = io(f, [dur - 14, dur], [0, 1]);
  const flagIn = pop(f, 2, 12, 110);

  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 15% 55%, rgba(40,80,220,0.45), rgba(0,0,0,0) 45%), radial-gradient(circle at 85% 55%, rgba(220,40,20,0.4), rgba(0,0,0,0) 45%), linear-gradient(180deg,#03050c,#0a1230 60%,#05070f)',
      }}
    >
      <Canvas>
        <Stars frame={f} n={150} seed={51} />
        <g opacity={1 - outro * 0.7}>
          <Globe id="final-globe" cx={540} cy={gy} r={R} rotate={rot} frame={f} highlight={1}
            markers={[
              {at: PLACES.washington, color: '#5d8fff', pulse: true},
              {at: PLACES.beijing, color: '#ff5a3c', pulse: true},
            ]}
            arcs={[{id: 'fa', from: PLACES.washington, to: PLACES.beijing, color: C.gold, progress: io(f, [20, 70], [0, 1]), width: 6}]}
          />
        </g>
        <g opacity={textOut}>
          <g transform={`translate(60 ${1110 - (1 - flagIn) * 60}) scale(${flagIn}) translate(-60 -1110)`}>
            <WavingFlag kind="us" id="final-us" x={60} y={1010} w={240} frame={f} poleH={300} />
          </g>
          <g transform={`translate(810 ${1110 - (1 - flagIn) * 60}) scale(${flagIn}) translate(-810 -1110)`}>
            <WavingFlag kind="cn" id="final-cn" x={810} y={1010} w={215} frame={f + 13} poleH={300} />
          </g>
        </g>
        {/* dim behind logo */}
        <rect width={1080} height={1920} fill="#03050c" opacity={outro * 0.55} />
        {f >= LOGO - 2 && <NoirxLogo lf={f - LOGO} cy={900} />}
        {/* call to action */}
        {cta > 0.01 && (
          <g transform={`translate(540 1180) scale(${cta})`}>
            <rect x={-470} y={-70} width={940} height={140} rx={70} fill="#ffd400" />
            <g transform={`translate(-392 0) rotate(${Math.sin(f / 5) * 8})`}>
              <path d="M-36,-30 h72 a12,12 0 0 1 12,12 v36 a12,12 0 0 1 -12,12 h-40 l-20,18 v-18 h-12 a12,12 0 0 1 -12,-12 v-36 a12,12 0 0 1 12,-12z" fill="#111" />
              {[-18, 0, 18].map((x, i) => (
                <circle key={x} cx={x} cy={0} r={5} fill="#ffd400" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 6 + i))} />
              ))}
            </g>
            <text x={40} y={-8} fontFamily={FONT_BODY} fontWeight={900} fontSize={40} fill="#111" textAnchor="middle">НАПИШИ СВОЁ МНЕНИЕ</text>
            <text x={40} y={38} fontFamily={FONT_BODY} fontWeight={900} fontSize={40} fill="#111" textAnchor="middle">В КОММЕНТАРИЯХ</text>
          </g>
        )}
      </Canvas>
      {/* headline questions */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', opacity: textOut, fontFamily: FONT_TITLE}}>
        <div
          style={{
            fontSize: 112,
            color: '#fff',
            transform: `scale(${0.5 + 0.5 * q1}) translateY(${(1 - q1) * 40}px)`,
            opacity: Math.min(1, q1 * 1.4),
            textShadow: '0 8px 0 rgba(0,0,0,0.5), 0 0 40px rgba(255,212,0,0.45)',
          }}
        >
          КТО <span style={{color: C.subHi}}>ПОБЕДИТ?</span>
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 76,
            transform: `scale(${q2}) rotate(${(1 - q2) * -8}deg)`,
            opacity: Math.min(1, q2 * 1.4),
            textShadow: '0 6px 0 rgba(0,0,0,0.5)',
          }}
        >
          <span style={{color: '#8fb4ff'}}>США</span>
          <span style={{color: '#fff', fontSize: 56, margin: '0 22px'}}>ИЛИ</span>
          <span style={{color: C.cnGold}}>КИТАЙ?</span>
        </div>
      </div>
      <Vignette strength={0.55} />
      <AbsoluteFill style={{background: '#000', opacity: fadeEnd}} />
      {/* subtle light sweep on the logo moment */}
      <AbsoluteFill style={{background: '#fff', opacity: io(f, [LOGO, LOGO + 3], [0, 0.35]) * io(f, [LOGO + 3, LOGO + 12], [1, 0], easeOut)}} />
    </AbsoluteFill>
  );
};
