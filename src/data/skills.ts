/**
 * Skills. Only confirmed technologies are visible. Entries with
 * `placeholder: true` are kept here as templates and never rendered —
 * flip the flag (and set an honest `level`) once a skill is real.
 *
 * Levels: 'Exploring' | 'Learning' | 'Familiar With' | 'Working Knowledge'
 * No percentages, on purpose.
 */
import type { SkillCategory } from './types';

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    icon: 'code',
    description: 'Languages used to write software and logic.',
    skills: [
      { name: 'Language name', level: 'Learning', placeholder: true }, // PLACEHOLDER
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: 'layout',
    description: 'Building interfaces people interact with.',
    skills: [
      { name: 'Framework name', level: 'Learning', placeholder: true }, // PLACEHOLDER
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: 'server',
    description: 'Services, APIs and application logic.',
    skills: [
      { name: 'Runtime / framework', level: 'Exploring', placeholder: true }, // PLACEHOLDER
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: 'database',
    description: 'Storing and modelling data.',
    skills: [
      { name: 'Database name', level: 'Exploring', placeholder: true }, // PLACEHOLDER
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    icon: 'tools',
    description: 'Editors, version control and workflow.',
    skills: [
      { name: 'Tool name', level: 'Familiar With', placeholder: true }, // PLACEHOLDER
    ],
  },
  {
    id: 'automation',
    title: 'Industrial Automation',
    icon: 'automation',
    description: 'Control logic and operator interfaces for industrial processes.',
    skills: [
      { name: 'PLC Programming', level: 'Learning' },
      { name: 'HMI Design', level: 'Learning' },
      { name: 'WECON PI Studio', level: 'Learning' },
    ],
  },
  {
    id: 'interactive',
    title: '3D & Interactive Technology',
    icon: 'cube',
    description: 'Real-time 3D environments and interactive experiences.',
    skills: [
      { name: 'Unreal Engine 5', level: 'Learning' },
      { name: '3D Visualization', level: 'Learning' },
    ],
  },
];

/** Skills a visitor should actually see. */
export const visibleSkills = (category: SkillCategory) => category.skills.filter((s) => !s.placeholder);
