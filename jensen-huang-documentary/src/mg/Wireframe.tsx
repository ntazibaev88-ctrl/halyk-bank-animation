import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {C, F} from '../theme';

type V3 = [number, number, number];

const torus = (R: number, r: number, nu: number, nv: number) => {
  const verts: V3[] = [];
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const u = (i / nu) * Math.PI * 2;
      const v = (j / nv) * Math.PI * 2;
      verts.push([(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)]);
    }
  const faces: [number, number, number, number][] = [];
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const a = i * nv + j;
      const b = ((i + 1) % nu) * nv + j;
      const c2 = ((i + 1) % nu) * nv + ((j + 1) % nv);
      const d = i * nv + ((j + 1) % nv);
      faces.push([a, b, c2, d]);
    }
  return {verts, faces};
};

/** Evolution of real-time 3D graphics: wireframe → flat shading → smooth lit surface (motion graphic). */
export const Wireframe: React.FC<{frame: number; dur: number}> = ({frame, dur}) => {
  const p = frame / Math.max(1, dur - 1);
  const lo = useMemo(() => torus(1.0, 0.42, 22, 12), []);
  const hi = useMemo(() => torus(1.0, 0.42, 48, 26), []);
  const stage = p < 0.36 ? 0 : p < 0.68 ? 1 : 2;
  const mesh = stage === 2 ? hi : lo;
  const ay = frame * 0.035 + 0.4;
  const ax = 0.9 + Math.sin(frame * 0.02) * 0.2;
  const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
  const rot = (v: V3): V3 => {
    const x1 = v[0] * cy + v[2] * sy;
    const z1 = -v[0] * sy + v[2] * cy;
    const y2 = v[1] * cx - z1 * sx;
    const z2 = v[1] * sx + z1 * cx;
    return [x1, y2, z2];
  };
  const S = 200;
  const proj = (v: V3): [number, number] => {
    const z = v[2] + 4.2;
    return [540 + (v[0] * S * 4.2) / z, 880 + (v[1] * S * 4.2) / z];
  };
  const rv = mesh.verts.map(rot);
  const pv = rv.map(proj);
  const light: V3 = [-0.5, -0.7, -0.6];
  const ln = Math.hypot(...light);
  const polys = mesh.faces
    .map((f) => {
      const [a, b, c2] = f.map((i) => rv[i]);
      const u: V3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const v: V3 = [c2[0] - a[0], c2[1] - a[1], c2[2] - a[2]];
      const n: V3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const nl = Math.hypot(...n) || 1;
      const lambert = Math.max(0, (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / (nl * ln));
      const zc = f.reduce((acc, i) => acc + rv[i][2], 0) / 4;
      const facing = n[2] / nl; // camera looks +z
      return {f, zc, lambert, facing};
    })
    .sort((A, B) => B.zc - A.zc);
  const labels = ['КАРКАС', 'ПОЛИГОНЫ', 'ОСВЕЩЕНИЕ'];
  const flash = interpolate(Math.abs(p - 0.36) < Math.abs(p - 0.68) ? p - 0.36 : p - 0.68, [-0.02, 0, 0.04], [0, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 46%, #102010 0%, #020302 70%)'}}>
      <svg width={1080} height={1920}>
        {polys.map(({f, lambert, facing}, k) => {
          const pts = f.map((i) => pv[i].join(',')).join(' ');
          if (stage === 0) {
            return <polygon key={k} points={pts} fill="none" stroke={C.greenHi} strokeOpacity={facing < 0 ? 0.9 : 0.22} strokeWidth={1.6} />;
          }
          if (facing > 0.05) return null;
          if (stage === 1) {
            const g = Math.round(30 + lambert * 150);
            return <polygon key={k} points={pts} fill={`rgb(${Math.round(g * 0.55)},${g},${Math.round(g * 0.3)})`} stroke="rgba(0,0,0,0.6)" strokeWidth={1.2} />;
          }
          const spec = Math.pow(lambert, 18) * 255;
          const base = 30 + lambert * 190;
          return (
            <polygon
              key={k}
              points={pts}
              fill={`rgb(${Math.min(255, Math.round(base * 0.62 + spec))},${Math.min(255, Math.round(base + spec))},${Math.min(255, Math.round(base * 0.18 + spec))})`}
              stroke={`rgb(${Math.min(255, Math.round(base * 0.62 + spec))},${Math.min(255, Math.round(base + spec))},${Math.min(255, Math.round(base * 0.18 + spec))})`}
              strokeWidth={0.8}
            />
          );
        })}
      </svg>
      <AbsoluteFill style={{background: '#fff', opacity: flash, mixBlendMode: 'screen'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', gap: 26}}>
        {labels.map((l, i) => (
          <div
            key={l}
            style={{
              fontFamily: F.bold,
              fontSize: 26,
              letterSpacing: 4,
              padding: '10px 18px',
              border: `2px solid ${i === stage ? C.greenHi : 'rgba(255,255,255,0.18)'}`,
              color: i === stage ? C.greenHi : 'rgba(255,255,255,0.4)',
              background: i === stage ? 'rgba(118,185,0,0.12)' : 'transparent',
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
