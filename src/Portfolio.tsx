/**
 * PHASE 03 — the real portfolio. This module (and all CSS it imports) is a
 * lazy chunk, loaded only once the boot sequence begins. It is also the
 * application shell for every route: the home page renders the sections
 * inline, while case studies, the journal and the lab are their own chunks.
 */
// Base styles first so component stylesheets can override them.
import './styles/variables.css';
import './styles/global.css';
import './styles/animations.css';
import './styles/theme-light.css';
import './styles/i18n.css';
import './styles/shared-v2.css';
import { MotionConfig } from 'motion/react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { About } from './components/About/About';
import { Background } from './components/Background/Background';
import { CursorSpotlight } from './components/Background/CursorSpotlight';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { Contact } from './components/Contact/Contact';
import { Credentials } from './components/Credentials/Credentials';
import { Footer } from './components/Footer/Footer';
import { GitHubActivity } from './components/GitHubActivity/GitHubActivity';
import { Hero } from './components/Hero/Hero';
import { Journey } from './components/Journey/Journey';
import { Navigation } from './components/Navigation/Navigation';
import { ProjectDetails } from './components/ProjectDetails/ProjectDetails';
import { Projects } from './components/Projects/Projects';
import { useDocumentMeta } from './components/SEO/useDocumentMeta';
import { Skills } from './components/Skills/Skills';
import type { TerminalActions } from './components/Terminal/commands';
import { ToastProvider } from './components/ui/Toast';
import { navItems } from './data/portfolio';
import type { Project, SectionId } from './data/types';
import { useActiveSection } from './hooks/useActiveSection';
import type { BootPhase } from './hooks/useBootSequence';
import { documentTitles, homeDescriptions } from './i18n/content';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { loadArticlePage, loadCaseStudyPage, loadJournalIndexPage, loadLabPage } from './router/routeChunks';
import { consumeRestoredScroll, navigate, routePaths, usePathname, useRoute, type Route } from './router/router';
import { scrollToSection } from './utils/links';

const ProjectCaseStudyPage = lazy(loadCaseStudyPage);
const JournalIndexPage = lazy(loadJournalIndexPage);
const ArticlePage = lazy(loadArticlePage);
const LabPage = lazy(loadLabPage);

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

function HomePage({ terminalActions, onQuickView }: { terminalActions: TerminalActions; onQuickView: (p: Project) => void }) {
  const { lang } = useI18n();
  useDocumentMeta({ title: documentTitles[lang], description: homeDescriptions[lang], path: '/' });
  return (
    <>
      <Hero terminalActions={terminalActions} />
      <About />
      <Skills />
      <Projects onQuickView={onQuickView} />
      <GitHubActivity />
      <Journey />
      <Credentials />
      <Contact />
    </>
  );
}

function RouteView({ route, home }: { route: Route; home: ReactNode }) {
  switch (route.name) {
    case 'home':
      return <>{home}</>;
    case 'project':
      return <ProjectCaseStudyPage slug={route.slug} />;
    case 'journal':
      return <JournalIndexPage />;
    case 'article':
      return <ArticlePage slug={route.slug} />;
    case 'lab':
      return <LabPage />;
    default:
      return <NotFoundPage />;
  }
}

/** Shown while a route chunk downloads (usually a few frames). */
function RouteFallback() {
  return <div className="route-loading" role="status" aria-live="polite" />;
}

function PortfolioShell({ phase, initialTarget }: PortfolioProps) {
  const { t, content } = useI18n();
  const route = useRoute();
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Store the id, not the object, so an open project re-localises when the language changes.
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const activeProject = content.projects.find((p) => p.id === activeProjectId) ?? null;
  const activeSection = useActiveSection(SECTION_IDS, pathname);

  // The raw page may have been scrolled; always start the portfolio at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Honour a section picked on the raw page (or a #hash in the URL) once interactive.
  const isHome = route.name === 'home';
  useEffect(() => {
    if (phase !== 'ready' || !isHome) return;
    const hash = window.location.hash.slice(1) as SectionId;
    const target = initialTarget ?? (SECTION_IDS.includes(hash) ? hash : null);
    if (target && target !== 'home') {
      const id = window.setTimeout(() => scrollToSection(target), 80);
      return () => window.clearTimeout(id);
    }
    // Runs once on reaching READY; later navigation is handled by the route effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, initialTarget]);

  // Route changes: restore scroll on Back/Forward, honour #section links, otherwise start at the top.
  const initialPath = useRef<string | null>(pathname);
  useEffect(() => {
    if (initialPath.current === pathname) {
      initialPath.current = null;
      return;
    }
    initialPath.current = null;
    setActiveProjectId(null);
    const restored = consumeRestoredScroll(pathname);
    if (restored !== null) {
      requestAnimationFrame(() => window.scrollTo(0, restored));
      return;
    }
    const hash = window.location.hash.slice(1) as SectionId;
    if (isHome && SECTION_IDS.includes(hash)) {
      const id = window.setTimeout(() => scrollToSection(hash), 60);
      return () => window.clearTimeout(id);
    }
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, isHome]);

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

  const openCaseStudy = useCallback((id: string) => navigate(routePaths.project(id)), []);
  const quickView = useCallback((project: Project) => setActiveProjectId(project.id), []);

  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeProject = useCallback(() => setActiveProjectId(null), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);

  const terminalActions = useMemo<TerminalActions>(
    () => ({ goto: scrollToSection, openProject: openCaseStudy }),
    [openCaseStudy],
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
          <Navigation active={isHome ? activeSection : null} route={route} onOpenPalette={openPalette} />

          <main id="main" tabIndex={-1} className="wave-main">
            <Suspense fallback={<RouteFallback />}>
              <RouteView route={route} home={<HomePage terminalActions={terminalActions} onQuickView={quickView} />} />
            </Suspense>
          </main>

          <Footer />

          <CommandPalette open={paletteOpen} onClose={closePalette} onOpenProject={openCaseStudy} />
          <ProjectDetails project={activeProject} onClose={closeProject} onOpenCaseStudy={openCaseStudy} />
        </div>
      </ToastProvider>
    </MotionConfig>
  );
}
