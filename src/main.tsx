import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// No CSS is imported here on purpose: the RAW phase relies on browser defaults.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
