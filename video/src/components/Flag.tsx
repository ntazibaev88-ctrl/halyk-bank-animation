import React, {useEffect, useRef, useState} from 'react';
import {continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {FPS} from '../theme';

/**
 * Waving national flag rendered from the official public-domain SVG
 * (sky-blue field, golden sun with 32 rays, steppe eagle, national ornament at the hoist).
 * The artwork itself is never redrawn or recoloured — only displaced and shaded like cloth.
 */
let cached: HTMLCanvasElement | null = null;
let loading: Promise<HTMLCanvasElement> | null = null;
const loadFlag = (): Promise<HTMLCanvasElement> => {
  if (cached) return Promise.resolve(cached);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = 2400; c.height = 1200;
      c.getContext('2d')!.drawImage(img, 0, 0, 2400, 1200);
      cached = c; resolve(c);
    };
    img.onerror = reject;
    img.src = staticFile('flag.svg');
  });
  return loading;
};

type Props = {
  width: number; height: number;
  // flag placement inside the canvas (px)
  fx: number; fy: number; fw: number;
  amp?: number; speed?: number; wavelength?: number; light?: number;
  pole?: boolean; timeOffset?: number;
};

export const Flag: React.FC<Props> = ({width, height, fx, fy, fw, amp = 0.045, speed = 0.55, wavelength = 0.75, light = 0.22, pole = false, timeOffset = 0}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const [handle] = useState(() => delayRender('flag'));
  const [src, setSrc] = useState<HTMLCanvasElement | null>(cached);
  useEffect(() => {
    loadFlag().then((c) => { setSrc(c); continueRender(handle); });
  }, [handle]);

  useEffect(() => {
    const cv = ref.current; if (!cv || !src) return;
    const ctx = cv.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);
    const t = frame / FPS * speed + timeOffset;
    const fh = fw / 2;
    const strip = 2;
    const cols = Math.ceil(fw / strip);
    const k = (2 * Math.PI) / (fw * wavelength);
    // horizontal positions after cloth compression
    let xAcc = fx;
    if (pole) {
      const g = ctx.createLinearGradient(fx - 26, 0, fx, 0);
      g.addColorStop(0, '#6b6b6b'); g.addColorStop(0.45, '#f4f4f4'); g.addColorStop(1, '#7a7a7a');
      ctx.fillStyle = g; ctx.fillRect(fx - 24, fy - 60, 20, height);
      ctx.fillStyle = '#d9b44a'; ctx.beginPath(); ctx.arc(fx - 14, fy - 64, 16, 0, Math.PI * 2); ctx.fill();
    }
    for (let i = 0; i < cols; i++) {
      const u = i / cols; // 0 at hoist
      const x = i * strip;
      const ph = k * x - t * 2 * Math.PI;
      const falloff = Math.pow(u, 0.85);
      const a = amp * fh * falloff;
      const dy = a * Math.sin(ph) + a * 0.35 * Math.sin(ph * 1.9 + 1.3);
      const slope = Math.cos(ph) * falloff;
      const comp = 1 - 0.10 * falloff * (0.5 + 0.5 * Math.cos(ph)); // foreshortening
      const sw = strip * comp;
      const stretch = 1 + 0.03 * falloff * Math.sin(ph + 0.8);
      const hh = fh * stretch;
      const y0 = fy + dy - (hh - fh) / 2 + fh * 0.02 * falloff * Math.sin(ph * 0.5);
      const sx = (x / fw) * src.width;
      const sws = (strip / fw) * src.width + 0.6;
      ctx.drawImage(src, sx, 0, sws, src.height, xAcc, y0, sw + 0.7, hh);
      const shade = slope * light;
      ctx.fillStyle = shade > 0 ? `rgba(255,255,255,${shade * 0.55})` : `rgba(0,20,40,${-shade})`;
      ctx.fillRect(xAcc, y0, sw, hh);
      xAcc += sw;
    }
  }, [frame, src, width, height, fx, fy, fw, amp, speed, wavelength, light, pole, timeOffset]);

  return <canvas ref={ref} width={width} height={height} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />;
};
