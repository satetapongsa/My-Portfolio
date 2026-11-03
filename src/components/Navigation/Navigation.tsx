import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { Command, Menu, X } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';
import { navItems } from '../../data/portfolio';
import type { SectionId } from '../../data/types';
import { scrollToSection } from '../../utils/links';
import { Logo } from './Logo';
import './navigation.css';

interface NavigationProps {
  active: SectionId;
  onOpenPalette: () => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function Navigation({ active, onOpenPalette }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  // Close the mobile menu on Escape or when the viewport grows past the breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const mql = window.matchMedia('(min-width: 900px)');
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
        <a href="#home" className="nav__brand" onClick={go('home')} aria-label="Wave — back to top">
          <Logo />
        </a>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {navItems.map((item) => (
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
          <button type="button" className="nav__palette" onClick={onOpenPalette} aria-label="Open command palette" aria-keyshortcuts="Control+K Meta+K">
            <Command aria-hidden />
            <span className="nav__palette-label">Search</span>
            <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <button
            type="button"
            className="nav__menu-btn icon-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
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
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="container">
              {navItems.map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <a href={`#${item.id}`} onClick={go(item.id)} className={`nav__mobile-link ${active === item.id ? 'is-active' : ''}`}>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
              <li>
                <button
                  type="button"
                  className="nav__mobile-link nav__mobile-cmd"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenPalette();
                  }}
                >
                  <Command aria-hidden /> Command palette
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
