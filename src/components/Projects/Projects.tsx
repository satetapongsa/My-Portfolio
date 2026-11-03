import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { projectFilters, projects } from '../../data/projects';
import type { Project, ProjectFilter } from '../../data/types';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from './ProjectCard';
import './projects.css';

type FilterId = ProjectFilter | 'all';

export function Projects({ onOpen }: { onOpen: (project: Project) => void }) {
  const [filter, setFilter] = useState<FilterId>('all');

  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([['all', projects.length]]);
    projects.forEach((p) => map.set(p.filter, (map.get(p.filter) ?? 0) + 1));
    return map;
  }, []);

  const visible = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.filter === filter)), [filter]);
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
              Systems in <span className="gradient-text">progress</span>.
            </>
          }
          lead="Engineering projects I’m actively designing and building. Each one is documented as it develops — concepts are labelled as concepts."
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
                <p>No {activeLabel.toLowerCase()} projects published yet — new work will appear here.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilter('all')}>
                  Show all projects
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
