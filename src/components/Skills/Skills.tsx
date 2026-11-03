import { Box, BrainCircuit, Code2, Cpu, Database, LayoutTemplate, Server, Wrench, type LucideIcon } from 'lucide-react';
import { skillCategories, visibleSkills } from '../../data/skills';
import type { ProficiencyLevel, SkillCategoryIcon } from '../../data/types';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import './skills.css';

const ICONS: Record<SkillCategoryIcon, LucideIcon> = {
  code: Code2,
  layout: LayoutTemplate,
  server: Server,
  database: Database,
  tools: Wrench,
  automation: Cpu,
  cube: Box,
  foundations: BrainCircuit,
};

/** Ordinal scale only — a label plus 1–4 signal bars, never a percentage. */
const LEVELS: ProficiencyLevel[] = ['Exploring', 'Learning', 'Familiar With', 'Working Knowledge'];

function SignalBars({ level }: { level: ProficiencyLevel }) {
  const strength = LEVELS.indexOf(level) + 1;
  return (
    <span className="signal-bars" aria-hidden="true">
      {LEVELS.map((_, i) => (
        <i key={i} className={i < strength ? 'is-on' : ''} />
      ))}
    </span>
  );
}

export function Skills() {
  const active = skillCategories.filter((c) => visibleSkills(c).length > 0);
  const pending = skillCategories.filter((c) => visibleSkills(c).length === 0);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader
          id="skills-title"
          index="02"
          label="Skills & Technologies"
          title="The toolkit, honestly labelled."
          lead="Grouped by discipline. Proficiency is described in words, never invented percentages — skills tagged résumé are the ones listed on my CV."
        />

        <Reveal className="skills__legend mono" y={12}>
          <span className="skills__legend-title">Proficiency</span>
          {LEVELS.map((level) => (
            <span key={level} className="skills__legend-item">
              <SignalBars level={level} /> {level}
            </span>
          ))}
          <span className="skills__legend-item">
            <span className="skill-item__source">résumé</span> listed on my CV
          </span>
        </Reveal>

        <div className="skills__grid">
          {active.map((category, i) => {
            const Icon = ICONS[category.icon];
            return (
              <Reveal key={category.id} delay={i * 0.08} className="skill-card glow-card">
                <article aria-labelledby={`skill-${category.id}`}>
                  <header className="skill-card__head">
                    <span className="skill-card__icon">
                      <Icon aria-hidden />
                    </span>
                    <span className="skill-card__count mono">
                      {String(visibleSkills(category).length).padStart(2, '0')} entries
                    </span>
                  </header>
                  <h3 id={`skill-${category.id}`}>{category.title}</h3>
                  <p className="skill-card__desc">{category.description}</p>
                  <ul className="skill-card__list">
                    {visibleSkills(category).map((skill) => (
                      <li key={skill.name} className="skill-item">
                        <span className="skill-item__name">{skill.name}</span>
                        <span className="skill-item__level mono">
                          {skill.level ? (
                            <>
                              <SignalBars level={skill.level} />
                              {skill.level}
                            </>
                          ) : (
                            <span className="skill-item__source" title="Listed on my résumé">résumé</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>

        {pending.length > 0 && (
          <Reveal className="skills__pending" y={16}>
            <p className="skills__pending-label mono">
              <span className="status-dot status-dot--amber" aria-hidden="true" /> Awaiting entries
            </p>
            <ul className="skills__pending-list">
              {pending.map((category) => {
                const Icon = ICONS[category.icon];
                return (
                  <li key={category.id} className="pending-chip">
                    <Icon aria-hidden />
                    <span>{category.title}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
