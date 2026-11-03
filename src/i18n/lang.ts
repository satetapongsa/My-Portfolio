/**
 * Language + theme preferences. English and dark are the defaults; a choice
 * is only stored after the visitor explicitly makes one.
 */
export type Lang = 'en' | 'th';
export type Theme = 'dark' | 'light';

const LANG_KEY = 'wave-lang';
const THEME_KEY = 'wave-theme';

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage unavailable (private mode) — the choice simply isn't remembered
  }
}

export const getStoredLang = (): Lang => (read(LANG_KEY) === 'th' ? 'th' : 'en');
export const storeLang = (lang: Lang) => write(LANG_KEY, lang);

export const getStoredTheme = (): Theme => (read(THEME_KEY) === 'light' ? 'light' : 'dark');
export const storeTheme = (theme: Theme) => write(THEME_KEY, theme);

/**
 * Applied to <html> before React renders so the portfolio never flashes the
 * wrong theme. The attributes style nothing until the portfolio CSS (scoped
 * to .wave-app) is active, so the RAW page stays unstyled.
 */
export function applyDocumentPreferences(lang: Lang, theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.lang = lang;
}
