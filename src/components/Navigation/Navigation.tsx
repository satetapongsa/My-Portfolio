import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { Command, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import type { SectionId } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import type { Lang } from '../../i18n/lang';
import { scrollToSection } from '../../utils/links';
import { Logo } from './Logo';
import './navigation.css';

interface NavigationProps {
  active: SectionId;
  onOpenPalette: () => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const DESKTOP_QUERY = '(min-width: 1100px)';

/** EN / TH segmented switch. */
function LanguageSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const options: { id: Lang; label: string; aria: string }[] = [
    { id: 'en', label: 'EN', aria: t.common.language.switchToEn },
    { id: 'th', label: 'TH', aria: t.common.language.switchTo },
  ];
  return (
    <div className={`seg ${className}`} role="group" aria-label={t.common.language.label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={`seg__btn mono ${lang === o.id ? 'is-active' : ''}`}
          aria-pressed={lang === o.id}
          aria-label={o.aria}
          lang={o.id}
          onClick={() => setLang(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Sun / moon toggle. */
function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, setTheme, t } = useI18n();
  const next = theme === 'dark' ? 'light' : 'dark';
  const label = next === 'light' ? t.common.theme.toLight : t.common.theme.toDark;
  return (
    <button type="button" className={`theme-toggle ${withLabel ? 'theme-toggle--wide' : 'icon-btn'}`} onClick={() => setTheme(next)} aria-label={label} title={label}>
      {theme === 'dark' ? <Moon aria-hidden /> : <Sun aria-hidden />}
      {withLabel && <span>{theme === 'dark' ? t.common.theme.dark : t.common.theme.light}</span>}
    </button>
  );
}

export function Navigation({ active, onOpenPalette }: NavigationProps) {
  const { t, content } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  // Close the mobile menu on Escape or when the viewport grows to the desktop layout.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onResize = () => mql.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mql.addEventListener('change', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      mql.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  const go = (id: SectionId) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header className={`nav ${scrolled || menuOpen ? 'is-scrolled' : ''}`}>
      <div className="nav__inner container">
        <a href="#home" className="nav__brand" onClick={go('home')} aria-label={`Wave — ${t.nav.backToTop}`}>
          <Logo />
        </a>

        <nav className="nav__links" aria-label={t.nav.primary}>
          <ul>
            {content.navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={go(item.id)}
                  className={`nav__link ${active === item.id ? 'is-active' : ''}`}
                  aria-current={active === item.id ? 'location' : undefined}
                >
                  {active === item.id && (
                    <motion.span layoutId="nav-active" className="nav__indicator" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <span className="nav__link-text">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__actions">
          <LanguageSwitch className="nav__desktop-only" />
          <span className="nav__desktop-only">
            <ThemeToggle />
          </span>
          <button type="button" className="nav__palette" onClick={onOpenPalette} aria-label={t.nav.openPalette} aria-keyshortcuts="Control+K Meta+K">
            <Command aria-hidden />
            <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <button
            type="button"
            className="nav__menu-btn icon-btn"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </div>

      <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className="nav__mobile"
            aria-label={t.nav.mobile}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="container">
              {content.navItems.map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <a href={`#${item.id}`} onClick={go(item.id)} className={`nav__mobile-link ${active === item.id ? 'is-active' : ''}`}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <li className="nav__mobile-prefs" aria-label={t.nav.preferences}>
                <LanguageSwitch />
                <ThemeToggle withLabel />
              </li>
              <li>
                <button
                  type="button"
                  className="nav__mobile-link nav__mobile-cmd"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPalette();
                  }}
                >
                  <Command aria-hidden /> {t.nav.commandPalette}
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
