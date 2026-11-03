import { Box, BrainCircuit, Code2, Cpu, Database, LayoutTemplate, Server, Wrench, type LucideIcon } from 'lucide-react';
import { visibleSkills } from '../../data/skills';
import type { ProficiencyLevel, SkillCategoryIcon } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
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
  const { t, content } = useI18n();
  const s = t.skills;
  const categories = content.skillCategories;
  const active = categories.filter((c) => visibleSkills(c).length > 0);
  const pending = categories.filter((c) => visibleSkills(c).length === 0);

  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader id="skills-title" index="02" label={s.label} title={s.title} lead={s.lead} />

        <Reveal className="skills__legend mono" y={12}>
          <span className="skills__legend-title">{s.proficiency}</span>
          {LEVELS.map((level) => (
            <span key={level} className="skills__legend-item">
              <SignalBars level={level} /> {s.levels[level]}
            </span>
          ))}
          <span className="skills__legend-item">
            <span className="skill-item__source">{s.resumeTag}</span> {s.resumeLegend}
          </span>
        </Reveal>

        <div className="skills__grid">
          {active.map((category, i) => {
            const Icon = ICONS[category.icon];
            return (
              <Reveal key={category.id} delay={(i % 2) * 0.08} className="skill-card glow-card">
                <article aria-labelledby={`skill-${category.id}`}>
                  <header className="skill-card__head">
                    <span className="skill-card__icon">
                      <Icon aria-hidden />
                    </span>
                    <span className="skill-card__count mono">
                      {String(visibleSkills(category).length).padStart(2, '0')} {s.entries}
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
                              {s.levels[skill.level]}
                            </>
                          ) : (
                            <span className="skill-item__source" title={s.resumeTitle}>
                              {s.resumeTag}
                            </span>
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
              <span className="status-dot status-dot--amber" aria-hidden="true" /> {s.awaiting}
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
