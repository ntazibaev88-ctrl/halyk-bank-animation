import {Composition} from 'remotion';
import {Doc} from './Doc';
import timeline from './timeline.json';
import type {Timeline} from './types';

const tl = timeline as unknown as Timeline;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ElonDoc"
      component={Doc}
      durationInFrames={tl.durationInFrames}
      fps={tl.fps}
      width={tl.width}
      height={tl.height}
    />
  </>
);
