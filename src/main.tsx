import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { applyDocumentPreferences, getStoredLang, getStoredTheme } from './i18n/lang';

// No CSS is imported here on purpose: the RAW phase relies on browser defaults.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Restore saved language/theme before the first render so the portfolio never
// flashes the wrong theme. These attributes style nothing on the RAW page.
applyDocumentPreferences(getStoredLang(), getStoredTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
