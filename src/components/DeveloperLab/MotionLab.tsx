import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { LabStrings } from '../../pages/DeveloperLab/strings';
import { prefersReducedMotion } from '../../utils/links';
import { Slider, Toggle } from './controls';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Running only while on screen and while the visitor has not paused it. */
function useVisible<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

function Tile({ title, desc, stage, children }: { title: string; desc: string; stage: ReactNode; children: ReactNode }) {
  return (
    <div className="motion-tile">
      <div className="motion-tile__stage">{stage}</div>
      <div className="motion-tile__body">
        <h3 className="motion-tile__title">{title}</h3>
        <p className="motion-tile__desc">{desc}</p>
        <div className="motion-tile__controls">{children}</div>
      </div>
    </div>
  );
}

export function MotionLab({ s }: { s: LabStrings }) {
  const m = s.motion;
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [ref, visible] = useVisible<HTMLDivElement>();
  const [glitch, setGlitch] = useState({ intensity: 5, speed: 5 });
  const [scan, setScan] = useState({ density: 4, opacity: 35, speed: 5 });
  const [rgb, setRgb] = useState({ offset: 3, wobble: true });
  const [ambient, setAmbient] = useState({ hue: 190, speed: 5 });
  const reduced = prefersReducedMotion();
  const running = playing && visible;

  return (
    <div ref={ref} className="motion-lab" data-running={running ? 'true' : 'false'}>
      <div className="motion-lab__bar">
        <button type="button" className="btn btn--primary btn--sm" aria-pressed={playing} onClick={() => setPlaying((p) => !p)}>
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />} {playing ? m.pause : m.play}
        </button>
        {reduced && !playing && <p className="lab-note">{m.reducedNote}</p>}
      </div>

      <div className="motion-grid">
        <Tile
          title={m.glitch}
          desc={m.glitchDesc}
          stage={
            <div
              className="fx-glitch"
              style={{ '--g-amp': `${glitch.intensity * 0.8}px`, '--g-dur': `${(11 - glitch.speed) * 0.35}s` } as Vars}
              aria-hidden="true"
            >
              <span data-text="WAVE">WAVE</span>
            </div>
          }
        >
          <Slider label={m.intensity} value={glitch.intensity} min={1} max={10} onChange={(v) => setGlitch((g) => ({ ...g, intensity: v }))} />
          <Slider label={m.speed} value={glitch.speed} min={1} max={10} onChange={(v) => setGlitch((g) => ({ ...g, speed: v }))} />
        </Tile>

        <Tile
          title={m.scanlines}
          desc={m.scanDesc}
          stage={
            <div
              className="fx-scan"
              style={{ '--s-gap': `${scan.density}px`, '--s-op': scan.opacity / 100, '--s-dur': `${(11 - scan.speed) * 0.8}s` } as Vars}
              aria-hidden="true"
            >
              <span className="fx-scan__label mono">SIGNAL 04</span>
            </div>
          }
        >
          <Slider label={m.density} value={scan.density} min={2} max={10} unit="px" onChange={(v) => setScan((x) => ({ ...x, density: v }))} />
          <Slider label={m.opacity} value={scan.opacity} min={0} max={80} unit="%" onChange={(v) => setScan((x) => ({ ...x, opacity: v }))} />
          <Slider label={m.speed} value={scan.speed} min={1} max={10} onChange={(v) => setScan((x) => ({ ...x, speed: v }))} />
        </Tile>

        <Tile
          title={m.rgb}
          desc={m.rgbDesc}
          stage={
            <div className={`fx-rgb ${rgb.wobble ? 'fx-rgb--wobble' : ''}`} style={{ '--r-off': `${rgb.offset}px` } as Vars} aria-hidden="true">
              Satetapong
            </div>
          }
        >
          <Slider label={m.offset} value={rgb.offset} min={0} max={10} unit="px" onChange={(v) => setRgb((x) => ({ ...x, offset: v }))} />
          <Toggle label={m.wobble} checked={rgb.wobble} onChange={(v) => setRgb((x) => ({ ...x, wobble: v }))} />
        </Tile>

        <Tile
          title={m.ambient}
          desc={m.ambientDesc}
          stage={<div className="fx-ambient" style={{ '--a-hue': ambient.hue, '--a-dur': `${(11 - ambient.speed) * 2.4}s` } as Vars} aria-hidden="true" />}
        >
          <Slider label={m.hue} value={ambient.hue} min={0} max={360} step={5} unit="°" onChange={(v) => setAmbient((x) => ({ ...x, hue: v }))} />
          <Slider label={m.speed} value={ambient.speed} min={1} max={10} onChange={(v) => setAmbient((x) => ({ ...x, speed: v }))} />
        </Tile>
      </div>
    </div>
  );
}
