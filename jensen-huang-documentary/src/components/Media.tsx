import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {rand} from '../theme';

export const Vid: React.FC<{src: string; from?: number; rate?: number; pos?: string; fps?: number}> = ({
  src,
  from = 0,
  rate = 1,
  pos = '50% 50%',
  fps = 30,
}) => (
  <OffthreadVideo
    src={staticFile(src)}
    muted
    startFrom={Math.round(from * fps)}
    playbackRate={rate}
    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}}
  />
);

export const Photo: React.FC<{src: string; pos?: string}> = ({src, pos = '50% 50%'}) => (
  <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
);

/** Archival photo treatment for low-resolution historical images: blurred plate behind,
 * the photo itself shown at its own aspect ratio with a subtle frame, gate weave and flicker. */
export const Archival: React.FC<{
  src: string;
  aspect: number; // w/h
  frame: number;
  width?: number;
  y?: number;
  tilt?: number;
  pos?: string;
}> = ({src, aspect, frame, width = 1000, y = 0, tilt = 0, pos = '50% 50%'}) => {
  const h = width / aspect;
  const weaveX = (rand(Math.floor(frame / 2)) - 0.5) * 2.2;
  const weaveY = (rand(Math.floor(frame / 2) + 99) - 0.5) * 2.2;
  const flicker = 0.93 + rand(frame * 3.1) * 0.09;
  return (
    <AbsoluteFill style={{backgroundColor: '#0b0b09'}}>
      <AbsoluteFill style={{filter: 'blur(38px) brightness(0.42)', transform: 'scale(1.35)'}}>
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width,
            height: h,
            transform: `translate(${weaveX}px, ${y + weaveY}px) rotate(${tilt}deg)`,
            boxShadow: '0 40px 120px rgba(0,0,0,0.75)',
            outline: '2px solid rgba(255,255,255,0.12)',
            filter: `brightness(${flicker})`,
            overflow: 'hidden',
          }}
        >
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** A product photo floated in 3D space with a slow rotation and a moving specular sweep. */
export const Float3D: React.FC<{src: string; aspect: number; p: number; width?: number; glow?: string}> = ({
  src,
  aspect,
  p,
  width = 980,
  glow = 'rgba(118,185,0,0.45)',
}) => {
  const ry = -24 + p * 34;
  const rx = 10 - p * 8;
  const sweep = -60 + p * 220;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #10200a 0%, #050706 62%)', perspective: 1600}}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width,
            height: width / aspect,
            transform: `rotateY(${ry}deg) rotateX(${rx}deg) translateZ(0px)`,
            transformStyle: 'preserve-3d',
            position: 'relative',
            boxShadow: `0 0 140px ${glow}`,
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(105deg, transparent ${sweep - 18}%, rgba(255,255,255,0.28) ${sweep}%, transparent ${sweep + 18}%)`,
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </AbsoluteFill>
      {/* floor reflection glow */}
      <div
        style={{
          position: 'absolute',
          left: 140,
          right: 140,
          top: 1260,
          height: 160,
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
