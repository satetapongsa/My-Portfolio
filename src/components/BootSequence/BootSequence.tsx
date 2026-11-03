import { useEffect, useState, type CSSProperties } from 'react';
import { getStoredLang } from '../../i18n/lang';
import { ui } from '../../i18n/ui';
import { RawDocument } from '../RawDocument/RawDocument';
import './boot.css';

interface BootSequenceProps {
  /** 'boot' plays the failure/recovery timeline; 'reveal' wipes the overlay away. */
  mode: 'boot' | 'reveal';
  onMount: () => void;
  onSkip: () => void;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Deterministic PRNG: irregular-looking, but identical on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const range = (rand: () => number, min: number, max: number) => min + rand() * (max - min);

// ── Torn image bands: clipped copies of the raw page that slip, freeze and jump ──
const BAND_HEIGHTS_DESKTOP = [6, 13, 8, 17, 7, 15, 11, 23];
const BAND_HEIGHTS_MOBILE = [12, 22, 15, 26, 25];

function makeBands(heights: number[]) {
  const rand = seeded(11);
  let top = 0;
  return heights.map((h, i) => {
    const band = {
      top,
      bottom: Math.max(0, 100 - top - h),
      variant: (['a', 'b', 'c'] as const)[i % 3],
      x1: Math.round(range(rand, 12, 70) * (rand() > 0.5 ? 1 : -1)),
      x2: Math.round(range(rand, 20, 120) * (rand() > 0.5 ? 1 : -1)),
      x3: Math.round(range(rand, 30, 180) * (rand() > 0.5 ? 1 : -1)),
      delay: Math.round(range(rand, 0, 70)),
    };
    top += h;
    return band;
  });
}

// ── Pixel blocks: corrupted image data in three waves ──
type BlockTone = 'cyan' | 'blue' | 'violet' | 'red' | 'white' | 'black' | 'rgb' | 'data' | 'invert';
type BlockMotion = 'flick' | 'slide' | 'settle';

interface Block {
  left: number;
  top: number;
  w: number;
  h: number;
  tone: BlockTone;
  motion: BlockMotion;
  at: number;
  dur: number;
  dx: number;
  dy: number;
}

const WAVES = {
  corrupt: { seed: 3, start: [1050, 2450], dur: [140, 420], w: [3, 16], h: [1.2, 6], tones: ['cyan', 'blue', 'red', 'rgb', 'data', 'invert', 'black'] },
  critical: { seed: 5, start: [2500, 3350], dur: [120, 460], w: [10, 46], h: [2.5, 15], tones: ['cyan', 'violet', 'red', 'white', 'black', 'rgb', 'data', 'invert', 'blue'] },
  rebuild: { seed: 9, start: [3550, 4100], dur: [520, 820], w: [2.5, 11], h: [0.8, 4], tones: ['cyan', 'blue', 'violet', 'data'] },
} as const;

function makeBlocks(wave: keyof typeof WAVES, count: number): Block[] {
  const cfg = WAVES[wave];
  const rand = seeded(cfg.seed);
  return Array.from({ length: count }, () => {
    const w = range(rand, cfg.w[0], cfg.w[1]);
    const h = range(rand, cfg.h[0], cfg.h[1]);
    return {
      left: range(rand, -4, 100 - w * 0.6),
      top: range(rand, 2, 96 - h),
      w,
      h,
      tone: cfg.tones[Math.floor(rand() * cfg.tones.length)] as BlockTone,
      motion: wave === 'rebuild' ? 'settle' : rand() > 0.45 ? 'flick' : 'slide',
      at: Math.round(range(rand, cfg.start[0], cfg.start[1])),
      dur: Math.round(range(rand, cfg.dur[0], cfg.dur[1])),
      dx: Math.round(range(rand, 20, wave === 'critical' ? 220 : 120) * (rand() > 0.5 ? 1 : -1)),
      dy: Math.round(range(rand, -60, 60)),
    };
  });
}

const blockStyle = (b: Block): Vars => ({
  left: `${b.left.toFixed(2)}%`,
  top: `${b.top.toFixed(2)}%`,
  width: `${b.w.toFixed(2)}%`,
  height: `${b.h.toFixed(2)}%`,
  animationDelay: `${b.at}ms`,
  animationDuration: `${b.dur}ms`,
  '--dx': `${b.dx}px`,
  '--dy': `${b.dy}px`,
});

// ── Electrical bursts: short jagged arcs at random spots ──
function sparkPath(rand: () => number) {
  let x = 0;
  let y = 20 + rand() * 20;
  const pts = [`M${x} ${y.toFixed(1)}`];
  while (x < 200) {
    x += 10 + rand() * 22;
    y = Math.max(2, Math.min(58, y + (rand() - 0.5) * 34));
    pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

const SPARK_TIMES = [1120, 1460, 1750, 2060, 2290, 2560, 2790, 3180, 4560];

function makeSparks(count: number) {
  const rand = seeded(23);
  return SPARK_TIMES.slice(0, count).map((at, i) => ({
    at,
    left: range(rand, 4, 70),
    top: range(rand, 6, 88),
    width: range(rand, 14, 34),
    rotate: Math.round(range(rand, -28, 28)),
    tone: (['cyan', 'white', 'violet', 'cyan', 'red'] as const)[i % 5],
    d: sparkPath(rand),
  }));
}

// ── Localised flicker bands (uneven brightness, never full-screen strobe) ──
function makeFlickBands(count: number) {
  const rand = seeded(41);
  return Array.from({ length: count }, () => ({
    top: range(rand, 0, 92),
    height: range(rand, 2, 14),
    at: Math.round(range(rand, 150, 3400)),
    dark: rand() > 0.45,
  }));
}

const H_LINES = [18, 34, 61, 79, 88];
const V_LINES = [12, 27, 50, 73, 91];
const FRAGMENTS = [
  { label: 'SYS.UI / 0x01', pos: 'tl' },
  { label: 'NODE // WAVE', pos: 'tr' },
  { label: 'SIGNAL ▸ LOCKED', pos: 'bl' },
  { label: 'RENDER.PIPE', pos: 'br' },
] as const;
const BAR_SEGMENTS = 14;

const noop = () => {};

/**
 * PHASE 02 — broken CRT / digital system failure → recovery. The 5 s timeline
 * is declarative CSS (boot.css); React mounts it once and never re-renders
 * frames. Layout and timing are generated deterministically.
 */
export default function BootSequence({ mode, onMount, onSkip }: BootSequenceProps) {
  // Mounted straight into 'reveal' (skip from RAW / reduced motion): show the settled frame only.
  const [direct] = useState(mode === 'reveal');
  const [setup] = useState(() => {
    const compact = window.matchMedia('(max-width: 640px)').matches;
    return {
      compact,
      t: ui[getStoredLang()].boot,
      scrollY: window.scrollY,
      bands: makeBands(compact ? BAND_HEIGHTS_MOBILE : BAND_HEIGHTS_DESKTOP),
      corrupt: makeBlocks('corrupt', compact ? 8 : 18),
      critical: makeBlocks('critical', compact ? 9 : 17),
      rebuild: makeBlocks('rebuild', compact ? 8 : 16),
      sparks: makeSparks(compact ? 6 : SPARK_TIMES.length),
      flicks: makeFlickBands(compact ? 7 : 12),
    };
  });
  const { t } = setup;

  useEffect(() => {
    onMount();
  }, [onMount]);

  useEffect(() => {
    if (mode !== 'boot') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, onSkip]);

  return (
    <div className={`boot boot--${mode}${direct ? ' boot--direct' : ''}${setup.compact ? ' boot--compact' : ''}`}>
      {/* Black signal interruptions, then "no picture" once the signal drops */}
      <div className="boot__void" aria-hidden="true" />

      {/* Reconstructed interface, revealed by the CRT collapse */}
      <div className="boot__stage" aria-hidden="true">
        <div className="boot__ambient" />
        <div className="boot__grid" />
        <div className="boot__poweron" />
        <div className="boot__frame">
          <span />
          <span />
          <span />
          <span />
        </div>
        {H_LINES.map((top, i) => (
          <span key={`h${top}`} className="boot__hline" style={{ top: `${top}%`, animationDelay: `${3620 + i * 110}ms` }} />
        ))}
        {V_LINES.map((left, i) => (
          <span key={`v${left}`} className="boot__vline" style={{ left: `${left}%`, animationDelay: `${3680 + i * 100}ms` }} />
        ))}
        {setup.rebuild.map((b, i) => (
          <span key={`r${i}`} className={`boot__block boot__block--${b.tone} boot__block--settle`} style={blockStyle(b)} />
        ))}
        {FRAGMENTS.map((f, i) => (
          <span key={f.label} className={`boot__fragment boot__fragment--${f.pos}`} style={{ animationDelay: `${3780 + i * 130}ms` }}>
            <i />
            {f.label}
          </span>
        ))}

        <div className="boot__core">
          <svg className="boot__mark" viewBox="0 0 120 80" role="presentation">
            <path className="boot__mark-path" d="M8 14 L28 66 L44 28 L60 52 L76 28 L92 66 L112 14" />
          </svg>
          <div className="boot__wordmark" data-text="WAVE">
            WAVE
          </div>
          <div className="boot__bar">
            {Array.from({ length: BAR_SEGMENTS }, (_, i) => (
              <i key={i} style={{ animationDelay: `${3650 + i * 52}ms` }} />
            ))}
          </div>
          <div className="boot__status">
            <span className="boot__status-line boot__status-line--work">{t.reconstructing}</span>
            <span className="boot__status-line boot__status-line--ok">{t.recovered}</span>
          </div>
          <span className="boot__online">{t.online}</span>
        </div>
      </div>

      {/* Torn copies of the raw page: tearing, stutters, roll and CRT collapse */}
      <div className="boot__tear" aria-hidden="true" inert>
        {setup.bands.map((b, i) => (
          <div
            key={i}
            className={`boot__band boot__band--${b.variant}`}
            style={
              {
                '--top': `${b.top}%`,
                '--bottom': `${b.bottom}%`,
                '--x1': `${b.x1}px`,
                '--x2': `${b.x2}px`,
                '--x3': `${b.x3}px`,
                animationDelay: `${b.delay}ms`,
              } as Vars
            }
          >
            <div className="boot__band-doc" style={{ top: -setup.scrollY }}>
              <RawDocument onNavigate={noop} />
            </div>
          </div>
        ))}
      </div>

      {/* Corrupted image data */}
      <div className="boot__blocks" aria-hidden="true">
        {[...setup.corrupt, ...setup.critical].map((b, i) => (
          <span key={i} className={`boot__block boot__block--${b.tone} boot__block--${b.motion}`} style={blockStyle(b)} />
        ))}
      </div>

      {/* Localised brightness flicker */}
      <div className="boot__flicks" aria-hidden="true">
        {setup.flicks.map((f, i) => (
          <span
            key={i}
            className={`boot__flick${f.dark ? ' boot__flick--dark' : ''}`}
            style={{ top: `${f.top.toFixed(1)}%`, height: `${f.height.toFixed(1)}%`, animationDelay: `${f.at}ms` }}
          />
        ))}
      </div>

      {/* Electrical bursts */}
      <div className="boot__sparks" aria-hidden="true">
        {setup.sparks.map((s, i) => (
          <svg
            key={i}
            className={`boot__spark boot__spark--${s.tone}`}
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            style={{
              left: `${s.left.toFixed(1)}%`,
              top: `${s.top.toFixed(1)}%`,
              width: `${s.width.toFixed(1)}%`,
              transform: `rotate(${s.rotate}deg)`,
              animationDelay: `${s.at}ms`,
            }}
          >
            <path d={s.d} />
          </svg>
        ))}
      </div>

      {/* Signal-loss moment */}
      <div className="boot__nosignal" aria-hidden="true">
        <span>{t.noSignal}</span>
      </div>

      {/* Brief HUD alerts */}
      <div className="boot__alerts" aria-hidden="true">
        <span className="boot__alert boot__alert--warn" style={{ '--in': '620ms', '--len': '700ms' } as Vars}>
          <b>!</b> {t.incoming}
        </span>
        <span className="boot__alert boot__alert--info" style={{ '--in': '1500ms', '--len': '620ms' } as Vars}>
          {t.connecting}
          <i>...</i>
        </span>
        <span className="boot__alert boot__alert--critical" style={{ '--in': '2900ms', '--len': '400ms' } as Vars} data-text={t.corruption}>
          {t.corruption}
        </span>
      </div>

      {/* Display artefacts */}
      <div className="boot__vbar" aria-hidden="true" />
      <div className="boot__beam boot__beam--one" aria-hidden="true" />
      <div className="boot__beam boot__beam--two" aria-hidden="true" />
      <div className="boot__rgb" aria-hidden="true" />
      <div className="boot__flicker" aria-hidden="true" />
      <div className="boot__scanlines" aria-hidden="true" />
      <div className="boot__noise" aria-hidden="true" />
      <div className="boot__sweep" aria-hidden="true" />
      <div className="boot__flash" aria-hidden="true" />
      <div className="boot__wipe-line" aria-hidden="true" />

      <p className="boot__sr" role="status">
        {mode === 'boot' ? t.srLoading : t.srReady}
      </p>

      {mode === 'boot' && (
        <button type="button" className="boot__skip" onClick={onSkip}>
          {t.skip} <kbd>Esc</kbd>
        </button>
      )}
    </div>
  );
}
