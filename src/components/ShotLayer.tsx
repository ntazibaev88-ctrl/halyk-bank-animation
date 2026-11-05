import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate } from "remotion";
import { C, F, ease } from "../theme";
import { DarkBg, Counter2200, SilkRoadMap, Rank3, LogoEnd } from "./Graphics";
import type { Shot } from "../types";

const Slate: React.FC<{ shot: Shot }> = ({ shot }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkBg hue={(Number(shot.id.slice(1, 3)) * 37) % 360} />
      <div style={{ position: "absolute", left: 90, right: 150, top: 1030, fontFamily: F.sans }}>
        <div style={{ display: "inline-block", border: `2px dashed ${C.gold}`, color: C.gold, fontWeight: 800, fontSize: 30, letterSpacing: 5, padding: "8px 18px", opacity: 0.6 + 0.4 * Math.sin(f / 8) ** 2 }}>PREVIEW · НЕТ ФУТАЖА</div>
        <div style={{ marginTop: 26, color: C.white, fontWeight: 800, fontSize: 64 }}>{shot.id}</div>
        <div style={{ marginTop: 14, color: "rgba(255,255,255,.75)", fontWeight: 600, fontSize: 34, lineHeight: 1.35 }}>{shot.desc}</div>
        <div style={{ marginTop: 14, color: C.mute, fontWeight: 600, fontSize: 28 }}>камера: {shot.cam}</div>
      </div>
    </AbsoluteFill>
  );
};

export const ShotLayer: React.FC<{ shot: Shot; mode: "preview" | "final"; fadeIn: number; first: boolean }> = ({ shot, mode, fadeIn, first }) => {
  const f = useCurrentFrame();
  const len = shot.to - shot.from;
  const opacity = first ? 1 : ease(f / fadeIn);
  const push = interpolate(f, [0, len + fadeIn], [1.0, 1.07]);
  let body: React.ReactNode;
  if (shot.kind === "graphic") {
    body = shot.graphic === "counter2200" ? <Counter2200 len={len} /> : shot.graphic === "silkroad-map" ? <SilkRoadMap len={len} /> : shot.graphic === "rank3" ? <Rank3 /> : <LogoEnd len={len} />;
    return <AbsoluteFill style={{ opacity }}>{body}</AbsoluteFill>;
  }
  if (shot.file) {
    body = <OffthreadVideo src={staticFile(shot.file)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})` }} />;
  } else if (mode === "preview") {
    body = <Slate shot={shot} />;
  } else throw new Error(`Missing footage for ${shot.id} — final render refused.`);
  return <AbsoluteFill style={{ opacity, background: C.ink }}>{body}</AbsoluteFill>;
};
