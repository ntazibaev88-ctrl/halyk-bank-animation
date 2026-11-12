import React from 'react';
import {Composition} from 'remotion';
import {Documentary} from './Documentary';
import timeline from './timeline.json';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Documentary"
      component={Documentary}
      durationInFrames={timeline.durationInFrames}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
