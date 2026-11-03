import { memo, useMemo, type CSSProperties } from 'react';
import './background.css';

/** Deterministic pseudo-random so particle layout is stable across renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Fixed atmospheric layer: grid, ambient light, noise, thin interface lines
 * and a handful of CSS-animated particles (no canvas, no per-frame JS).
 */
export const Background = memo(function Background() {
  const particles = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${(rand() * 100).toFixed(2)}%`,
      top: `${(30 + rand() * 70).toFixed(2)}%`,
      size: 1 + Math.round(rand() * 2),
      duration: `${14 + rand() * 16}s`,
      delay: `${-rand() * 20}s`,
      dx: `${(rand() - 0.5) * 80}px`,
      dy: `${-120 - rand() * 220}px`,
      opacity: (0.25 + rand() * 0.45).toFixed(2),
      tone: i % 5 === 0 ? 'violet' : 'cyan',
    }));
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__glow bg__glow--a" />
      <div className="bg__glow bg__glow--b" />
      <div className="bg__glow bg__glow--c" />
      <div className="bg__grid" />
      <div className="bg__lines">
        <span style={{ left: '8%' }} />
        <span style={{ left: '50%' }} />
        <span style={{ left: '92%' }} />
      </div>
      <div className="bg__particles">
        {particles.map((p) => (
          <i
            key={p.id}
            className={`bg__particle bg__particle--${p.tone}`}
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
                '--p-dx': p.dx,
                '--p-dy': p.dy,
                '--p-opacity': p.opacity,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="bg__noise" />
      <div className="bg__vignette" />
    </div>
  );
});
