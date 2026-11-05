import React from "react";
import { AbsoluteFill } from "remotion";
// Cinematic grade: warm/teal tint, vignette, and a bottom gradient so subtitles always read.
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)" }} />
    <AbsoluteFill style={{ background: "rgba(255,170,60,.06)", mixBlendMode: "soft-light" }} />
  </AbsoluteFill>
);
