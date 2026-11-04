import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { isDirectEntry } from './hooks/useBootSequence';
import { applyDocumentPreferences, getStoredLang, getStoredTheme } from './i18n/lang';

// No CSS is imported here on purpose: the RAW phase relies on browser defaults.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// Restore saved language/theme before the first render so the portfolio never
// flashes the wrong theme. These attributes style nothing on the RAW page.
applyDocumentPreferences(getStoredLang(), getStoredTheme());

// A deep link skips the RAW page, so paint the theme background straight away
// instead of a white frame while the page chunk loads (removed on READY).
if (isDirectEntry()) document.documentElement.style.background = getStoredTheme() === 'light' ? '#f8fafc' : '#080a0f';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
