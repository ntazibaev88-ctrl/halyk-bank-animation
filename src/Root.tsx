import React from "react";
import { Composition } from "remotion";
import { Factum } from "./Factum";
import project from "./generated/project.json";

export const Root: React.FC = () => (
  <Composition id="Factum" component={Factum} durationInFrames={project.durationInFrames} fps={project.fps} width={project.width} height={project.height} defaultProps={{ mode: "preview" as "preview" | "final" }} />
);
