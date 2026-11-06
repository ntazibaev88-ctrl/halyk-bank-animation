import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/SceneShell';
import {Canvas, SubtitleBed, Vignette} from '../components/Common';
import {RobotArm} from '../components/Robot';
import {FlagBadge} from '../components/Flag';
import {easeInOut, easeOut, io, pop, rand} from '../lib/anim';
import {FONT_BODY, FONT_TITLE} from '../theme';

const LAYERS = [4, 6, 7, 6, 4];
const NX = (l: number) => 250 + l * 145;
const NODES = LAYERS.map((n, l) => Array.from({length: n}).map((_, i) => ({x: NX(l), y: 640 + (i - (n - 1) / 2) * 74})));
const EDGES: {a: {x: number; y: number}; b: {x: number; y: number}; l: number; k: number}[] = [];
NODES.forEach((layer, l) => {
  if (l === NODES.length - 1) return;
  layer.forEach((a, i) => NODES[l + 1].forEach((b, j) => EDGES.push({a, b, l, k: i * 10 + j})));
});

const Monitor: React.FC<{x: number; y: number; kind: number; f: number}> = ({x, y, kind, f}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={84} width={12} height={34} fill="#3a3f52" />
    <rect x={-40} y={116} width={80} height={10} rx={4} fill="#3a3f52" />
    <rect x={-118} y={-6} width={236} height={96} rx={10} fill="#1d2236" />
    <rect x={-110} y={2} width={220} height={80} rx={6} fill="#081026" />
    {kind === 0 &&
      Array.from({length: 6}).map((_, i) => {
        const row = (i + Math.floor(f / 6)) % 9;
        return <rect key={i} x={-100 + (row % 3) * 12} y={10 + i * 12} width={40 + ((row * 37) % 120)} height={6} rx={3} fill={['#7ffcff', '#ffd400', '#ff6a8a', '#8fb4ff'][row % 4]} opacity={0.85} />;
      })}
    {kind === 1 && (
      <g>
        <path
          d={Array.from({length: 20})
            .map((_, i) => `${i ? 'L' : 'M'}${-100 + i * 10.5},${72 - 56 * (1 - Math.exp(-i / 5)) + Math.sin(i * 2 + f / 3) * 3}`)
            .join(' ')}
          stroke="#49f28a" strokeWidth={4} fill="none"
        />
        <text x={96} y={26} fontFamily={FONT_BODY} fontWeight={800} fontSize={16} fill="#49f28a" textAnchor="end">ТОЧНОСТЬ</text>
      </g>
    )}
    {kind === 2 && (
      <g>
        <text x={0} y={32} fontFamily={FONT_BODY} fontWeight={800} fontSize={18} fill="#cfe0ff" textAnchor="middle">ОБУЧЕНИЕ</text>
        <rect x={-90} y={46} width={180} height={18} rx={9} fill="#1d2a4f" />
        <rect x={-90} y={46} width={180 * ((f % 75) / 75)} height={18} rx={9} fill="#ffd400" />
      </g>
    )}
  </g>
);

export const Scene05AI: React.FC = () => {
  const {f} = useScene();
  const zoom = 1 + io(f, [0, 210], [0, 0.14], easeInOut);
  const split = io(f, [52, 80], [0, 1]);
  const ring = io(f, [0, 30], [0, 1], easeOut);

  return (
    <AbsoluteFill style={{background: '#0a0c26'}}>
      <Canvas>
        <defs>
          <linearGradient id="ai-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c0f2e" />
            <stop offset="1" stopColor="#1e2460" />
          </linearGradient>
          <linearGradient id="ai-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1f4f" />
            <stop offset="1" stopColor="#070a1e" />
          </linearGradient>
          <linearGradient id="ai-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#7ffcff" stopOpacity={0.45} />
            <stop offset="1" stopColor="#7ffcff" stopOpacity={0} />
          </linearGradient>
          <filter id="ai-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={8} />
          </filter>
        </defs>
        <g transform={`translate(540 700) scale(${zoom}) translate(-540 -700)`}>
          {/* room */}
          <rect x={-100} y={-100} width={1280} height={1150} fill="url(#ai-wall)" />
          {Array.from({length: 9}).map((_, i) => (
            <g key={i}>
              <rect x={-40 + i * 140} y={240} width={120} height={760} rx={8} fill="#141a45" stroke="#232c6b" strokeWidth={3} />
              <rect x={18 + i * 140} y={260} width={4} height={720} fill="#7ffcff" opacity={0.15 + 0.15 * Math.sin(f / 10 + i)} />
            </g>
          ))}
          <rect x={-100} y={1000} width={1280} height={400} fill="url(#ai-floor)" />
          {Array.from({length: 15}).map((_, i) => (
            <line key={i} x1={540} y1={940} x2={-700 + i * 175} y2={1400} stroke="#3a46a0" strokeWidth={2} opacity={0.5} />
          ))}
          {Array.from({length: 6}).map((_, i) => {
            const y = 1000 + Math.pow((i + ((f / 20) % 1)) / 6, 2) * 400;
            return <line key={i} x1={-100} y1={y} x2={1180} y2={y} stroke="#3a46a0" strokeWidth={2} opacity={0.5} />;
          })}
          {/* server racks */}
          {[20, 960].map((x, r) => (
            <g key={r}>
              <rect x={x} y={420} width={100} height={590} rx={8} fill="#11163a" stroke="#2c3780" strokeWidth={3} />
              {Array.from({length: 14}).map((_, i) => (
                <g key={i}>
                  <rect x={x + 10} y={436 + i * 40} width={80} height={30} rx={4} fill="#1a2152" />
                  {[0, 1, 2].map((k) => (
                    <circle key={k} cx={x + 22 + k * 14} cy={451 + i * 40} r={4}
                      fill={Math.sin(f / (3 + k) + i * 1.7 + r) > 0.2 ? (r ? '#ff5a3c' : '#5d8fff') : '#2a3166'} />
                  ))}
                </g>
              ))}
            </g>
          ))}
          {/* data flowing along floor cables to the projector */}
          {[0, 1].map((side) => {
            const x0 = side ? 1010 : 70;
            const d = `M${x0},1010 C${x0},1110 ${side ? 760 : 320},1090 540,1040`;
            return (
              <g key={side}>
                <path d={d} stroke="#2c3780" strokeWidth={14} fill="none" />
                {Array.from({length: 6}).map((_, k) => (
                  <path key={k} d={d} stroke={side ? '#ff5a3c' : '#5d8fff'} strokeWidth={8} fill="none" pathLength={1}
                    strokeDasharray="0.04 1" strokeDashoffset={-(((f / 40 + k / 6) % 1))} strokeLinecap="round" />
                ))}
              </g>
            );
          })}
          {/* projector pad + beam */}
          <ellipse cx={540} cy={1040} rx={230} ry={40} fill="#1d2a6b" stroke="#7ffcff" strokeWidth={4} />
          <polygon points="330,1040 750,1040 900,330 180,330" fill="url(#ai-beam)" opacity={0.6} />
          {/* rotating hologram rings */}
          <g transform="translate(540 640)" opacity={ring}>
            <circle r={360 * ring} fill="none" stroke="#7ffcff" strokeWidth={3} strokeDasharray="20 16" transform={`rotate(${f * 0.8})`} opacity={0.6} />
            <circle r={330 * ring} fill="none" stroke="#7ffcff" strokeWidth={2} strokeDasharray="4 10" transform={`rotate(${-f * 1.2})`} opacity={0.5} />
          </g>
          {/* neural network: edges */}
          {EDGES.map((e, i) => {
            const p = io(f, [8 + e.l * 9, 22 + e.l * 9], [0, 1], easeOut);
            if (p <= 0) return null;
            const mid = (e.a.x + e.b.x) / 2;
            const col = split > 0 ? (mid < 540 ? '#5d8fff' : mid > 540 ? '#ff5a3c' : '#ffd400') : '#7ffcff';
            const x2 = e.a.x + (e.b.x - e.a.x) * p;
            const y2 = e.a.y + (e.b.y - e.a.y) * p;
            const pulse = ((f / 22 - e.l * 0.25 + rand(e.k) * 0.3) % 1 + 1) % 1;
            return (
              <g key={i}>
                <line x1={e.a.x} y1={e.a.y} x2={x2} y2={y2} stroke={col} strokeWidth={2} opacity={0.35} />
                {p >= 1 && f > 40 && rand(i) > 0.55 && (
                  <circle cx={e.a.x + (e.b.x - e.a.x) * pulse} cy={e.a.y + (e.b.y - e.a.y) * pulse} r={4} fill="#fff" opacity={0.9} />
                )}
              </g>
            );
          })}
          {/* nodes */}
          {NODES.map((layer, l) =>
            layer.map((n, i) => {
              const p = pop(f, 4 + l * 9 + i * 1.5, 10, 160);
              const act = 0.5 + 0.5 * Math.sin(f / 5 - l * 1.1 + i);
              const col = split > 0.5 ? (l < 2 ? '#5d8fff' : l > 2 ? '#ff5a3c' : '#ffd400') : '#7ffcff';
              return (
                <g key={`${l}-${i}`} transform={`translate(${n.x} ${n.y}) scale(${p})`}>
                  <circle r={30} fill={col} opacity={0.25 * act} filter="url(#ai-glow)" />
                  <circle r={17} fill="#0b1236" stroke={col} strokeWidth={5} />
                  <circle r={8 * act} fill="#fff" />
                </g>
              );
            }),
          )}
          {/* "arena" divider spark */}
          {split > 0 && (
            <g opacity={split}>
              <line x1={540} y1={330} x2={540} y2={950} stroke="#ffd400" strokeWidth={4} strokeDasharray="14 12" strokeDashoffset={-f * 3} />
              <circle cx={540} cy={330} r={26} fill="#ffd400" />
              <text x={540} y={340} fontFamily={FONT_TITLE} fontSize={24} fill="#111" textAnchor="middle">VS</text>
            </g>
          )}
          <g opacity={split}>
            <FlagBadge kind="us" id="ai-us" cx={250} cy={360} r={44} />
            <FlagBadge kind="cn" id="ai-cn" cx={830} cy={360} r={44} ring="#ffde00" />
          </g>
          {/* AI label */}
          <g transform={`translate(540 ${975}) scale(${pop(f, 6, 12, 120)})`}>
            <rect x={-70} y={-40} width={140} height={70} rx={16} fill="#0b1236" stroke="#7ffcff" strokeWidth={4} />
            <text y={14} fontFamily={FONT_TITLE} fontSize={44} fill="#7ffcff" textAnchor="middle">AI</text>
          </g>
          {/* desk with monitors */}
          <rect x={150} y={1180} width={780} height={26} rx={8} fill="#2a3166" />
          <Monitor x={300} y={1060} kind={0} f={f} />
          <Monitor x={540} y={1060} kind={1} f={f} />
          <Monitor x={780} y={1060} kind={2} f={f} />
          {/* robot arms reaching to the hologram */}
          <RobotArm x={95} y={1250} s={0.85} frame={f} tool="gripper" color="#e8eef8" dark="#3d6fe0"
            a1={30 + Math.sin(f / 18) * 14} a2={50 + Math.sin(f / 13 + 1) * 22} a3={30 + Math.sin(f / 9) * 20} grip={0.5 + 0.5 * Math.sin(f / 7)} L1={230} L2={190} />
          <RobotArm x={985} y={1250} s={0.85} frame={f} tool="gripper" color="#e8eef8" dark="#de2910"
            a1={-30 - Math.sin(f / 17 + 2) * 14} a2={-50 - Math.sin(f / 12 + 3) * 22} a3={-30 - Math.sin(f / 10) * 20} grip={0.5 + 0.5 * Math.sin(f / 8 + 1)} L1={230} L2={190} />
        </g>
      </Canvas>
      <SubtitleBed opacity={0.45} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
