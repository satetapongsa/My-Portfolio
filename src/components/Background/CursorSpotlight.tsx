import { useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useFinePointer } from '../../hooks/useMediaQuery';

/**
 * Desktop-only ambient spotlight that trails the cursor, plus delegated
 * pointer tracking for `.glow-card` border highlights. One rAF-throttled
 * listener drives both.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!fine) return;
    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    const update = () => {
      frame = 0;
      const event = lastEvent;
      if (!event) return;
      const el = ref.current;
      if (el && !reduced) {
        el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        el.classList.add('is-active');
      }
      const card = (event.target as Element | null)?.closest?.<HTMLElement>('.glow-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      }
    };

    const onMove = (event: PointerEvent) => {
      lastEvent = event;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => ref.current?.classList.remove('is-active');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return <div ref={ref} className="spotlight" aria-hidden="true" />;
}
