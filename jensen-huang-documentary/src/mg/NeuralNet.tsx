import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, Easing} from 'remotion';
import {C, F, rand} from '../theme';

/** Abstract neural network with signal pulses (motion graphic). */
export const NeuralNet: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
  const layers = [4, 7, 9, 7, 3];
  const nodes = useMemo(() => {
    const out: {x: number; y: number; l: number}[][] = [];
    layers.forEach((n, li) => {
      const col: {x: number; y: number; l: number}[] = [];
      for (let i = 0; i < n; i++) {
        const x = 150 + (li * 780) / (layers.length - 1);
        const y = 880 + (i - (n - 1) / 2) * 92;
        col.push({x, y, l: li});
      }
      out.push(col);
    });
    return out;
  }, []);
  const edges = useMemo(() => {
    const e: {a: {x: number; y: number}; b: {x: number; y: number}; seed: number; l: number}[] = [];
    for (let l = 0; l < nodes.length - 1; l++)
      nodes[l].forEach((a, i) => nodes[l + 1].forEach((b, j) => e.push({a, b, seed: l * 100 + i * 10 + j, l})));
    return e;
  }, [nodes]);
  const t = frame / fps;
  const build = interpolate(t, [0, 1.0], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, #0c1d0b 0%, #020302 72%)'}}>
      <svg width={1080} height={1920}>
        <defs>
          <filter id="ng">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((e, k) => {
          const vis = interpolate(build, [e.l / 5, e.l / 5 + 0.3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return <line key={k} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y} stroke="rgba(155,226,45,0.16)" strokeWidth={1.4} opacity={vis} />;
        })}
        {edges.map((e, k) => {
          if (rand(e.seed) > 0.35) return null;
          const speed = 0.9 + rand(e.seed + 3) * 0.8;
          const ph = (t * speed + rand(e.seed + 7) + e.l * 0.25) % 1.4;
          if (ph > 1 || build < 1) return null;
          const x = e.a.x + (e.b.x - e.a.x) * ph;
          const y = e.a.y + (e.b.y - e.a.y) * ph;
          return <circle key={'p' + k} cx={x} cy={y} r={4.5} fill={C.greenHi} filter="url(#ng)" />;
        })}
        {nodes.flat().map((n, k) => {
          const act = 0.5 + 0.5 * Math.sin(t * 3 + k * 1.7);
          const vis = interpolate(build, [n.l / 5, n.l / 5 + 0.25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <g key={k} opacity={vis}>
              <circle cx={n.x} cy={n.y} r={20} fill="#0a1408" stroke={C.greenHi} strokeWidth={3} />
              <circle cx={n.x} cy={n.y} r={9} fill={C.greenHi} opacity={0.3 + act * 0.7} filter="url(#ng)" />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
