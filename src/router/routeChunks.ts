/**
 * Memoised route chunk loaders. Portfolio.tsx wraps them in React.lazy; the
 * boot hook calls preloadRoute() on a deep link so the page chunk downloads
 * in parallel with the portfolio shell instead of after it.
 */
import { matchRoute } from './router';

type Loader<T> = () => Promise<T>;

const memo = <T,>(load: Loader<T>): Loader<T> => {
  let promise: Promise<T> | undefined;
  return () => (promise ??= load());
};

export const loadCaseStudyPage = memo(() => import('../pages/ProjectCaseStudy/ProjectCaseStudyPage'));
export const loadJournalIndexPage = memo(() => import('../pages/Journal/JournalIndexPage'));
export const loadArticlePage = memo(() => import('../pages/Journal/ArticlePage'));
export const loadLabPage = memo(() => import('../pages/DeveloperLab/LabPage'));

/** Starts loading the chunk for `pathname` (no-op for the home page). */
export function preloadRoute(pathname: string): Promise<unknown> {
  const route = matchRoute(pathname);
  switch (route.name) {
    case 'project':
      return loadCaseStudyPage();
    case 'journal':
      return loadJournalIndexPage();
    case 'article':
      return loadArticlePage();
    case 'lab':
      return loadLabPage();
    default:
      return Promise.resolve();
  }
}
