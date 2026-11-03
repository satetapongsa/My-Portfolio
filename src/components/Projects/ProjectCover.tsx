import type { Project } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';

/**
 * Real screenshot (WebP, 720 / 1440 px via srcset) when the project has one;
 * otherwise a restrained text fallback built from the project's real name and
 * stack — never a stand-in image.
 */
export function ProjectCover({ project, priority = false, sizes }: { project: Project; priority?: boolean; sizes?: string }) {
  const { t } = useI18n();
  const { cover } = project;

  if (cover) {
    return (
      <div className="cover cover--image">
        <img
          src={cover.thumb}
          srcSet={`${cover.thumb} 720w, ${cover.src} 1440w`}
          sizes={sizes ?? '(max-width: 560px) 100vw, (max-width: 1100px) 50vw, 560px'}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
        <span className="cover__label mono">{t.projects.liveScreenshot}</span>
      </div>
    );
  }

  return (
    <div className="cover cover--fallback" role="img" aria-label={`${project.title} — ${t.projects.noPreview}`}>
      <span className="cover__fallback-code mono" aria-hidden="true">
        {project.code} · {project.repo}
      </span>
      <span className="cover__fallback-title" aria-hidden="true">
        {project.title}
      </span>
      {project.subtitle && (
        <span className="cover__fallback-sub" aria-hidden="true">
          {project.subtitle}
        </span>
      )}
      <span className="cover__fallback-tech mono" aria-hidden="true">
        {project.tech.slice(0, 4).join('  ·  ')}
      </span>
      <span className="cover__label mono">{t.projects.noPreview}</span>
    </div>
  );
}
