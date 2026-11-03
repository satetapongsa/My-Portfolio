import { useEffect, useState, type CSSProperties } from 'react';
import { TERMINAL_LINES } from '../../config/boot';
import { RawDocument } from '../RawDocument/RawDocument';
import './boot.css';

interface BootSequenceProps {
  /** 'boot' plays the failure/recovery timeline; 'reveal' wipes the overlay away. */
  mode: 'boot' | 'reveal';
  onMount: () => void;
  onSkip: () => void;
}

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** Deterministic PRNG so every visit gets the same choreography. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const range = (rand: () => number, min: number, max: number) => min + rand() * (max - min);

// ── Torn image bands: clipped copies of the raw page that slip sideways ──
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
      delay: Math.round(range(rand, 0, 90)),
    };
    top += h;
    return band;
  });
}

// ── Pixel blocks: corrupted image data, three waves with distinct behaviour ──
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
  corrupt: { seed: 3, start: [850, 1750], dur: [200, 460], w: [3, 16], h: [1.2, 6], tones: ['cyan', 'blue', 'red', 'rgb', 'data', 'invert', 'black'] },
  critical: { seed: 5, start: [1820, 2760], dur: [160, 520], w: [10, 46], h: [2.5, 15], tones: ['cyan', 'violet', 'red', 'white', 'black', 'rgb', 'data', 'invert', 'blue'] },
  rebuild: { seed: 9, start: [3000, 3550], dur: [600, 900], w: [2.5, 11], h: [0.8, 4], tones: ['cyan', 'blue', 'violet', 'data'] },
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
 * PHASE 02 — digital system failure → recovery. The whole 5 s timeline is
 * declarative CSS (boot.css) keyed off animation delays; React mounts it once
 * and never re-renders frames. Layout is generated deterministically.
 */
export default function BootSequence({ mode, onMount, onSkip }: BootSequenceProps) {
  // Mounted straight into 'reveal' (skip from RAW / reduced motion): show the settled frame only.
  const [direct] = useState(mode === 'reveal');
  // Captured once: fewer layers on small screens, and the raw page's scroll offset for the torn copies.
  const [setup] = useState(() => {
    const compact = window.matchMedia('(max-width: 640px)').matches;
    return {
      compact,
      scrollY: window.scrollY,
      bands: makeBands(compact ? BAND_HEIGHTS_MOBILE : BAND_HEIGHTS_DESKTOP),
      corrupt: makeBlocks('corrupt', compact ? 8 : 18),
      critical: makeBlocks('critical', compact ? 9 : 17),
      rebuild: makeBlocks('rebuild', compact ? 8 : 16),
    };
  });

  useEffect(() => {
    onMount();
  }, [onMount]);

  // Let keyboard users skip with Escape as well as the button.
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
      {/* Black "no picture" layer that takes over once the signal drops */}
      <div className="boot__void" aria-hidden="true" />

      {/* Reconstructed interface, revealed after the CRT collapse */}
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
          <span key={`h${top}`} className="boot__hline" style={{ top: `${top}%`, animationDelay: `${3120 + i * 110}ms` }} />
        ))}
        {V_LINES.map((left, i) => (
          <span key={`v${left}`} className="boot__vline" style={{ left: `${left}%`, animationDelay: `${3180 + i * 100}ms` }} />
        ))}
        {setup.rebuild.map((b, i) => (
          <span key={`r${i}`} className={`boot__block boot__block--${b.tone} boot__block--settle`} style={blockStyle(b)} />
        ))}
        {FRAGMENTS.map((f, i) => (
          <span key={f.label} className={`boot__fragment boot__fragment--${f.pos}`} style={{ animationDelay: `${3300 + i * 140}ms` }}>
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
              <i key={i} style={{ animationDelay: `${3150 + i * 68}ms` }} />
            ))}
          </div>
          <div className="boot__status">
            <span className="boot__status-line boot__status-line--work">RECONSTRUCTING INTERFACE...</span>
            <span className="boot__status-line boot__status-line--ok">SYSTEM RECOVERED</span>
          </div>
          <span className="boot__online">DIGITAL INTERFACE ONLINE</span>
        </div>
      </div>

      {/* Torn copies of the raw page: horizontal tearing, roll and CRT collapse */}
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

      {/* Signal-loss moment */}
      <div className="boot__nosignal" aria-hidden="true">
        <span>NO SIGNAL</span>
      </div>

      {/* HUD alerts */}
      <div className="boot__alerts" aria-hidden="true">
        <span className="boot__alert boot__alert--warn" style={{ '--in': '420ms', '--len': '760ms' } as Vars}>
          <b>!</b> INCOMING SIGNAL DETECTED
        </span>
        <span className="boot__alert boot__alert--info" style={{ '--in': '1200ms', '--len': '640ms' } as Vars}>
          ESTABLISHING CONNECTION<i>...</i>
        </span>
        <span className="boot__alert boot__alert--critical" style={{ '--in': '2180ms', '--len': '460ms' } as Vars} data-text="SIGNAL CORRUPTION DETECTED">
          SIGNAL CORRUPTION DETECTED
        </span>
      </div>

      {/* Diagnostic terminal */}
      <div className="boot__term" aria-hidden="true">
        <div className="boot__term-head">
          <span className="boot__term-dot" />
          diag://display-driver
          <span className="boot__term-pid">pid 0x3f</span>
        </div>
        <ol className="boot__term-body">
          {TERMINAL_LINES.map((line) => (
            <li key={line.text} className={`boot__term-line boot__term-line--${line.tag.toLowerCase()}`} style={{ animationDelay: `${line.at}ms` }}>
              <span className="boot__term-tag">[{line.tag}]</span> {line.text}
            </li>
          ))}
          <li className="boot__term-cursor" />
        </ol>
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
        {mode === 'boot' ? 'Loading the portfolio interface.' : 'Portfolio ready.'}
      </p>

      {mode === 'boot' && (
        <button type="button" className="boot__skip" onClick={onSkip}>
          Skip intro <kbd>Esc</kbd>
        </button>
      )}
    </div>
  );
}
