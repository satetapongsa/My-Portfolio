import { motion, useScroll, useSpring } from 'motion/react';
import { Flag, FolderGit2, GraduationCap, Sparkles, Telescope, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { journey } from '../../data/journey';
import type { JourneyKind } from '../../data/types';
import { SectionHeader } from '../ui/SectionHeader';
import './journey.css';

const KIND: Record<JourneyKind, { label: string; icon: LucideIcon }> = {
  education: { label: 'Education', icon: GraduationCap },
  milestone: { label: 'Learning Milestone', icon: Flag },
  interest: { label: 'Technical Interests', icon: Telescope },
  project: { label: 'Personal Project', icon: FolderGit2 },
  goal: { label: 'Future Goal', icon: Sparkles },
};

export function Journey() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <section id="journey" className="section journey" aria-labelledby="journey-title">
      <div className="container">
        <SectionHeader
          id="journey-title"
          index="04"
          label="Development Journey"
          title="Where I’ve been, where I’m heading."
          lead="A running log of education, projects and goals — updated as the story grows."
        />

        <div ref={listRef} className="timeline">
          <span className="timeline__track" aria-hidden="true">
            <motion.span className="timeline__fill" style={{ scaleY: fill }} />
          </span>
          <ol className="timeline__list">
          {journey.map((entry, i) => {
            const { label, icon: Icon } = KIND[entry.kind];
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
                    <span className="timeline__kind">{label}</span>
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
