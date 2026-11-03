import { Component, type ErrorInfo, type ReactNode } from 'react';
import { getStoredLang } from '../i18n/lang';
import { ui } from '../i18n/ui';

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
    // Rendered outside the language provider, so read the saved preference directly.
    const t = ui[getStoredLang()].error;
    return (
      <div role="alert">
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <p>
          <button type="button" onClick={() => window.location.reload()}>
            {t.reload}
          </button>
        </p>
      </div>
    );
  }
}
