export type Word = { t: string; hl: boolean };
export type Cue = { from: number; to: number; lines: Word[][] };
export type Shot = { id: string; from: number; to: number; kind: "footage" | "graphic"; graphic: string | null; cam: string | null; desc: string; file: string | null };
export type Scene = { id: number; slug: string; name: string; from: number; to: number; title: string; narration: string; sfx: string; vo: { file: string; from: number } | null; sfxFile?: string | null; shots: Shot[]; cues: Cue[] };
export type Project = { title: string; channel: string; fps: number; width: number; height: number; durationInFrames: number; transitionFrames: number; music: { file: string; placeholder: boolean } | null; scenes: Scene[] };
