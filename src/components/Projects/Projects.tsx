import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { conceptProjects, featuredProjects, githubReposUrl, projectFilters } from '../../data/projects';
import type { Project, ProjectFilter } from '../../data/types';
import { GitHubIcon } from '../ui/BrandIcons';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard, STAGE_DOT } from './ProjectCard';
import { ProjectCover } from './ProjectCover';
import './projects.css';

type FilterId = ProjectFilter | 'all';

export function Projects({ onOpen }: { onOpen: (project: Project) => void }) {
  const [filter, setFilter] = useState<FilterId>('all');

  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([['all', featuredProjects.length]]);
    featuredProjects.forEach((p) => map.set(p.filter, (map.get(p.filter) ?? 0) + 1));
    return map;
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? featuredProjects : featuredProjects.filter((p) => p.filter === filter)),
    [filter],
  );
  const activeLabel = projectFilters.find((f) => f.id === filter)?.label ?? 'All';

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeader
          id="projects-title"
          index="03"
          label="Featured Works"
          title={
            <>
              Built, shipped, <span className="gradient-text">iterating</span>.
            </>
          }
          lead="Five projects selected from my GitHub for engineering depth and range. Screenshots come from each project’s own live deployment, and every status is stated as it is."
        />

        <Reveal className="projects__filters" y={12}>
          <div role="group" aria-label="Filter projects by category" className="projects__filter-group">
            {projectFilters.map((f) => {
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
            {visible.length} {visible.length === 1 ? 'project' : 'projects'} · {activeLabel}
          </p>
        </Reveal>

        <motion.div layout className="projects__grid">
          <AnimatePresence initial={false}>
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={onOpen} />
            ))}
            {visible.length === 0 && (
              <motion.div
                key="empty"
                className="projects__empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p className="mono projects__empty-code">0 results</p>
                <p>No featured {activeLabel.toLowerCase()} projects yet.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilter('all')}>
                  Show all projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <Reveal className="projects__more" y={12}>
          <a className="btn btn--ghost" href={githubReposUrl} target="_blank" rel="noopener noreferrer">
            <GitHubIcon /> View all repositories on GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>

        {conceptProjects.length > 0 && (
          <Reveal className="projects__concepts" y={16}>
            <div className="projects__concepts-head">
              <h3>Concepts in development</h3>
              <p className="mono">design stage · no public repository yet</p>
            </div>
            <div className="projects__concepts-grid">
              {conceptProjects.map((project) => (
                <button key={project.id} type="button" className="concept-card glow-card" onClick={() => onOpen(project)}>
                  <ProjectCover project={project} />
                  <span>
                    <span className="concept-card__title">{project.title}</span>
                    <span className="concept-card__meta mono">
                      <span className={`status-dot ${STAGE_DOT[project.status.stage]}`} aria-hidden="true" />
                      {project.categoryLabel}
                    </span>
                    <span className="concept-card__cta">
                      View concept <ArrowRight aria-hidden />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
