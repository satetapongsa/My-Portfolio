import { ImageIcon, X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import type { Project } from '../../data/types';
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
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={project !== null}
      onClose={onClose}
      labelledBy="pd-title"
      describedBy="pd-summary"
      panelClassName="pd"
      initialFocus={closeRef}
    >
      {project && (
        <>
          <header className="pd__head">
            <div className="pd__head-meta mono">
              <span className="pd__code">{project.code}</span>
              <span className="pd__category">{project.categoryLabel}</span>
            </div>
            <button ref={closeRef} type="button" className="icon-btn pd__close" onClick={onClose} aria-label="Close project details">
              <X aria-hidden />
            </button>
          </header>

          <div className="pd__hero">
            <h2 id="pd-title" className="pd__title">
              {project.title}
            </h2>
            <p id="pd-summary" className="pd__summary">
              {project.summary}
            </p>
          </div>

          <div className="pd__cover">
            <ProjectCover project={project} priority />
          </div>

          <div className="pd__layout">
            <div className="pd__main">
              <Block index="01" title="Overview">
                <p>{project.details.overview}</p>
              </Block>

              <Block index="02" title="Problem / Objective">
                <p>{project.details.objective}</p>
              </Block>

              <Block index="03" title="Key Features">
                <ul className="pd-features">
                  {project.details.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </Block>

              <Block index="04" title="Technical Implementation">
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

              <Block index="05" title="Screenshots">
                {project.details.screenshots.length > 0 ? (
                  <div className="pd-shots">
                    {project.details.screenshots.map((shot) => (
                      <figure key={shot.src}>
                        <img src={shot.src} alt={shot.caption} loading="lazy" decoding="async" width={shot.width} height={shot.height} />
                        <figcaption>{shot.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="pd-shots__empty">
                    <ImageIcon aria-hidden />
                    <p>
                      {project.links.github.url
                        ? 'No screenshots published yet — see the source repository for the latest state.'
                        : 'Screenshots will be added as the project develops.'}
                    </p>
                  </div>
                )}
              </Block>

              {/* Only documented sections render; nothing is padded with invented content. */}
              {project.details.process.length > 0 && (
              <Block index="06" title="Development Process">
                <ol className="pd-process">
                  {project.details.process.map((step, i) => (
                    <li key={step}>
                      <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </Block>
              )}

              {project.details.challenges.length > 0 && (
              <Block index={project.details.process.length > 0 ? '07' : '06'} title="Challenges & Solutions">
                <ul className="pd-challenges">
                  {project.details.challenges.map((c) => (
                    <li key={c.challenge}>
                      <p>
                        <span className="pd-challenges__tag mono">challenge</span>
                        {c.challenge}
                      </p>
                      <p>
                        <span className="pd-challenges__tag pd-challenges__tag--approach mono">approach</span>
                        {c.approach}
                      </p>
                    </li>
                  ))}
                </ul>
              </Block>
              )}
            </div>

            <aside className="pd__aside" aria-label="Project facts">
              <div className="pd-fact">
                <p className="pd-fact__label mono">Project Status</p>
                <p className="pd-fact__value pd-fact__status">
                  <span className={`status-dot ${STAGE_DOT[project.status.stage]}`} aria-hidden="true" />
                  {project.status.label}
                </p>
              </div>
              <div className="pd-fact">
                <p className="pd-fact__label mono">Technology Stack</p>
                <ul className="pd-fact__tech">
                  {project.tech.map((t) => (
                    <li key={t} className="chip chip--accent">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pd-fact">
                <p className="pd-fact__label mono">{project.links.github.url ? 'GitHub Source' : 'Source'}</p>
                {project.links.github.url || project.links.demo.url ? (
                  <div className="pd-fact__links">
                    <ProjectLinkButton url={project.links.github.url} label="View Source" kind="github" />
                    {project.links.related?.map((link) => (
                      <ProjectLinkButton key={link.url} url={link.url} label={link.label} kind="github" />
                    ))}
                    <ProjectLinkButton url={project.links.demo.url} label={project.links.demo.label} kind="demo" />
                  </div>
                ) : (
                  <p className="pd-fact__value">No public repository yet — this project is at the concept stage.</p>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </Dialog>
  );
}
