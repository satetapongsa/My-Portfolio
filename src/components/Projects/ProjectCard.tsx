import { motion } from 'motion/react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { Project, ProjectStage } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { isConfigured } from '../../utils/links';
import { GitHubIcon } from '../ui/BrandIcons';
import { ProjectCover } from './ProjectCover';

export const STAGE_DOT: Record<ProjectStage, string> = {
  completed: '',
  'in-progress': 'status-dot--amber',
  experimental: 'status-dot--violet',
  archived: 'status-dot--muted',
};

/** Renders only when the URL is real — no dead or placeholder buttons. */
export function ProjectLinkButton({ url, label, kind }: { url: string; label: string; kind: 'github' | 'demo' }) {
  const { t } = useI18n();
  if (!isConfigured(url)) return null;
  return (
    <a className="btn btn--ghost btn--sm" href={url} target="_blank" rel="noopener noreferrer">
      {kind === 'github' ? <GitHubIcon /> : <ExternalLink aria-hidden />} {label}
      <span className="sr-only"> {t.common.opensInNewTab}</span>
    </a>
  );
}

const MAX_CHIPS = 6;

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  priority?: boolean;
}

export function ProjectCard({ project, onOpen, priority }: ProjectCardProps) {
  const { t } = useI18n();
  const extra = project.tech.length - MAX_CHIPS;
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
        <ProjectCover project={project} priority={priority} />
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
        {project.subtitle && <p className="project-card__subtitle">{project.subtitle}</p>}
        <p className="project-card__summary">{project.summary}</p>

        <ul className="project-card__tech" aria-label={t.projects.technologies}>
          {project.tech.slice(0, MAX_CHIPS).map((tech) => (
            <li key={tech} className="chip chip--accent">
              {tech}
            </li>
          ))}
          {extra > 0 && (
            <li className="chip" title={project.tech.slice(MAX_CHIPS).join(', ')}>
              +{extra} {t.projects.more}
            </li>
          )}
        </ul>

        <div className="project-card__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => onOpen(project)}>
            {t.projects.viewDetails} <ArrowUpRight aria-hidden />
            <span className="sr-only">
              {' '}
              {t.projects.about} {project.title}
            </span>
          </button>
          <ProjectLinkButton url={project.links.github.url} label={t.projects.viewSource} kind="github" />
          <ProjectLinkButton url={project.links.demo.url} label={project.links.demo.label} kind="demo" />
        </div>
      </div>
    </motion.article>
  );
}
