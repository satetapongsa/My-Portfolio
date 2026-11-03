import { useCallback, useEffect, useReducer } from 'react';
import { BOOT_DURATION, RAW_DURATION, REVEAL_DURATION, SKIP_INTRO_PARAM } from '../config/boot';
import type { SectionId } from '../data/types';
import { loadBootSequence, loadFonts, loadPortfolio } from '../utils/loaders';

export type BootPhase = 'raw' | 'boot' | 'reveal' | 'ready';

interface BootState {
  phase: BootPhase;
  /** BOOT timing starts only once the overlay (and its CSS) is mounted. */
  bootMounted: boolean;
  /** Section the visitor asked for from the raw page, scrolled to on READY. */
  target: SectionId | null;
}

type BootAction =
  | { type: 'START_BOOT'; target: SectionId | null; reducedMotion: boolean }
  | { type: 'BOOT_MOUNTED' }
  | { type: 'BOOT_DONE' }
  | { type: 'SKIP'; target: SectionId | null }
  | { type: 'REVEAL_DONE' };

const initialState: BootState = { phase: 'raw', bootMounted: false, target: null };

/** Transitions only ever move forward, so stray timers can't rewind state. */
function reducer(state: BootState, action: BootAction): BootState {
  switch (action.type) {
    case 'START_BOOT':
      if (state.phase !== 'raw') return state;
      return {
        ...state,
        phase: action.reducedMotion ? 'reveal' : 'boot',
        target: action.target ?? state.target,
      };
    case 'BOOT_MOUNTED':
      return state.phase === 'boot' && !state.bootMounted ? { ...state, bootMounted: true } : state;
    case 'BOOT_DONE':
      return state.phase === 'boot' ? { ...state, phase: 'reveal' } : state;
    case 'SKIP':
      if (state.phase !== 'raw' && state.phase !== 'boot') return state;
      return { ...state, phase: 'reveal', target: action.target ?? state.target };
    case 'REVEAL_DONE':
      return state.phase === 'reveal' ? { ...state, phase: 'ready' } : state;
    default:
      return state;
  }
}

/** Shared across StrictMode remounts so the RAW clock never restarts. */
let rawShownAt: number | null = null;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useBootSequence() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { phase, bootMounted } = state;

  // Expose the phase on <html>; all boot/portfolio CSS is scoped to it.
  useEffect(() => {
    document.documentElement.dataset.phase = phase;
  }, [phase]);

  const startBoot = useCallback((target: SectionId | null = null) => {
    loadFonts();
    void loadPortfolio();
    dispatch({ type: 'START_BOOT', target, reducedMotion: prefersReducedMotion() });
  }, []);

  const skip = useCallback((target: SectionId | null = null) => {
    loadFonts();
    // Only reveal once the destination is ready, so the wipe never exposes a blank page.
    Promise.all([loadBootSequence(), loadPortfolio()])
      .catch(() => undefined) // the ErrorBoundary surfaces load failures
      .then(() => dispatch({ type: 'SKIP', target }));
  }, []);

  const markBootMounted = useCallback(() => dispatch({ type: 'BOOT_MOUNTED' }), []);

  // RAW: wait out the remainder of RAW_DURATION from first display.
  useEffect(() => {
    if (phase !== 'raw') return;
    if (new URLSearchParams(window.location.search).get(SKIP_INTRO_PARAM) === 'skip') {
      skip();
      return;
    }
    rawShownAt ??= performance.now();
    // Warm every later-phase asset now so BOOT starts on time with no lazy-load gap.
    // All of it is scoped to .boot / .wave-app / html[data-phase], so the RAW page is untouched.
    void loadBootSequence();
    void loadPortfolio();
    loadFonts();
    const remaining = Math.max(0, RAW_DURATION - (performance.now() - rawShownAt));
    const id = window.setTimeout(() => startBoot(), remaining);
    return () => window.clearTimeout(id);
  }, [phase, startBoot, skip]);

  // BOOT: run for BOOT_DURATION once mounted, and never reveal before the portfolio chunk exists.
  useEffect(() => {
    if (phase !== 'boot' || !bootMounted) return;
    let cancelled = false;
    Promise.all([delay(BOOT_DURATION), loadPortfolio().catch(() => undefined)]).then(() => {
      if (!cancelled) dispatch({ type: 'BOOT_DONE' });
    });
    return () => {
      cancelled = true;
    };
  }, [phase, bootMounted]);

  // REVEAL → READY.
  useEffect(() => {
    if (phase !== 'reveal') return;
    const id = window.setTimeout(() => dispatch({ type: 'REVEAL_DONE' }), REVEAL_DURATION);
    return () => window.clearTimeout(id);
  }, [phase]);

  return { phase, target: state.target, startBoot, skip, markBootMounted };
}
