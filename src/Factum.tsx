import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate } from "remotion";
import "./fonts";
import project from "./generated/project.json";
import type { Project } from "./types";
import { ShotLayer } from "./components/ShotLayer";
import { SceneTitle } from "./components/SceneTitle";
import { Subtitles } from "./components/Subtitles";
import { Grade } from "./components/Grade";
import { BrandBug } from "./components/BrandBug";
import { HookNumber } from "./components/Graphics";
import { C } from "./theme";

const P = project as unknown as Project;
const BASE = 0.3, DUCK = 0.1;

// windows during which narration is audible (used to duck the music)
const windows = P.scenes.map((s) => {
  const from = s.vo ? s.vo.from : s.cues[0].from;
  const to = s.vo && (s.vo as any).durationSec ? from + Math.round((s.vo as any).durationSec * P.fps) : s.cues[s.cues.length - 1].to;
  return [from, to] as const;
});
const musicVolume = (f: number) => {
  let v = BASE;
  for (const [a, b] of windows) {
    const d = f < a ? a - f : f > b ? f - b : 0;
    v = Math.min(v, interpolate(d, [0, 18], [DUCK, BASE], { extrapolateRight: "clamp" }));
  }
  const fade = interpolate(f, [0, 45, P.durationInFrames - 75, P.durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return v * fade;
};

export const Factum: React.FC<{ mode: "preview" | "final" }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.ink }}>
    {P.scenes.map((s) => (
      <React.Fragment key={s.id}>
        {s.shots.map((sh, i) => (
          <Sequence key={sh.id} from={sh.from} durationInFrames={sh.to - sh.from + (i < s.shots.length - 1 || s.id < 10 ? P.transitionFrames : 0)} layout="none">
            <ShotLayer shot={sh} mode={mode} fadeIn={P.transitionFrames} first={sh.from === 0} />
          </Sequence>
        ))}
      </React.Fragment>
    ))}
    <Grade />
    {P.scenes.map((s) => s.id !== 10 && (
      <Sequence key={"t" + s.id} from={s.from} durationInFrames={Math.min(s.to - s.from, 120)} layout="none">
        <SceneTitle text={s.title} num={s.id} len={Math.min(s.to - s.from, 120)} delay={s.id === 1 ? 30 : 10} />
      </Sequence>
    ))}
    <Sequence from={0} durationInFrames={90} layout="none"><HookNumber /></Sequence>
    <BrandBug />
    <Subtitles cues={P.scenes.flatMap((s) => s.cues)} />
    {P.music && <Audio src={staticFile(P.music.file)} volume={musicVolume} loop />}
    {P.scenes.map((s) => s.vo && (
      <Sequence key={"vo" + s.id} from={s.vo.from} layout="none"><Audio src={staticFile(s.vo.file)} volume={1} /></Sequence>
    ))}
  </AbsoluteFill>
);
