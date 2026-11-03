import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { PointerEvent, ReactNode } from 'react';
import { useFinePointer } from '../../hooks/useMediaQuery';

/** Pulls its child slightly toward the cursor. Inert on touch and reduced motion. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 });
  const enabled = fine && !reduced;

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span style={{ x, y, display: 'inline-flex' }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}
