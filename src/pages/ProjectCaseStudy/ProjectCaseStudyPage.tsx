import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, Users } from 'lucide-react';
import { ArchitectureDiagram } from '../../components/ProjectCaseStudy/ArchitectureDiagram';
import { MediaGallery } from '../../components/ProjectCaseStudy/MediaGallery';
import { STAGE_DOT } from '../../components/Projects/ProjectCard';
import { ProjectCover } from '../../components/Projects/ProjectCover';
import { useDocumentMeta } from '../../components/SEO/useDocumentMeta';
import { GitHubIcon } from '../../components/ui/BrandIcons';
import { caseStudies, languageSnapshot, LANGUAGE_SNAPSHOT_DATE } from '../../data/caseStudies';
import { useI18n } from '../../i18n/I18nProvider';
import { Link } from '../../router/Link';
import { routePaths } from '../../router/router';
import { isConfigured } from '../../utils/links';
import { NotFoundPage } from '../NotFound/NotFoundPage';
import { caseStudyStrings } from './strings';
import './case-study.css';

const SECTION_KEYS = ['overview', 'problem', 'architecture', 'implementation', 'features', 'media', 'challenges', 'links'] as const;

const formatDate = (iso: string, lang: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function ProjectCaseStudyPage({ slug }: { slug: string }) {
  const { lang, t, content } = useI18n();
  const s = caseStudyStrings[lang];
  const index = content.projects.findIndex((p) => p.id === slug);
  const project = content.projects[index];
  const study = project ? caseStudies[project.id]?.[lang] : undefined;

  useDocumentMeta({
    title: project ? `${project.title} — ${s.metaSuffix}` : s.notFoundTitle,
    description: project ? project.summary : s.notFoundBody,
    path: routePaths.project(slug),
  });

  if (!project || !study) return <NotFoundPage />;

  const prev = content.projects[(index - 1 + content.projects.length) % content.projects.length];
  const next = content.projects[(index + 1) % content.projects.length];
  const languages = languageSnapshot[project.id] ?? [];
  const hasDemo = isConfigured(project.links.demo.url);
  const sectionId = (key: (typeof SECTION_KEYS)[number]) => `cs-${key}`;
  const num = (key: (typeof SECTION_KEYS)[number]) => String(SECTION_KEYS.indexOf(key) + 1).padStart(2, '0');

  return (
    <article className="case-study" aria-labelledby="cs-title">
      <header className="cs-hero">
        <div className="container">
          <nav className="cs-crumbs mono" aria-label={s.breadcrumb}>
            <ol>
              <li>
                <Link to="/">{s.home}</Link>
              </li>
              <li>
                <Link to="/#projects">{s.projects}</Link>
              </li>
              <li aria-current="page">{project.title}</li>
            </ol>
          </nav>

          <div className="cs-hero__grid">
            <div className="cs-hero__text">
              <p className="cs-hero__eyebrow mono">
                <span>{project.code}</span>
                <span aria-hidden="true">/</span>
                <span>{s.caseStudy}</span>
              </p>
              <h1 id="cs-title" className="cs-hero__title">
                {project.title}
              </h1>
              {project.subtitle && <p className="cs-hero__subtitle">{project.subtitle}</p>}
              <p className="cs-hero__summary">{project.summary}</p>

              <div className="cs-hero__chips">
                <span className="chip">
                  <span className={`status-dot ${STAGE_DOT[project.status.stage]}`} aria-hidden="true" />
                  {project.status.label}
                </span>
                <span className="chip chip--accent">{project.categoryLabel}</span>
              </div>

              {study.role && (
                <div className="cs-role" role="note">
                  <Users aria-hidden />
                  <div>
                    <p className="cs-role__label">{study.role.label}</p>
                    <p className="cs-role__detail">{study.role.detail}</p>
                  </div>
                </div>
              )}

              <div className="cs-hero__actions">
                <a className="btn btn--primary" href={project.links.github.url} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon /> {s.source}
                  <span className="sr-only"> {t.common.opensInNewTab}</span>
                </a>
                {hasDemo && (
                  <a className="btn btn--ghost" href={project.links.demo.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink aria-hidden /> {project.links.demo.label}
                    <span className="sr-only"> {t.common.opensInNewTab}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="cs-hero__media brackets">
              <ProjectCover project={project} priority sizes="(max-width: 960px) calc(100vw - 40px), 560px" />
            </div>
          </div>
        </div>
      </header>

      <div className="container cs-layout">
        <aside className="cs-toc" aria-labelledby="cs-toc-title">
          <p id="cs-toc-title" className="cs-toc__title mono">
            {s.onThisPage}
          </p>
          <ol>
            {SECTION_KEYS.map((key) => (
              <li key={key}>
                <a href={`#${sectionId(key)}`}>
                  <span className="mono">{num(key)}</span> {s.sections[key]}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="cs-body">
          <section id={sectionId('overview')} className="cs-section" aria-labelledby={`${sectionId('overview')}-h`}>
            <SectionTitle n={num('overview')} id={`${sectionId('overview')}-h`} text={s.sections.overview} />
            <p className="cs-lead">{project.details.overview}</p>
            <dl className="cs-facts">
              <div>
                <dt>{s.facts.category}</dt>
                <dd>{project.categoryLabel}</dd>
              </div>
              <div>
                <dt>{s.facts.status}</dt>
                <dd>{project.status.label}</dd>
              </div>
              <div>
                <dt>{s.facts.repo}</dt>
                <dd className="mono">satetapongsa/{project.repo}</dd>
              </div>
              <div className="cs-facts__wide">
                <dt>{s.facts.stack}</dt>
                <dd>
                  <ul className="cs-chips">
                    {project.tech.map((tech) => (
                      <li key={tech} className="chip chip--accent">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              {languages.length > 0 && (
                <div className="cs-facts__wide">
                  <dt>{s.facts.languages}</dt>
                  <dd>
                    <div className="lang-bar" aria-hidden="true">
                      {languages.map((l) => (
                        <span key={l.name} className="lang-bar__seg" data-lang={l.name} style={{ flexGrow: Math.max(l.share, 0.6) }} />
                      ))}
                    </div>
                    <ul className="lang-list">
                      {languages.map((l) => (
                        <li key={l.name}>
                          <span className="lang-dot" data-lang={l.name} aria-hidden="true" />
                          {l.name} <span className="mono">{l.share.toFixed(1)}%</span>
                        </li>
                      ))}
                    </ul>
                    <p className="cs-note">{s.languagesNote.replace('{date}', formatDate(LANGUAGE_SNAPSHOT_DATE, lang))}</p>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section id={sectionId('problem')} className="cs-section" aria-labelledby={`${sectionId('problem')}-h`}>
            <SectionTitle n={num('problem')} id={`${sectionId('problem')}-h`} text={s.sections.problem} />
            <div className="cs-problem">
              <div className="cs-card">
                <h3>{s.problem.problem}</h3>
                <p>{study.problem.problem}</p>
              </div>
              <div className="cs-card">
                <h3>{s.problem.why}</h3>
                <p>{study.problem.why}</p>
              </div>
              <div className="cs-card">
                <h3>{s.problem.outcome}</h3>
                <p>{study.problem.outcome}</p>
              </div>
            </div>
            <blockquote className="cs-objective">
              <p className="mono">{s.problem.objective}</p>
              <p>{project.details.objective}</p>
            </blockquote>
          </section>

          <section id={sectionId('architecture')} className="cs-section" aria-labelledby={`${sectionId('architecture')}-h`}>
            <SectionTitle n={num('architecture')} id={`${sectionId('architecture')}-h`} text={s.sections.architecture} />
            {study.diagrams.map((d) => (
              <ArchitectureDiagram key={d.title} diagram={d} labels={s.diagram} />
            ))}
          </section>

          <section id={sectionId('implementation')} className="cs-section" aria-labelledby={`${sectionId('implementation')}-h`}>
            <SectionTitle n={num('implementation')} id={`${sectionId('implementation')}-h`} text={s.sections.implementation} />
            <div className="cs-impl">
              {study.implementation.map((block) => (
                <div key={block.area} className="cs-card">
                  <h3>{block.area}</h3>
                  <ul className="cs-list">
                    {block.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id={sectionId('features')} className="cs-section" aria-labelledby={`${sectionId('features')}-h`}>
            <SectionTitle n={num('features')} id={`${sectionId('features')}-h`} text={s.sections.features} />
            <div className={`cs-features ${study.planned?.length ? '' : 'cs-features--single'}`}>
              <div className="cs-card">
                <h3>
                  <span className="status-dot" aria-hidden="true" /> {s.completed}
                </h3>
                <ul className="cs-list cs-list--check">
                  {project.details.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              {study.planned && study.planned.length > 0 && (
                <div className="cs-card cs-card--muted">
                  <h3>
                    <span className="status-dot status-dot--amber" aria-hidden="true" /> {s.planned}
                  </h3>
                  <ul className="cs-list">
                    {study.planned.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <p className="cs-note">{s.plannedNote}</p>
                </div>
              )}
            </div>
          </section>

          <section id={sectionId('media')} className="cs-section" aria-labelledby={`${sectionId('media')}-h`}>
            <SectionTitle n={num('media')} id={`${sectionId('media')}-h`} text={s.sections.media} />
            {project.details.screenshots.length > 0 ? (
              <MediaGallery shots={project.details.screenshots} labels={s.gallery} title={project.title} />
            ) : (
              <p className="cs-empty">{s.noMedia}</p>
            )}
          </section>

          <section id={sectionId('challenges')} className="cs-section" aria-labelledby={`${sectionId('challenges')}-h`}>
            <SectionTitle n={num('challenges')} id={`${sectionId('challenges')}-h`} text={s.sections.challenges} />
            <ol className="cs-challenges">
              {study.challenges.map((c, i) => (
                <li key={c.title} className="cs-card">
                  <h3>
                    <span className="mono">{String(i + 1).padStart(2, '0')}</span> {c.title}
                  </h3>
                  <dl>
                    <dt>{s.challenge}</dt>
                    <dd>{c.challenge}</dd>
                    <dt>{s.approach}</dt>
                    <dd>{c.approach}</dd>
                  </dl>
                </li>
              ))}
            </ol>
          </section>

          <section id={sectionId('links')} className="cs-section" aria-labelledby={`${sectionId('links')}-h`}>
            <SectionTitle n={num('links')} id={`${sectionId('links')}-h`} text={s.sections.links} />
            <ul className="cs-links">
              <li>
                <a href={project.links.github.url} target="_blank" rel="noopener noreferrer" className="cs-link">
                  <GitHubIcon />
                  <span>
                    <strong>{s.source}</strong>
                    <span className="mono">github.com/satetapongsa/{project.repo}</span>
                  </span>
                  <span className="sr-only">{t.common.opensInNewTab}</span>
                </a>
              </li>
              {hasDemo && (
                <li>
                  <a href={project.links.demo.url} target="_blank" rel="noopener noreferrer" className="cs-link">
                    <ExternalLink aria-hidden />
                    <span>
                      <strong>{s.demo}</strong>
                      <span className="mono">{project.links.demo.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </span>
                    <span className="sr-only">{t.common.opensInNewTab}</span>
                  </a>
                </li>
              )}
              {project.links.related?.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="cs-link">
                    <GitHubIcon />
                    <span>
                      <strong>{s.related}</strong>
                      <span>{link.label}</span>
                    </span>
                    <span className="sr-only">{t.common.opensInNewTab}</span>
                  </a>
                </li>
              ))}
              {study.docs.map((doc) => (
                <li key={doc.url}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="cs-link">
                    <BookOpen aria-hidden />
                    <span>
                      <strong>{s.documentation}</strong>
                      <span>{doc.label}</span>
                    </span>
                    <span className="sr-only">{t.common.opensInNewTab}</span>
                  </a>
                </li>
              ))}
            </ul>
            {!hasDemo && <p className="cs-note">{s.noDemo}</p>}
            <p className="cs-evidence">
              <span className="mono">{s.evidence}:</span> {study.evidence}
            </p>
          </section>

          <nav className="cs-pager" aria-label={`${s.prev} / ${s.next}`}>
            <Link to={routePaths.project(prev.id)} className="cs-pager__link">
              <ArrowLeft aria-hidden />
              <span>
                <span className="mono">{s.prev}</span>
                <strong>{prev.title}</strong>
              </span>
            </Link>
            <Link to="/#projects" className="btn btn--ghost btn--sm">
              {s.back}
            </Link>
            <Link to={routePaths.project(next.id)} className="cs-pager__link cs-pager__link--next">
              <span>
                <span className="mono">{s.next}</span>
                <strong>{next.title}</strong>
              </span>
              <ArrowRight aria-hidden />
            </Link>
          </nav>
        </div>
      </div>
    </article>
  );
}

function SectionTitle({ n, id, text }: { n: string; id: string; text: string }) {
  return (
    <h2 id={id} className="cs-section__title">
      <span className="mono" aria-hidden="true">
        {n}
      </span>
      {text}
    </h2>
  );
}
