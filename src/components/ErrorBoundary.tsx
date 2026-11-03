import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/** Catches chunk-load or render failures and offers a reload instead of a blank screen. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Portfolio failed to render', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert">
        <h1>Something went wrong.</h1>
        <p>The interface could not be loaded. Check your connection and try again.</p>
        <p>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
        </p>
      </div>
    );
  }
}
