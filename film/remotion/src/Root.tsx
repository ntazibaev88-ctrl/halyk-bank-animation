import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Film} from './Film';
import plan from '../public/plan.json';

export const FPS = 30;
export const Root: React.FC = () => (
  <Composition id="Film" component={Film} width={1080} height={1920} fps={FPS}
    durationInFrames={Math.round((plan as any).total * FPS)} defaultProps={{plan: plan as any}} />
);
