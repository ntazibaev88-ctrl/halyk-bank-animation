import data from '../data/timeline.json';

export type Word = {t: string; hl: boolean; s: number; e: number};
export type Phrase = {start: number; end: number; words: Word[]};
export type SceneT = {id: string; start: number; frames: number; voStart: number; voDuration: number; lead: number; phrases: Phrase[]};

export const TL = data as unknown as {fps: number; width: number; height: number; totalFrames: number; scenes: SceneT[]};
export const sceneById = (id: string) => TL.scenes.find((s) => s.id === id)!;
/** Transition overlap (frames) before and after each cut. */
export const PRE = 10;
export const POST = 12;
