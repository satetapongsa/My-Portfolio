/**
 * Skills. Only confirmed technologies are visible. Entries with
 * `placeholder: true` are kept here as templates and never rendered.
 *
 * Levels: 'Exploring' | 'Learning' | 'Familiar With' | 'Working Knowledge'
 * No percentages, on purpose. Skills taken from the résumé have no `level`
 * (the résumé doesn't state one) and render with a "résumé" tag instead —
 * add an honest `level` to any of them to show signal bars.
 */
import type { Skill, SkillCategory } from './types';

/** Listed under "Technical Skills" in Resume_Satetapong_Sanguansuk.pdf. */
const fromResume = (...names: string[]): Skill[] => names.map((name) => ({ name, source: 'resume' }));

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    icon: 'code',
    description: 'Languages used to write software and logic.',
    skills: fromResume('TypeScript', 'JavaScript (ES6+)'),
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: 'layout',
    description: 'Building interfaces people interact with.',
    skills: fromResume('React.js', 'Next.js (App Router)', 'Tailwind CSS', 'HTML5', 'CSS3'),
  },
  {
    id: 'backend',
    title: 'Backend Development',
    icon: 'server',
    description: 'Services, APIs and application logic.',
    skills: fromResume('Node.js', 'Express.js', 'REST APIs', 'JWT Authentication'),
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: 'database',
    description: 'Storing and modelling data.',
    skills: fromResume('PostgreSQL', 'Prisma ORM', 'Supabase'),
  },
  {
    id: 'tools',
    title: 'Development Tools',
    icon: 'tools',
    description: 'Editors, version control, CI/CD and cloud.',
    skills: fromResume('Git', 'GitHub', 'GitHub Actions (CI/CD)', 'VS Code', 'Postman', 'Vercel', 'AWS (Lambda)'),
  },
  {
    id: 'foundations',
    title: 'Core Foundations',
    icon: 'foundations',
    description: 'Computer science fundamentals behind the code.',
    skills: fromResume('Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'Database Design', 'Clean Code'),
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
