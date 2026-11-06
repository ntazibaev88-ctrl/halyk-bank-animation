import React from 'react';
import {Composition, Sequence} from 'remotion';
import {Video} from './Video';
import {TL} from './lib/timeline';

/** Plays the full film shifted so that one scene can be previewed on its own. */
const ScenePreview: React.FC<{start: number}> = ({start}) => (
  <Sequence from={-start}>
    <Video />
  </Sequence>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="UsaVsChina" component={Video} durationInFrames={TL.totalFrames} fps={TL.fps} width={1080} height={1920} />
    {TL.scenes.map((s, i) => (
      <Composition
        key={s.id}
        id={`Scene${String(i + 1).padStart(2, '0')}-${s.id}`}
        component={ScenePreview}
        defaultProps={{start: s.start}}
        durationInFrames={s.frames}
        fps={TL.fps}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
