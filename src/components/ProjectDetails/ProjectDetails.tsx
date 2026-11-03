import { ImageIcon, X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import type { Project } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { ProjectCover } from '../Projects/ProjectCover';
import { ProjectLinkButton, STAGE_DOT } from '../Projects/ProjectCard';
import { Dialog } from '../ui/Dialog';
import './project-details.css';

interface ProjectDetailsProps {
  project: Project | null;
  onClose: () => void;
}

function Block({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="pd-block">
      <h3 className="pd-block__title">
        <span className="mono">{index}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ProjectDetails({ project, onClose }: ProjectDetailsProps) {
  const { t } = useI18n();
  const d = t.projectDetails;
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog open={project !== null} onClose={onClose} labelledBy="pd-title" describedBy="pd-summary" panelClassName="pd" initialFocus={closeRef}>
      {project && (
        <>
          <header className="pd__head">
            <div className="pd__head-meta mono">
              <span className="pd__code">{project.code}</span>
              <span className="pd__category">{project.categoryLabel}</span>
            </div>
            <button ref={closeRef} type="button" className="icon-btn pd__close" onClick={onClose} aria-label={d.close}>
              <X aria-hidden />
            </button>
          </header>

          <div className="pd__hero">
            <h2 id="pd-title" className="pd__title">
              {project.title}
            </h2>
            {project.subtitle && <p className="pd__subtitle">{project.subtitle}</p>}
            <p id="pd-summary" className="pd__summary">
              {project.summary}
            </p>
          </div>

          <div className="pd__cover">
            <ProjectCover project={project} priority sizes="(max-width: 1000px) 100vw, 940px" />
          </div>

          <div className="pd__layout">
            <div className="pd__main">
              <Block index="01" title={d.overview}>
                <p>{project.details.overview}</p>
              </Block>

              <Block index="02" title={d.objective}>
                <p>{project.details.objective}</p>
              </Block>

              <Block index="03" title={d.features}>
                <ul className="pd-features">
                  {project.details.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Block>

              <Block index="04" title={d.implementation}>
                <ol className="pd-arch">
                  {project.details.architecture.map((layer, i) => (
                    <li key={layer.name} className="pd-arch__node">
                      <span className="pd-arch__index mono">L{i + 1}</span>
                      <div>
                        <p className="pd-arch__name">{layer.name}</p>
                        <p className="pd-arch__detail">{layer.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Block>

              <Block index="05" title={d.screenshots}>
                {project.details.screenshots.length > 0 ? (
                  <div className="pd-shots">
                    {project.details.screenshots.map((shot) => (
                      <figure key={shot.src}>
                        <a href={shot.src} target="_blank" rel="noopener noreferrer" className="pd-shots__link">
                          <img
                            src={shot.thumb}
                            srcSet={`${shot.thumb} 720w, ${shot.src} 1440w`}
                            sizes="(max-width: 820px) 100vw, 320px"
                            alt={shot.caption}
                            loading="lazy"
                            decoding="async"
                            width={shot.width}
                            height={shot.height}
                          />
                          <span className="sr-only"> {t.common.opensInNewTab}</span>
                        </a>
                        <figcaption>{shot.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="pd-shots__empty">
                    <ImageIcon aria-hidden />
                    <p>{d.noScreenshots}</p>
                  </div>
                )}
              </Block>
            </div>

            <aside className="pd__aside" aria-label={d.facts}>
              <div className="pd-fact">
                <p className="pd-fact__label mono">{d.status}</p>
                <p className="pd-fact__value pd-fact__status">
                  <span className={`status-dot ${STAGE_DOT[project.status.stage]}`} aria-hidden="true" />
                  {project.status.label}
                </p>
              </div>
              <div className="pd-fact">
                <p className="pd-fact__label mono">{d.stack}</p>
                <ul className="pd-fact__tech">
                  {project.tech.map((tech) => (
                    <li key={tech} className="chip chip--accent">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pd-fact">
                <p className="pd-fact__label mono">{d.source}</p>
                <p className="pd-fact__repo mono">github.com/satetapongsa/{project.repo}</p>
                <div className="pd-fact__links">
                  <ProjectLinkButton url={project.links.github.url} label={t.projects.viewSource} kind="github" />
                  {project.links.related?.map((link) => (
                    <ProjectLinkButton key={link.url} url={link.url} label={link.label} kind="github" />
                  ))}
                  <ProjectLinkButton url={project.links.demo.url} label={project.links.demo.label} kind="demo" />
                </div>
              </div>
            </aside>
          </div>
        </>
      )}
    </Dialog>
  );
}
