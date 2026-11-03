/**
 * Development timeline. Newest first. Leave `period: ''` when you don't want a
 * date shown. Entries with `placeholder: true` are rendered with a dashed
 * "to be written" style so they are easy to spot — replace or delete them.
 */
import type { JourneyEntry } from './types';

export const journey: JourneyEntry[] = [
  {
    id: 'goal-streaming',
    kind: 'goal',
    title: 'Bring the UE5 Penthouse Viewer to the web',
    description: 'Deliver the interactive 3D experience in a browser through web-based streaming.',
    period: 'Next',
  },
  {
    id: 'project-penthouse',
    kind: 'project',
    title: 'Unreal Engine 5 Penthouse Viewer',
    description: 'Building an explorable first-person interior visualization in Unreal Engine 5.',
    period: 'In progress',
  },
  {
    id: 'project-tank',
    kind: 'project',
    title: 'Liquid Mixing & Tank Control System',
    description: 'Designing PLC control logic and a WECON PI Studio HMI with alarms, trends and history.',
    period: 'In progress',
  },
  {
    id: 'cert-fortinet',
    kind: 'milestone',
    title: 'Fortinet NSE 3 Certified in Cybersecurity',
    description: 'Certified by the Fortinet Training Institute.',
    period: 'Oct 2026',
  },
  {
    id: 'project-finguard',
    kind: 'project',
    title: 'FinGuard AI',
    description: 'Building an autonomous regulatory intelligence agent with Next.js, Prisma and PostgreSQL (pgvector).',
    period: '2026 – Present',
  },
  {
    id: 'project-fullstack-2026',
    kind: 'project',
    title: 'Modern-CatchySPU & AI Parcel Box Damage Detection',
    description: 'A sharded registration platform with predictive scaling, and an Edge AI parcel inspection dashboard.',
    period: '2026',
  },
  {
    id: 'cert-cyber-2026',
    kind: 'milestone',
    title: 'Cybersecurity training sprint',
    description: 'Completed courses from NCSA (Penetration Test, Cybersecurity Analyst), Palo Alto Networks, OPSWAT and Macquarie University via Coursera.',
    period: 'Mar 2026',
  },
  {
    id: 'interest',
    kind: 'interest',
    title: 'Software, systems & interactive technology',
    description: 'Exploring web applications, system design, automation and real-time 3D.',
    period: '',
  },
  {
    id: 'education',
    kind: 'education',
    title: 'Bachelor of Technology in Computer Engineering — Sripatum University',
    description: 'Studying Computer Engineering at the Bang Khen campus, Bangkok.',
    period: '2023 – 2027 (Expected)',
  },
];
