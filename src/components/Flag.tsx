import React from 'react';
import {safeId, starPoints} from '../lib/anim';
import {C} from '../theme';

/** US flag artwork, drawn at width w (proportion 10:19). */
const USArt: React.FC<{w: number; h: number}> = ({w, h}) => {
  const stripeH = h / 13;
  const cw = w * (0.76 / 1.9);
  const ch = stripeH * 7;
  const stars: React.ReactNode[] = [];
  const sr = h * 0.0616 * 0.5;
  for (let r = 0; r < 9; r++) {
    const y = ((r + 1) * ch) / 10;
    const n = r % 2 === 0 ? 6 : 5;
    for (let c = 0; c < n; c++) {
      const x = r % 2 === 0 ? ((2 * c + 1) * cw) / 12 : ((2 * c + 2) * cw) / 12;
      stars.push(<polygon key={`${r}-${c}`} points={starPoints(x, y, sr)} fill="#fff" />);
    }
  }
  return (
    <g>
      <rect width={w} height={h} fill="#fff" />
      {Array.from({length: 7}).map((_, i) => (
        <rect key={i} y={i * 2 * stripeH} width={w} height={stripeH + 0.5} fill="#b31942" />
      ))}
      <rect width={cw} height={ch} fill="#0a3161" />
      {stars}
    </g>
  );
};

/** China flag artwork (3:2) with geometrically correct stars. */
const CNArt: React.FC<{w: number; h: number}> = ({w, h}) => {
  const u = w / 30;
  const big = {x: 5 * u, y: 5 * u};
  const small = [
    [10, 2],
    [12, 4],
    [12, 7],
    [10, 9],
  ];
  return (
    <g>
      <rect width={w} height={h} fill="#ee1c25" />
      <polygon points={starPoints(big.x, big.y, 3 * u)} fill="#ffff00" />
      {small.map(([sx, sy], i) => {
        const x = sx * u;
        const y = sy * u;
        const ang = (Math.atan2(big.y - y, big.x - x) * 180) / Math.PI + 90;
        return <polygon key={i} points={starPoints(x, y, u, ang)} fill="#ffff00" />;
      })}
    </g>
  );
};

/**
 * Waving flag built from vertical strips that follow a travelling sine wave,
 * pinned at the pole edge, with light/shadow shading on each fold.
 */
export const WavingFlag: React.FC<{
  kind: 'us' | 'cn';
  id: string;
  x: number;
  y: number;
  w: number;
  frame: number;
  amp?: number;
  speed?: number;
  pole?: boolean;
  poleH?: number;
  mirror?: boolean;
  strips?: number;
}> = ({kind, id, x, y, w, frame, amp = 1, speed = 1, pole = true, poleH, mirror = false, strips = 26}) => {
  const h = kind === 'us' ? (w * 10) / 19 : (w * 2) / 3;
  const sid = safeId(id);
  const sw = w / strips;
  const A = h * 0.07 * amp;
  const t = (frame / 30) * speed * 5.2;
  const parts: React.ReactNode[] = [];
  const shades: React.ReactNode[] = [];
  for (let i = 0; i < strips; i++) {
    const x0 = i * sw;
    const xm = x0 + sw / 2;
    const pin = Math.pow(xm / w, 0.85);
    const phase = (xm / w) * Math.PI * 2.4 - t;
    const dy = Math.sin(phase) * A * pin;
    const slope = Math.cos(phase) * pin;
    const sx = 1 - 0.035 * pin * Math.abs(Math.sin(phase));
    parts.push(
      <g key={i} clipPath={`url(#${sid}-c${i})`} transform={`translate(0 ${dy.toFixed(2)})`}>
        <use href={`#${sid}-art`} />
      </g>,
    );
    shades.push(
      <rect
        key={'s' + i}
        x={x0 - 0.3}
        y={dy}
        width={sw + 0.6}
        height={h * sx}
        fill={slope > 0 ? '#ffffff' : '#000000'}
        opacity={Math.abs(slope) * 0.22}
      />,
    );
  }
  const ph = poleH ?? h * 2.6;
  return (
    <g transform={`translate(${x} ${y})${mirror ? ` scale(-1 1)` : ''}`}>
      <defs>
        <g id={`${sid}-art`}>{kind === 'us' ? <USArt w={w} h={h} /> : <CNArt w={w} h={h} />}</g>
        {Array.from({length: strips}).map((_, i) => (
          <clipPath key={i} id={`${sid}-c${i}`}>
            <rect x={i * sw - 0.4} y={-2} width={sw + 0.8} height={h + 4} />
          </clipPath>
        ))}
      </defs>
      {pole && (
        <g>
          <rect x={-w * 0.035} y={-h * 0.12} width={w * 0.03} height={ph} rx={w * 0.012} fill="#cfd6e3" />
          <rect x={-w * 0.035} y={-h * 0.12} width={w * 0.011} height={ph} fill="#ffffff" opacity={0.6} />
          <circle cx={-w * 0.02} cy={-h * 0.14} r={w * 0.028} fill={C.gold} />
        </g>
      )}
      <g filter="drop-shadow(0 10px 14px rgba(0,0,0,0.35))">
        {parts}
        {shades}
      </g>
    </g>
  );
};

/** Small static round badge (flag inside a circle) used in HUD-like overlays. */
export const FlagBadge: React.FC<{kind: 'us' | 'cn'; id: string; cx: number; cy: number; r: number; ring?: string}> = ({
  kind,
  id,
  cx,
  cy,
  r,
  ring = '#fff',
}) => {
  const sid = safeId(id);
  const w = kind === 'us' ? r * 3.6 : r * 3;
  const h = kind === 'us' ? (w * 10) / 19 : (w * 2) / 3;
  return (
    <g>
      <defs>
        <clipPath id={`${sid}-clip`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${sid}-clip)`}>
        <g transform={`translate(${cx - (kind === 'us' ? r * 1.2 : r * 1.0)} ${cy - h / 2})`}>
          {kind === 'us' ? <USArt w={w} h={h} /> : <CNArt w={w} h={h} />}
        </g>
        <circle cx={cx - r * 0.3} cy={cy - r * 0.4} r={r * 0.9} fill="#fff" opacity={0.12} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={ring} strokeWidth={r * 0.1} />
    </g>
  );
};
