/**
 * Lazy chunk loaders. Each import is memoised so React.lazy, preloading and
 * the skip handler all share one request. The boot and portfolio CSS live in
 * these chunks; they are preloaded during RAW, but every selector is scoped to
 * .boot / .wave-app / html[data-phase], so the RAW page still renders with
 * pure browser defaults.
 */
let bootChunk: Promise<typeof import('../components/BootSequence/BootSequence')> | undefined;
let portfolioChunk: Promise<typeof import('../Portfolio')> | undefined;

export const loadBootSequence = () => (bootChunk ??= import('../components/BootSequence/BootSequence'));
export const loadPortfolio = () => (portfolioChunk ??= import('../Portfolio'));

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap';

let fontsRequested = false;
let fontSheet: HTMLLinkElement | null = null;

/**
 * Resolves once the main web fonts are usable, or after `timeout` ms —
 * whichever comes first. Deep links use it so text doesn't reflow (a layout
 * shift) when the fonts arrive; the home page hides font loading behind RAW.
 */
export function fontsReady(timeout = 900): Promise<void> {
  loadFonts();
  const sheetLoaded = new Promise<void>((resolve) => {
    if (!fontSheet || fontSheet.sheet) return resolve();
    fontSheet.addEventListener('load', () => resolve(), { once: true });
    fontSheet.addEventListener('error', () => resolve(), { once: true });
  });
  const faces = sheetLoaded.then(() =>
    Promise.all(['400 16px Inter', '600 16px "Space Grotesk"', '400 16px "JetBrains Mono"'].map((f) => document.fonts.load(f))),
  );
  return Promise.race([faces.then(() => undefined), new Promise<void>((r) => setTimeout(r, timeout))]).catch(() => undefined);
}

/** Injects the web fonts once, only when the styled phases begin. */
export function loadFonts() {
  if (fontsRequested || typeof document === 'undefined') return;
  fontsRequested = true;
  const preconnect = (href: string, crossOrigin = false) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };
  preconnect('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com', true);
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = FONTS_HREF;
  document.head.appendChild(sheet);
  fontSheet = sheet;
}
