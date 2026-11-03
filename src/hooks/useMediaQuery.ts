import { useSyncExternalStore } from 'react';

/** Subscribes to a media query without re-rendering on unrelated changes. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)');
