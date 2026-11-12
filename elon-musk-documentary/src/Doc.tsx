import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Flashes, Grain, LightLeak, Progress, Vignette} from './components/Atmosphere';
import {Ending} from './components/Ending';
import {Shot} from './components/Shot';
import {Subtitles} from './components/Subtitles';
import {ChapterTitle, HookTitle, MainTitle} from './components/Titles';
import {loadFonts} from './fonts';
import {Battery, Feed, LocationTag, MarsPath, Neural, Payments, Scan, SourceTag, YearStamp} from './graphics/Graphics';
import timeline from './timeline.json';
import type {OverlayT, Timeline} from './types';

const tl = timeline as unknown as Timeline;
loadFonts();

const Overlay: React.FC<{o: OverlayT}> = ({o}) => {
  const p = (o.props ?? {}) as Record<string, never>;
  switch (o.type) {
    case 'payments':
      return <Payments dur={o.dur} />;
    case 'neural':
      return <Neural dur={o.dur} />;
    case 'feed':
      return <Feed dur={o.dur} />;
    case 'mars':
      return <MarsPath dur={o.dur} />;
    case 'battery':
      return <Battery dur={o.dur} />;
    case 'scan':
      return <Scan dur={o.dur} />;
    case 'location':
      return <LocationTag dur={o.dur} text={p.text} sub={p.sub} />;
    case 'year':
      return <YearStamp dur={o.dur} from={p.from} to={p.to} label={p.label} />;
    case 'mainTitle':
      return <MainTitle dur={o.dur} />;
    default:
      return null;
  }
};

export const Doc: React.FC = () => {
  const {fps} = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* 1. live-action picture */}
      {tl.shots.map((s) => (
        <Sequence key={s.id} from={f(s.start - s.transDur)} durationInFrames={f(s.end - s.start + s.transDur)} layout="none">
          <AbsoluteFill>
            <Shot shot={s} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* 2. look: leak, vignette, grain */}
      <LightLeak />
      <Vignette />
      <Grain />

      {/* 3. motion graphics */}
      {tl.overlays.map((o, i) => (
        <Sequence key={`o${i}`} from={f(o.at)} durationInFrames={f(o.dur)} layout="none">
          <Overlay o={o} />
        </Sequence>
      ))}

      {/* 4. archive / source labels */}
      {tl.shots
        .filter((s) => s.tag)
        .map((s) => (
          <Sequence key={`tag${s.id}`} from={f(s.start + 0.15)} durationInFrames={f(Math.max(0.5, s.end - s.start - 0.3))} layout="none">
            <SourceTag text={s.tag as string} />
          </Sequence>
        ))}

      {/* 5. titles */}
      {tl.titles.map((t, i) => (
        <Sequence key={`t${i}`} from={f(t.at)} durationInFrames={f(t.dur)} layout="none">
          {t.variant === 'hook' ? <HookTitle t={t} /> : <ChapterTitle t={t} />}
        </Sequence>
      ))}

      {/* 6. subtitles */}
      <Subtitles subs={tl.subs} />

      {/* 7. ending */}
      <Sequence from={f(tl.ending.finalAt)} layout="none">
        <Ending ctaAt={tl.ending.ctaAt - tl.ending.finalAt} credits={tl.credits} />
      </Sequence>

      <Flashes tl={tl} />
      <Progress />

      {/* 8. sound: one pre-mixed master (VO + original score + SFX, loudness-normalised) */}
      <Audio src={staticFile('audio/master.wav')} />
    </AbsoluteFill>
  );
};
