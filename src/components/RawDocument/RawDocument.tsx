import { getContent } from '../../i18n/content';
import { getStoredLang } from '../../i18n/lang';
import { ui } from '../../i18n/ui';
import type { SectionId } from '../../data/types';
import { isConfigured } from '../../utils/links';

interface RawDocumentProps {
  onNavigate: (target: SectionId | null) => void;
}

/**
 * PHASE 01. A plain personal profile document. Deliberately unstyled: no
 * classes with CSS behind them, no inline styles — just browser defaults in
 * normal top-to-bottom flow. English unless the visitor previously chose Thai.
 * The single `raw-doc` class exists only so the boot stylesheet can glitch it.
 */
export function RawDocument({ onNavigate }: RawDocumentProps) {
  const lang = getStoredLang();
  const { profile, introProjects } = getContent(lang);
  const t = ui[lang].raw;
  const { education } = profile;
  const socials = profile.socials.filter((s) => isConfigured(s.url));
  const sep = lang === 'th' ? ' ' : ', ';

  return (
    <div className="raw-doc">
      <h1>{profile.fullName}</h1>
      <p>
        {t.nickname}: {profile.nickname}
      </p>
      <p>{profile.role}</p>
      <p>
        {education.university}
        {sep}
        {education.campus}
      </p>
      <p>{education.field}</p>
      <p>{profile.tagline}</p>
      <p>{profile.bio}</p>

      <h2>{t.aboutMe}</h2>
      <p>{profile.aboutMe}</p>

      <h2>{t.interests}</h2>
      <ul>
        {profile.interests.map((interest) => (
          <li key={interest}>{interest}</li>
        ))}
      </ul>

      <h2>{t.selected}</h2>
      {introProjects.map((project, i) => (
        <div key={project.title}>
          <h3>
            {t.project} {String(i + 1).padStart(2, '0')}: {project.title}
          </h3>
          <p>
            {t.category}: {project.category}
          </p>
          <p>
            {t.description}: {project.description}
          </p>
          <p>
            {t.status}: {project.status}.
          </p>
        </div>
      ))}

      <h2>{t.online}</h2>
      <ul>
        {socials.map((social) => (
          <li key={social.id}>
            {social.label}:{' '}
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              {social.url}
            </a>
          </li>
        ))}
      </ul>

      <h2>{t.welcome}</h2>
      <p>{t.welcomeText}</p>
      <p>
        <button type="button" onClick={() => onNavigate(null)}>
          {t.explore}
        </button>
      </p>
    </div>
  );
}
