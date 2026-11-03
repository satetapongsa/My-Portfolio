import { Compass, FileDown, FileText, GraduationCap, Lightbulb, Target, type LucideIcon } from 'lucide-react';
import type { InfoBlock } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { hasResume, isConfigured } from '../../utils/links';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import './about.css';

const ICONS: Record<InfoBlock['icon'], LucideIcon> = {
  education: GraduationCap,
  interests: Compass,
  focus: Target,
  philosophy: Lightbulb,
};

export function About() {
  const { t, content } = useI18n();
  const { profile } = content;
  const a = t.about;
  const spec: [string, string][] = [
    [a.spec.fullName, profile.fullName],
    [a.spec.nickname, profile.nickname],
    [a.spec.field, profile.education.field],
    [a.spec.university, profile.education.university],
    [a.spec.campus, profile.education.campus],
    [a.spec.role, a.roleValue],
  ];
  if (isConfigured(profile.education.period)) spec.push([a.spec.period, profile.education.period]);
  if (isConfigured(profile.contact.location)) spec.push([a.spec.location, profile.contact.location]);

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <SectionHeader
          id="about-title"
          index="01"
          label={a.label}
          title={
            <>
              {a.titleA} <span className="gradient-text">{a.titleAccent}</span> {a.titleB}
              {t.common.dot}
            </>
          }
        />

        <div className="about__grid">
          <Reveal className="about__bio">
            <p className="about__lead">{profile.bio}</p>
            <p>{profile.aboutMe}</p>
            {hasResume() && (
              <div className="about__resume">
                <a className="btn btn--primary" href={profile.resumePath} target="_blank" rel="noopener noreferrer">
                  <FileText aria-hidden /> {a.viewCv}
                  <span className="sr-only"> {a.pdfNewTab}</span>
                </a>
                <a className="btn btn--ghost" href={profile.resumePath} download="Resume_Satetapong_Sanguansuk.pdf">
                  <FileDown aria-hidden /> {a.downloadResume}
                  <span className="sr-only"> (PDF)</span>
                </a>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1} className="about__spec glow-card brackets">
            <figure className="about__portrait">
              <img
                src={profile.photo.src}
                alt={profile.photo.alt}
                width={profile.photo.width}
                height={profile.photo.height}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="mono">
                <span className="status-dot" aria-hidden="true" /> {profile.fullName} · {profile.nickname}
              </figcaption>
            </figure>
            <div className="about__spec-head mono">
              <span>identity.json</span>
              <span className="about__spec-live">
                <span className="status-dot" aria-hidden="true" /> {a.live}
              </span>
            </div>
            <dl className="about__spec-list mono">
              {spec.map(([key, value]) => (
                <div key={key} className="about__spec-row">
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <ul className="about__blocks">
          {profile.infoBlocks.map((block, i) => {
            const Icon = ICONS[block.icon];
            return (
              <Reveal as="li" key={block.icon} delay={i * 0.08} className="about__block glow-card">
                <div className="about__block-head">
                  <span className="about__block-icon">
                    <Icon aria-hidden />
                  </span>
                  <span className="about__block-index mono">0{i + 1}</span>
                </div>
                <h3>{block.title}</h3>
                <ul>
                  {block.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
