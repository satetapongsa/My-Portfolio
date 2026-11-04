/**
 * A tiny History-API router. The site only has a handful of routes, so this
 * avoids a routing dependency while keeping real, shareable URLs
 * (Vercel rewrites every path to index.html — see vercel.json).
 */
import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'project'; slug: string }
  | { name: 'journal' }
  | { name: 'article'; slug: string }
  | { name: 'lab' }
  | { name: 'notFound' };

const NAVIGATE_EVENT = 'wave:navigate';

/** How the current location was reached; pages use it to restore scroll on Back. */
let lastNavigation: 'push' | 'pop' = 'push';
const scrollMemory = new Map<string, number>();

const normalise = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path) || '/';

export function matchRoute(pathname: string): Route {
  const path = normalise(pathname);
  if (path === '/') return { name: 'home' };
  if (path === '/journal') return { name: 'journal' };
  if (path === '/lab') return { name: 'lab' };
  const project = /^\/projects\/([a-z0-9-]+)$/.exec(path);
  if (project) return { name: 'project', slug: project[1] };
  const article = /^\/journal\/([a-z0-9-]+)$/.exec(path);
  if (article) return { name: 'article', slug: article[1] };
  return { name: 'notFound' };
}

function subscribe(callback: () => void) {
  const onPop = () => {
    lastNavigation = 'pop';
    callback();
  };
  window.addEventListener('popstate', onPop);
  window.addEventListener(NAVIGATE_EVENT, callback);
  return () => {
    window.removeEventListener('popstate', onPop);
    window.removeEventListener(NAVIGATE_EVENT, callback);
  };
}

const getPathname = () => normalise(window.location.pathname);

export function usePathname() {
  return useSyncExternalStore(subscribe, getPathname, () => '/');
}

export function useRoute(): Route {
  return matchRoute(usePathname());
}

export const isHomePath = () => getPathname() === '/';

/** Client-side navigation; `to` may include a #hash for a home-page section. */
export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (to === current) return;
  scrollMemory.set(getPathname(), window.scrollY);
  lastNavigation = 'push';
  history[replace ? 'replaceState' : 'pushState'](null, '', to);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

/** Scroll position to restore for this path when it was reached with Back/Forward. */
export function consumeRestoredScroll(path: string): number | null {
  if (lastNavigation !== 'pop') return null;
  return scrollMemory.get(normalise(path)) ?? null;
}

export const routePaths = {
  home: '/',
  project: (slug: string) => `/projects/${slug}`,
  journal: '/journal',
  article: (slug: string) => `/journal/${slug}`,
  lab: '/lab',
};
