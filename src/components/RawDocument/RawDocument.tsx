import { profile } from '../../data/portfolio';
import { projects } from '../../data/projects';
import type { SectionId } from '../../data/types';
import { configuredSocials } from '../../utils/links';

interface RawDocumentProps {
  onNavigate: (target: SectionId | null) => void;
}

/**
 * PHASE 01. A plain personal profile document. Deliberately unstyled: no
 * classes with CSS behind them, no inline styles — just browser defaults in
 * normal top-to-bottom flow. The single `raw-doc` class exists only so the
 * boot stylesheet (loaded later) can glitch this content.
 */
export function RawDocument({ onNavigate }: RawDocumentProps) {
  const { education } = profile;

  return (
    <div className="raw-doc">
      <h1>{profile.fullName}</h1>
      <p>Nickname: {profile.nickname}</p>
      <p>{profile.role}</p>
      <p>
        {education.university}, {education.campus}
      </p>
      <p>{education.field}</p>
      <p>{profile.tagline}</p>
      <p>{profile.bio}</p>

      <h2>About Me</h2>
      <p>{profile.aboutMe}</p>

      <h2>Technical Interests</h2>
      <ul>
        {profile.interests.map((interest) => (
          <li key={interest}>{interest}</li>
        ))}
      </ul>

      <h2>Selected Projects</h2>
      {projects.filter((p) => p.onRawPage).map((project, i) => (
        <div key={project.id}>
          <h3>
            Project {String(i + 1).padStart(2, '0')}: {project.title}
          </h3>
          <p>Category: {project.categoryLabel}</p>
          <p>Description: {project.summary}</p>
          <p>Status: {project.status.label}.</p>
        </div>
      ))}

      <h2>Find Me Online</h2>
      <ul>
        {configuredSocials().map((social) => (
          <li key={social.id}>
            {social.label}:{' '}
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              {social.url}
            </a>
          </li>
        ))}
      </ul>

      <h2>Welcome to My Digital Space</h2>
      <p>Explore my portfolio to discover my projects, technical interests, and development journey.</p>
      <p>
        <button type="button" onClick={() => onNavigate(null)}>
          Explore My Portfolio
        </button>
      </p>
    </div>
  );
}
