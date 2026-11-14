import React, {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/noto-serif-display/600.css';
import '@fontsource/noto-serif-display/700.css';
import '@fontsource/noto-serif-display/600-italic.css';
import {Main, TOTAL_FRAMES} from './Main';
import {FPS, H, W} from './theme';

const FontGate: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const sample = 'ӘҒҚҢӨҰҮҺІ әғқңөұүһі 1991';
    Promise.all([
      ...[500, 600, 700, 800, 900].map((w) => document.fonts.load(`${w} 40px "Montserrat"`, sample)),
      ...[600, 700].map((w) => document.fonts.load(`${w} 40px "Noto Serif Display"`, sample)),
      document.fonts.load(`italic 600 40px "Noto Serif Display"`, sample),
    ]).then(() => continueRender(h));
  }, [h]);
  return <Main />;
};

export const Root: React.FC = () => (
  <Composition id="KZ35" component={FontGate} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
