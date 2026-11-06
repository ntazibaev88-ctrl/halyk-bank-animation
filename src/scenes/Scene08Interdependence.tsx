import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, Stars, SubtitleBed, Vignette} from '../components/Common';
import {Globe} from '../components/Globe';
import {WavingFlag} from '../components/Flag';
import {easeIn, easeOut, io, pop, wrap} from '../lib/anim';
import {C, FONT_BODY, FONT_TITLE} from '../theme';

const GX = 540;
const GY = 720;
const GR = 215;

const bez = (p0: number[], p1: number[], p2: number[], t: number) => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1],
];

const TOP = [[200, 900], [540, -90], [880, 900]];
const BOT = [[880, 1010], [540, 1200], [200, 1010]];

const Product: React.FC<{kind: number}> = ({kind}) => {
  switch (kind % 5) {
    case 0:
      return (
        <g>
          <rect x={-22} y={-18} width={44} height={36} rx={4} fill="#c98d4a" />
          <rect x={-22} y={-18} width={44} height={8} fill="#a8723a" />
          <rect x={-4} y={-18} width={8} height={36} fill="#e8c38a" />
        </g>
      );
    case 1:
      return (
        <g>
          <rect x={-18} y={-18} width={36} height={36} rx={5} fill="#2a3044" />
          <rect x={-8} y={-8} width={16} height={16} fill="#ffd400" />
          {[-12, 0, 12].map((d) => (
            <g key={d} stroke="#e8c46a" strokeWidth={3}>
              <line x1={d} y1={-18} x2={d} y2={-25} />
              <line x1={d} y1={18} x2={d} y2={25} />
            </g>
          ))}
        </g>
      );
    case 2:
      return (
        <g>
          <rect x={-14} y={-24} width={28} height={48} rx={6} fill="#e8f0ff" />
          <rect x={-10} y={-18} width={20} height={32} rx={2} fill="#3d6fe0" />
        </g>
      );
    case 3:
      return (
        <g>
          <path d="M-20,-16 Q0,-26 20,-16 L22,18 Q0,24 -22,18Z" fill="#e3c27a" />
          <text y={8} fontFamily={FONT_BODY} fontWeight={900} fontSize={13} fill="#6b4a1a" textAnchor="middle">СОЯ</text>
        </g>
      );
    default:
      return (
        <g>
          <path d="M-26,0 L18,-4 L28,0 L18,4Z" fill="#e8f0ff" />
          <path d="M-2,-2 L-14,-20 L-6,-20 L10,-2Z M-2,2 L-14,20 L-6,20 L10,2Z" fill="#c9d1de" />
        </g>
      );
  }
};

const Factory: React.FC<{x: number; y: number; roof: string; wall: string; f: number; flip?: boolean}> = ({x, y, roof, wall, f, flip}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    {[0, 1].map((k) => (
      <g key={k}>
        <rect x={150 + k * 50} y={-260} width={30} height={160} fill="#5b6378" />
        <rect x={150 + k * 50} y={-260} width={30} height={10} fill={roof} />
        {Array.from({length: 3}).map((_, i) => {
          const p = wrap(f / 45 + i / 3 + k * 0.4, 1);
          return <circle key={i} cx={165 + k * 50 + p * 40} cy={-270 - p * 140} r={14 + p * 26} fill="#e9edf5" opacity={0.55 * (1 - p)} />;
        })}
      </g>
    ))}
    <rect x={0} y={-150} width={260} height={150} fill={wall} />
    <path d="M0,-150 L50,-200 L50,-150 L100,-200 L100,-150 L150,-200 L150,-150 L200,-200 L200,-150 L260,-200 L260,-150Z" fill={roof} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={20 + i * 50} y={-120} width={36} height={40} rx={4} fill="#ffe7a8" opacity={0.6 + 0.4 * Math.sin(f / 7 + i)} />
    ))}
    <rect x={180} y={-90} width={64} height={90} fill="#2a3044" />
    <rect x={180} y={-90} width={64} height={90 * (0.5 + 0.5 * Math.sin(f / 20))} fill={roof} opacity={0.85} />
  </g>
);

export const Scene08Interdependence: React.FC = () => {
  const {f, dur} = useScene();
  const stamp = pop(f, 4, 9, 200);
  const stampOut = io(f, [42, 54], [1, 0]);
  const arcs = io(f, [30, 70], [0, 1], easeOut);
  const ringP = io(f, [118, 150], [0, 1], easeOut);
  const vsToEx = io(f, [78, 96], [0, 1]);
  const endZoom = io(f, [dur - 30, dur + 10], [1, 1.35], easeIn);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 38%, #1f2a66 0%, #0c1233 55%, #060815 100%)'}}>
      <Canvas>
        <defs>
          <path id="ring-path" d={`M${GX - GR - 50},${GY} a${GR + 50},${GR + 50} 0 1 1 ${2 * (GR + 50)},0 a${GR + 50},${GR + 50} 0 1 1 ${-2 * (GR + 50)},0`} />
        </defs>
        <g transform={`translate(${GX} ${GY}) scale(${endZoom}) translate(${-GX} ${-GY})`}>
          <Stars frame={f} n={90} seed={21} h={1200} />
          <rect x={0} y={1090} width={1080} height={20} fill="#2a3166" />
          {/* trade arcs */}
          {[TOP, BOT].map((pts, k) => {
            const d = `M${pts[0][0]},${pts[0][1]} Q${pts[1][0]},${pts[1][1]} ${pts[2][0]},${pts[2][1]}`;
            return (
              <g key={k}>
                <path d={d} fill="none" stroke={k ? '#ff5a3c' : '#5d8fff'} strokeWidth={14} opacity={0.25} pathLength={1} strokeDasharray={`${arcs} 1`} />
                <path d={d} fill="none" stroke={k ? '#ff5a3c' : '#5d8fff'} strokeWidth={5} pathLength={1} strokeDasharray={`${arcs} 1`} />
                {arcs >= 1 &&
                  Array.from({length: 8}).map((_, i) => {
                    const t = wrap(f / 120 + i / 8, 1);
                    const [x, y] = bez(pts[0], pts[1], pts[2], t);
                    const [x2, y2] = bez(pts[0], pts[1], pts[2], Math.min(1, t + 0.01));
                    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
                    return <polygon key={i} points="-8,-8 6,0 -8,8" fill="#fff" opacity={0.7} transform={`translate(${x} ${y}) rotate(${ang})`} />;
                  })}
              </g>
            );
          })}
          {/* globe in the middle */}
          <Globe id="inter-globe" cx={GX} cy={GY} r={GR} rotate={[-100 - f * 1.1, -25, 0]} frame={f} />
          {/* "one world economy" ring */}
          <g opacity={ringP}>
            <circle cx={GX} cy={GY} r={GR + 50} fill="none" stroke="#ffd400" strokeWidth={3} strokeDasharray="6 10" opacity={0.6} />
            <text fontFamily={FONT_BODY} fontWeight={900} fontSize={30} fill="#ffd400" letterSpacing={6}>
              <textPath href="#ring-path" startOffset={`${wrap(f * 0.15, 100)}%`}>
                ОДНА МИРОВАЯ ЭКОНОМИКА • ОДНА МИРОВАЯ ЭКОНОМИКА •
              </textPath>
            </text>
          </g>
          {/* products travelling between the economies */}
          {arcs >= 1 &&
            [TOP, BOT].map((pts, k) =>
              Array.from({length: 4}).map((_, i) => {
                const t = wrap((f - 70) / 95 + i / 4, 1);
                const [x, y] = bez(pts[0], pts[1], pts[2], t);
                const s = Math.sin(t * Math.PI);
                return (
                  <g key={`${k}-${i}`} transform={`translate(${x} ${y - 8}) scale(${0.6 + 0.6 * s})`} opacity={Math.min(1, s * 3)}>
                    <circle r={36} fill={k ? '#3a0f14' : '#0f1f4a'} stroke={k ? '#ff5a3c' : '#5d8fff'} strokeWidth={3} />
                    <Product kind={i + k * 2} />
                  </g>
                );
              }),
            )}
          {/* factories */}
          <Factory x={50} y={1090} roof="#2d5bd7" wall="#e9eef8" f={f} />
          <Factory x={1030} y={1090} roof="#d63a2a" wall="#fbeee2" f={f + 20} flip />
          <WavingFlag kind="us" id="inter-us" x={70} y={780} w={130} frame={f} poleH={160} />
          <WavingFlag kind="cn" id="inter-cn" x={880} y={780} w={120} frame={f + 9} poleH={160} />
          {/* rivals -> partners */}
          <g transform={`translate(540 1032) scale(0.9)`}>
            <circle r={44} fill="#0b1236" stroke="#ffd400" strokeWidth={4} />
            <text y={14} fontFamily={FONT_TITLE} fontSize={36} fill="#ffd400" textAnchor="middle" opacity={1 - vsToEx}>VS</text>
            <g opacity={vsToEx} stroke="#ffd400" strokeWidth={6} fill="none" strokeLinecap="round">
              <path d="M-22,-8 L20,-8 M10,-18 L20,-8 L10,2" />
              <path d="M22,10 L-20,10 M-10,0 L-20,10 L-10,20" />
            </g>
          </g>
        </g>
        {/* paradox stamp */}
        {stampOut > 0 && (
          <g transform={`translate(540 330) scale(${(2 - stamp) * 1}) rotate(-6)`} opacity={Math.min(1, stamp * 1.5) * stampOut}>
            <rect x={-250} y={-58} width={500} height={110} rx={14} fill="none" stroke={C.gold} strokeWidth={8} />
            <text y={28} fontFamily={FONT_TITLE} fontSize={80} fill={C.gold} textAnchor="middle" letterSpacing={6}>ПАРАДОКС</text>
          </g>
        )}
      </Canvas>
      <SubtitleBed opacity={0.45} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
