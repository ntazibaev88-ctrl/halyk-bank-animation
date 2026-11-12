export type Transition = 'cut' | 'fade' | 'zoom' | 'flash' | 'dip' | 'whip';

export interface ShotT {
  id: string;
  src: string; // file in public/
  start: number; // seconds: the moment this shot is fully on screen
  end: number;
  transIn: Transition;
  transDur: number; // seconds of overlap before `start`
  zoom: [number, number];
  pan: [number, number]; // px offset X at begin/end (clip is 1280 wide, canvas 1080)
  panY?: [number, number];
  rate?: number;
  tag?: string; // source / archive label
  dim?: number; // extra darkening 0..1
  blur?: number;
}

export interface TitleT {
  scene: string;
  text: string;
  kicker: string;
  at: number;
  dur: number;
  variant: 'hook' | 'chapter' | 'question';
}

export interface SubT {
  start: number;
  end: number;
  text: string; // keywords marked with *...*
}

export interface OverlayT {
  type: 'payments' | 'neural' | 'feed' | 'mars' | 'battery' | 'location' | 'year' | 'mainTitle' | 'scan';
  at: number;
  dur: number;
  props?: Record<string, unknown>;
}

export interface SceneT {
  id: string;
  index: number;
  start: number;
  end: number;
}

export interface Timeline {
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  scenes: SceneT[];
  shots: ShotT[];
  titles: TitleT[];
  subs: SubT[];
  overlays: OverlayT[];
  flashes: {at: number; kind: 'white' | 'warm' | 'dip'; dur: number}[];
  ending: {finalAt: number; ctaAt: number};
  credits: string;
}
