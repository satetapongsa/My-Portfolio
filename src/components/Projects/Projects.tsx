import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { githubReposUrl } from '../../data/projects';
import type { Project, ProjectFilter } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { GitHubIcon } from '../ui/BrandIcons';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from './ProjectCard';
import './projects.css';

type FilterId = ProjectFilter | 'all';

export function Projects({ onQuickView }: { onQuickView: (project: Project) => void }) {
  const { t, content } = useI18n();
  const { projects, projectFilters } = content;
  const [filter, setFilter] = useState<FilterId>('all');

  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([['all', projects.length]]);
    projects.forEach((p) => map.set(p.filter, (map.get(p.filter) ?? 0) + 1));
    return map;
  }, [projects]);

  const visible = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.filter === filter)), [filter, projects]);
  const activeLabel = projectFilters.find((f) => f.id === filter)?.label ?? '';

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          id="projects-title"
          index="03"
          label={t.projects.label}
          title={
            <>
              {t.projects.titleA} <span className="gradient-text">{t.projects.titleAccent}</span>
              {t.common.dot}
            </>
          }
          lead={t.projects.lead}
        />

        <Reveal className="projects__filters" y={12}>
          <div role="group" aria-label={t.projects.filterGroup} className="projects__filter-group">
            {/* Categories with no featured project are hidden rather than shown as "0". */}
            {projectFilters.filter((f) => (counts.get(f.id) ?? 0) > 0).map((f) => {
              const count = counts.get(f.id) ?? 0;
              const isActive = f.id === filter;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`filter-btn ${isActive ? 'is-active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => setFilter(f.id)}
                >
                  {isActive && <motion.span layoutId="filter-active" className="filter-btn__bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="filter-btn__label">{f.label}</span>
                  <span className="filter-btn__count mono">{count}</span>
                </button>
              );
            })}
          </div>
          <p className="projects__result mono" aria-live="polite">
            {visible.length} {visible.length === 1 ? t.projects.one : t.projects.many} · {activeLabel}
          </p>
        </Reveal>

        <motion.div layout className="projects__grid">
          <AnimatePresence initial={false}>
            {visible.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                onQuickView={onQuickView}
                priority={filter === 'all' && i < 2}
                featured={filter === 'all' && project.rank === 1}
              />
            ))}
            {visible.length === 0 && (
              <motion.div
                key="empty"
                className="projects__empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="mono projects__empty-code">0</p>
                <p>{t.projects.empty}</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilter('all')}>
                  {t.projects.showAll}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Reveal className="projects__more" y={12}>
          <a className="btn btn--ghost" href={githubReposUrl} target="_blank" rel="noopener noreferrer">
            <GitHubIcon /> {t.projects.viewAll}
            <span className="sr-only"> {t.common.opensInNewTab}</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
