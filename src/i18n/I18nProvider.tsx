import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { getContent, type Content } from './content';
import { applyDocumentPreferences, getStoredLang, getStoredTheme, storeLang, storeTheme, type Lang, type Theme } from './lang';
import { ui, type UIStrings } from './ui';

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** Interface strings for the active language. */
  t: UIStrings;
  /** Personal content (profile, projects, skills…) for the active language. */
  content: Content;
}

const I18nContext = createContext<I18nValue | null>(null);

/** Language + theme for the portfolio; both switch instantly and persist on explicit choice. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getStoredLang);
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  const setLang = useCallback(
    (next: Lang) => {
      storeLang(next);
      setLangState(next);
      applyDocumentPreferences(next, theme);
    },
    [theme],
  );

  const setTheme = useCallback(
    (next: Theme) => {
      storeTheme(next);
      setThemeState(next);
      applyDocumentPreferences(lang, next);
    },
    [lang],
  );

  // <title> and meta tags are owned per route by useDocumentMeta.

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, theme, setTheme, t: ui[lang], content: getContent(lang) }),
    [lang, setLang, theme, setTheme],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>');
  return value;
}
