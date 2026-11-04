import { motion } from 'motion/react';
import { ArrowUpRight, Eye, ExternalLink, Users } from 'lucide-react';
import { verifiedDemo } from '../../data/projects';
import type { Project, ProjectStage } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { Link } from '../../router/Link';
import { routePaths } from '../../router/router';
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
  /** Opens the in-page quick-view dialog. */
  onQuickView: (project: Project) => void;
  priority?: boolean;
  /** The first-ranked project: a wide card at the top of the grid. */
  featured?: boolean;
}

export function ProjectCard({ project, onQuickView, priority, featured = false }: ProjectCardProps) {
  const { t } = useI18n();
  const extra = project.tech.length - MAX_CHIPS;
  const caseStudy = routePaths.project(project.id);
  const demo = verifiedDemo(project);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`project-card glow-card ${featured ? 'project-card--featured' : ''}`}
      aria-labelledby={`project-${project.id}`}
    >
      <Link to={caseStudy} className="project-card__cover" tabIndex={-1} aria-hidden="true">
        <ProjectCover project={project} priority={priority} sizes={featured ? '(max-width: 960px) 100vw, 640px' : undefined} />
      </Link>

      <div className="project-card__body">
        <div className="project-card__meta mono">
          <span className="project-card__code">
            {project.code}
            {featured && <span className="project-card__flag">{t.projects.flagship}</span>}
          </span>
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
        {project.team && (
          <p className="project-card__team">
            <Users aria-hidden /> {project.team}
          </p>
        )}
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
          <Link to={caseStudy} className="btn btn--primary btn--sm">
            {t.projects.viewCaseStudy} <ArrowUpRight aria-hidden />
            <span className="sr-only">
              {' '}
              {t.projects.about} {project.title}
            </span>
          </Link>
          {demo && (
            <a className="btn btn--ghost btn--sm btn--demo" href={demo.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden /> {demo.label}
              <span className="sr-only">
                {' '}
                {project.title} {t.common.opensInNewTab}
              </span>
            </a>
          )}
          <ProjectLinkButton url={project.links.github.url} label="GitHub" kind="github" />
          <button
            type="button"
            className="icon-btn project-card__quick"
            onClick={() => onQuickView(project)}
            aria-label={`${t.projects.quickView} ${t.projects.about} ${project.title}`}
            title={t.projects.quickView}
          >
            <Eye aria-hidden />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
