import { motion } from 'motion/react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { Project, ProjectStage } from '../../data/types';
import { isConfigured } from '../../utils/links';
import { GitHubIcon } from '../ui/BrandIcons';
import { ProjectCover } from './ProjectCover';

export const STAGE_DOT: Record<ProjectStage, string> = {
  concept: 'status-dot--violet',
  design: 'status-dot--amber',
  'in-progress': 'status-dot--amber',
  built: 'status-dot--cyan',
  completed: '',
};

export function ProjectLinkButton({ url, label, kind }: { url: string; label: string; kind: 'github' | 'demo' }) {
  const icon = kind === 'github' ? <GitHubIcon /> : <ExternalLink aria-hidden />;
  if (isConfigured(url)) {
    return (
      <a className="btn btn--ghost btn--sm" href={url} target="_blank" rel="noopener noreferrer">
        {icon} {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <span className="btn btn--ghost btn--sm" aria-disabled="true" title="Not published yet">
      {icon} {label}
      <span className="sr-only"> — not published yet</span>
    </span>
  );
}

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="project-card glow-card"
      aria-labelledby={`project-${project.id}`}
    >
      <button type="button" className="project-card__cover" onClick={() => onOpen(project)} tabIndex={-1} aria-hidden="true">
        <ProjectCover project={project} />
      </button>

      <div className="project-card__body">
        <div className="project-card__meta mono">
          <span className="project-card__code">{project.code}</span>
          <span className="project-card__status">
            <span className={`status-dot ${STAGE_DOT[project.status.stage]}`} aria-hidden="true" />
            {project.status.label}
          </span>
        </div>

        <p className="project-card__category mono">{project.categoryLabel}</p>
        <h3 id={`project-${project.id}`} className="project-card__title">
          {project.title}
        </h3>
        <p className="project-card__summary">{project.summary}</p>

        <ul className="project-card__tech" aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="chip chip--accent">
              {t}
            </li>
          ))}
        </ul>

        <div className="project-card__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => onOpen(project)}>
            View Details <ArrowUpRight aria-hidden />
            <span className="sr-only"> about {project.title}</span>
          </button>
          <ProjectLinkButton url={project.links.github.url} label={project.links.github.label} kind="github" />
          <ProjectLinkButton url={project.links.demo.url} label={project.links.demo.label} kind="demo" />
        </div>
      </div>
    </motion.article>
  );
}
