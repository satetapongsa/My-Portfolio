import { memo } from 'react';

const WIDTH = 1440;
const HEIGHT = 200;

/** Builds a sine path whose amplitude swells toward the centre. */
function sinePath(amplitude: number, wavelength: number, phase: number) {
  const points: string[] = [];
  for (let x = 0; x <= WIDTH; x += 8) {
    const envelope = Math.sin((x / WIDTH) * Math.PI);
    const y = HEIGHT / 2 + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude * envelope;
    points.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

const PATHS = [
  { d: sinePath(46, 360, 0), cls: 'wave-signal__path--main' },
  { d: sinePath(28, 240, 1.4), cls: 'wave-signal__path--alt' },
  { d: sinePath(16, 520, 2.6), cls: 'wave-signal__path--faint' },
];

/** The site's signature motif: a stabilised signal after the boot glitch. */
export const WaveSignal = memo(function WaveSignal() {
  return (
    <svg className="wave-signal" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="wave-signal-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#00D9FF" stopOpacity="0" />
          <stop offset="0.25" stopColor="#00D9FF" />
          <stop offset="0.6" stopColor="#387BFF" />
          <stop offset="0.85" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" x2={WIDTH} y1={HEIGHT / 2} y2={HEIGHT / 2} className="wave-signal__axis" />
      {PATHS.map((p) => (
        <path key={p.cls} d={p.d} className={`wave-signal__path ${p.cls}`} stroke="url(#wave-signal-grad)" />
      ))}
    </svg>
  );
});
