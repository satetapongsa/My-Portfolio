import { motion, useScroll, useSpring } from 'motion/react';
import { Flag, FolderGit2, GraduationCap, Sparkles, Telescope, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import type { JourneyKind } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import './journey.css';

const ICONS: Record<JourneyKind, LucideIcon> = {
  education: GraduationCap,
  milestone: Flag,
  interest: Telescope,
  project: FolderGit2,
  goal: Sparkles,
};

export function Journey() {
  const { t, content } = useI18n();
  const j = t.journey;
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeader id="journey-title" index="04" label={j.label} title={j.title} lead={j.lead} />

        <div ref={listRef} className="timeline">
          <span className="timeline__track" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ scaleY: fill }} />
          </span>
          <ol className="timeline__list">
            {content.journey.map((entry, i) => {
              const Icon = ICONS[entry.kind];
              return (
                <motion.li
                  key={entry.id}
                  className={`timeline__item ${i % 2 ? 'is-right' : 'is-left'} ${entry.placeholder ? 'is-placeholder' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="timeline__node" aria-hidden="true">
                    <Icon />
                  </span>
                  <div className="timeline__card glow-card">
                    <div className="timeline__meta mono">
                      <span className="timeline__kind">{j.kinds[entry.kind]}</span>
                      {entry.period && <span className="timeline__period">{entry.period}</span>}
                    </div>
                    <h3>{entry.title}</h3>
                    <p>{entry.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
