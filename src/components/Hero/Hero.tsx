import { motion, type Variants } from 'motion/react';
import { ArrowRight, FileDown, Mail } from 'lucide-react';
import type { ReactNode } from 'react';
import { profile } from '../../data/portfolio';
import { getSocial, hasResume, scrollToSection } from '../../utils/links';
import type { TerminalActions } from '../Terminal/commands';
import { Terminal } from '../Terminal/Terminal';
import { GitHubIcon, LinkedInIcon, TikTokIcon } from '../ui/BrandIcons';
import { Magnetic } from '../ui/Magnetic';
import { WaveSignal } from './WaveSignal';
import './hero.css';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Renders the tagline with two nods to the site's concept: "ideas" appears in
 * raw default-browser styling, "digital experiences" in the signal gradient.
 */
function Tagline({ text }: { text: string }): ReactNode {
  return text.split(/(\bideas\b|\bdigital experiences\b)/i).map((part, i) => {
    if (/^ideas$/i.test(part)) return <span key={i} className="hero__raw">{part}</span>;
    if (/^digital experiences$/i.test(part)) return <span key={i} className="gradient-text">{part}</span>;
    return part;
  });
}

function SocialButton({ id, label, icon }: { id: 'github' | 'linkedin' | 'tiktok'; label: string; icon: ReactNode }) {
  const social = getSocial(id);
  if (social) {
    return (
      <a className="icon-btn" href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`}>
        {icon}
      </a>
    );
  }
  return (
    <span className="icon-btn" role="img" aria-disabled="true" aria-label={`${label} — link coming soon`} title={`${label} — link coming soon`}>
      {icon}
    </span>
  );
}

export function Hero({ terminalActions }: { terminalActions: TerminalActions }) {
  // One masked line per word; letter delays continue across lines.
  let letterIndex = 0;
  const lines = profile.fullName.split(' ').map((word) => word.split('').map((char) => ({ char, i: letterIndex++ })));

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <motion.div className="hero__copy" variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="hero__status mono">
            <span className="status-dot" aria-hidden="true" />
            <span>signal stable</span>
            <span className="hero__status-sep" aria-hidden="true">/</span>
            <span className="hero__status-dim">portfolio.v1</span>
          </motion.p>

          <h1 id="hero-title" className="hero__name">
            <motion.span variants={item} className="hero__hello mono">
              // hello, I’m
            </motion.span>
            <span className="sr-only">{profile.fullName}</span>
            {lines.map((letters, lineIndex) => (
              <span key={lineIndex} className="hero__letters" aria-hidden="true">
                {letters.map(({ char, i }) => (
                  <span key={i} className="hero__letter-mask">
                    <motion.span
                      className="hero__letter"
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      transition={{ duration: 0.9, delay: 0.35 + i * 0.035, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {char}
                    </motion.span>
                  </span>
                ))}
                {lineIndex === lines.length - 1 && <span className="hero__caret" />}
              </span>
            ))}
          </h1>

          <motion.p variants={item} className="hero__aka mono">
            <span>aka</span> <b>{profile.nickname}</b>
          </motion.p>

          <motion.p variants={item} className="hero__role">
            {profile.role}
          </motion.p>

          <motion.p variants={item} className="hero__tagline">
            <Tagline text={profile.tagline} />
          </motion.p>

          <motion.p variants={item} className="hero__intro">
            {profile.heroIntro}
          </motion.p>

          <motion.ul variants={item} className="hero__interests" aria-label="Technical interests">
            {profile.interests.map((interest) => (
              <li key={interest} className="chip">
                {interest}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={item} className="hero__cta">
            <Magnetic>
              <a href="#projects" className="btn btn--primary" onClick={(e) => (e.preventDefault(), scrollToSection('projects'))}>
                Explore Projects <ArrowRight aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn--ghost" onClick={(e) => (e.preventDefault(), scrollToSection('contact'))}>
                <Mail aria-hidden /> Contact Me
              </a>
            </Magnetic>
            <div className="hero__socials">
              <SocialButton id="github" label="GitHub" icon={<GitHubIcon />} />
              <SocialButton id="linkedin" label="LinkedIn" icon={<LinkedInIcon />} />
              <SocialButton id="tiktok" label="TikTok" icon={<TikTokIcon />} />
              {hasResume() ? (
                <a className="icon-btn" href={profile.resumePath} download aria-label="Download résumé">
                  <FileDown aria-hidden />
                </a>
              ) : (
                <span className="icon-btn" role="img" aria-disabled="true" aria-label="Résumé — coming soon" title="Résumé — coming soon">
                  <FileDown aria-hidden />
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero__float hero__float--a mono" aria-hidden="true">
            <i /> focus: automation · 3D · web
          </span>
          <span className="hero__float hero__float--b mono" aria-hidden="true">
            {profile.education.university.toLowerCase()}
          </span>
          <span className="hero__float hero__float--c mono" aria-hidden="true">
            ⌁ try: <b>open 1</b>
          </span>
          <Terminal actions={terminalActions} />
        </motion.div>
      </div>

      <WaveSignal />

      <div className="container hero__meta mono" aria-hidden="true">
        <span>
          <b>01</b> {profile.education.field}
        </span>
        <span>
          <b>02</b> {profile.education.university} — {profile.education.campus}
        </span>
        <span className="hero__scroll">
          scroll <i />
        </span>
      </div>
    </section>
  );
}
