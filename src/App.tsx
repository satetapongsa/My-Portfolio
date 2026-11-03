import { useEffect, useState, type ComponentType } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RawDocument } from './components/RawDocument/RawDocument';
import { useBootSequence } from './hooks/useBootSequence';
import { loadBootSequence, loadPortfolio } from './utils/loaders';

/**
 * Resolves a lazy chunk during RAW and hands back its default export, so the
 * component mounts synchronously when its phase begins. (React.lazy would
 * re-suspend and Suspense throttles reveals by ~300 ms, desyncing the timeline.)
 */
function usePreloaded<P>(loader: () => Promise<{ default: ComponentType<P> }>) {
  const [component, setComponent] = useState<ComponentType<P> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let alive = true;
    loader().then(
      (mod) => alive && setComponent(() => mod.default),
      (err: Error) => alive && setError(err),
    );
    return () => {
      alive = false;
    };
  }, [loader]);
  if (error) throw error; // surfaced by the ErrorBoundary
  return component;
}

function Phases() {
  const { phase, target, startBoot, skip, markBootMounted } = useBootSequence();
  const BootSequence = usePreloaded(loadBootSequence);
  const Portfolio = usePreloaded(loadPortfolio);

  const showRaw = phase === 'raw' || phase === 'boot';
  const showOverlay = phase === 'boot' || phase === 'reveal';
  const showPortfolio = phase === 'reveal' || phase === 'ready';

  return (
    <>
      {showRaw && <RawDocument onNavigate={startBoot} />}
      {showPortfolio && Portfolio && <Portfolio phase={phase} initialTarget={target} />}
      {showOverlay && BootSequence && (
        <BootSequence mode={phase === 'boot' ? 'boot' : 'reveal'} onMount={markBootMounted} onSkip={() => skip()} />
      )}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Phases />
    </ErrorBoundary>
  );
}
