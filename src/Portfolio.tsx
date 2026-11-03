/**
 * PHASE 03 — the real portfolio. This module (and all CSS it imports) is a
 * lazy chunk, loaded only once the boot sequence begins.
 */
// Base styles first so component stylesheets can override them.
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';
import './styles/theme-light.css';
import './styles/i18n.css';
import { MotionConfig } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { About } from './components/About/About';
import { Background } from './components/Background/Background';
import { CursorSpotlight } from './components/Background/CursorSpotlight';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { Contact } from './components/Contact/Contact';
import { Credentials } from './components/Credentials/Credentials';
import { Footer } from './components/Footer/Footer';
import { Hero } from './components/Hero/Hero';
import { Journey } from './components/Journey/Journey';
import { Navigation } from './components/Navigation/Navigation';
import { ProjectDetails } from './components/ProjectDetails/ProjectDetails';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';
import type { TerminalActions } from './components/Terminal/commands';
import { ToastProvider } from './components/ui/Toast';
import { navItems } from './data/portfolio';
import type { Project, SectionId } from './data/types';
import { useActiveSection } from './hooks/useActiveSection';
import type { BootPhase } from './hooks/useBootSequence';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import { scrollToSection } from './utils/links';

const SECTION_IDS: SectionId[] = navItems.map((n) => n.id);

interface PortfolioProps {
  phase: BootPhase;
  initialTarget: SectionId | null;
}

export default function Portfolio(props: PortfolioProps) {
  return (
    <I18nProvider>
      <PortfolioShell {...props} />
    </I18nProvider>
  );
}

function PortfolioShell({ phase, initialTarget }: PortfolioProps) {
  const { t, content } = useI18n();
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Store the id, not the object, so an open project re-localises when the language changes.
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const activeProject = content.projects.find((p) => p.id === activeProjectId) ?? null;
  const activeSection = useActiveSection(SECTION_IDS);

  // The raw page may have been scrolled; always start the portfolio at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Honour a section picked on the raw page (or a #hash in the URL) once interactive.
  useEffect(() => {
    if (phase !== 'ready') return;
    const hash = window.location.hash.slice(1) as SectionId;
    const target = initialTarget ?? (SECTION_IDS.includes(hash) ? hash : null);
    if (target && target !== 'home') {
      const id = window.setTimeout(() => scrollToSection(target), 80);
      return () => window.clearTimeout(id);
    }
  }, [phase, initialTarget]);

  // Ctrl/Cmd + K toggles the palette from anywhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openProjectById = useCallback((id: string) => setActiveProjectId(id), []);
  const openProject = useCallback((project: Project) => setActiveProjectId(project.id), []);

  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeProject = useCallback(() => setActiveProjectId(null), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);

  const terminalActions = useMemo<TerminalActions>(
    () => ({ goto: scrollToSection, openProject: openProjectById }),
    [openProjectById],
  );

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <div className="wave-app">
          <a className="skip-link" href="#main">
            {t.common.skipToContent}
          </a>
          <Background />
          <CursorSpotlight />
          <Navigation active={activeSection} onOpenPalette={openPalette} />

          <main id="main" tabIndex={-1} className="wave-main">
            <Hero terminalActions={terminalActions} />
            <About />
            <Skills />
            <Projects onOpen={openProject} />
            <Journey />
            <Credentials />
            <Contact />
          </main>

          <Footer />

          <CommandPalette open={paletteOpen} onClose={closePalette} onOpenProject={openProjectById} />
          <ProjectDetails project={activeProject} onClose={closeProject} />
        </div>
      </ToastProvider>
    </MotionConfig>
  );
}
