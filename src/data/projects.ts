/**
 * Projects. To add one, append an object to `projects`.
 * - Real screenshots: drop files in /public/projects/ and reference them as
 *   '/projects/my-shot.png' in `cover.src` or `details.screenshots`.
 * - Links: leave `url: ''` until a repo/demo is actually public.
 * - `onRawPage: true` lists the project on the unstyled intro page as well.
 * PRJ-03…05 are described from the résumé recovered from the original portfolio.
 */
import type { Project, ProjectFilter } from './types';

export const projectFilters: { id: ProjectFilter | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'web', label: 'Web Development' },
  { id: 'automation', label: 'Automation' },
  { id: 'interactive', label: '3D / Interactive' },
  { id: 'other', label: 'Other' },
];

export const projects: Project[] = [
  {
    id: 'liquid-mixing',
    code: 'PRJ-01',
    onRawPage: true,
    title: 'Automatic Liquid Mixing & Tank Control System',
    summary:
      'An industrial process simulation concept involving automatic and manual operating modes, alarm management, process trends, and historical data.',
    filter: 'automation',
    categoryLabel: 'Industrial Automation / PLC',
    tech: ['PLC', 'HMI', 'WECON PI Studio'],
    status: { label: 'System Design / In Progress', stage: 'in-progress' },
    cover: {
      src: '',
      alt: 'Automatic liquid mixing and tank control system',
      placeholder: 'tank-system',
    },
    links: {
      github: { url: '', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'A control system concept for an automated liquid mixing process. It pairs PLC control logic with an HMI built in WECON PI Studio so an operator can monitor tanks, switch between operating modes and respond to alarms.',
      objective:
        'Design a realistic simulation of an industrial mixing process that demonstrates structured control logic, safe operator interaction and clear process visibility.',
      architecture: [
        { name: 'Process I/O', detail: 'Tank level, valve and pump signals for the mixing process.' },
        { name: 'PLC Logic', detail: 'Sequencing for Auto mode, manual overrides and alarm conditions.' },
        { name: 'HMI — WECON PI Studio', detail: 'Operator screens for control, alarms, trends and history.' },
        { name: 'Data & History', detail: 'Process trends and historical records for review.' },
      ],
      features: [
        'Auto and Manual operating modes',
        'Alarm management',
        'Real-time process trends',
        'Historical data visualization',
      ],
      screenshots: [],
      process: [
        'Define the mixing process and its operating sequence',
        'Design control logic for Auto and Manual modes',
        'Build HMI screens in WECON PI Studio',
        'Add alarms, trends and history views',
        'Test and refine the full sequence',
      ],
      challenges: [
        {
          challenge: 'Switching safely between Auto and Manual modes.',
          approach: 'Treat mode changes as explicit states in the control logic so outputs never conflict.',
        },
        {
          challenge: 'Making alarms meaningful instead of noisy.',
          approach: 'Plan clear alarm conditions and acknowledgement flow on the HMI.',
        },
      ],
    },
  },
  {
    id: 'ue5-penthouse',
    code: 'PRJ-02',
    onRawPage: true,
    title: 'Unreal Engine 5 Penthouse Viewer',
    summary:
      'An interactive 3D architectural visualization concept designed to let visitors explore a realistic penthouse environment from a first-person perspective.',
    filter: 'interactive',
    categoryLabel: '3D Interactive Experience',
    tech: ['Unreal Engine 5', '3D Visualization', 'Interactive Environment'],
    status: { label: 'Concept / In Progress', stage: 'concept' },
    cover: {
      src: '',
      alt: 'Unreal Engine 5 penthouse interior viewer',
      placeholder: 'penthouse',
    },
    links: {
      github: { url: '', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'A real-time interior visualization of a penthouse built in Unreal Engine 5. Visitors move through the space in first person to get a realistic sense of layout, materials and light.',
      objective:
        'Create an explorable, realistic interior environment — and, in the long term, make it accessible in a web browser through streaming technology.',
      architecture: [
        { name: 'Environment', detail: 'Penthouse interior scene, materials and lighting in UE5.' },
        { name: 'Interaction', detail: 'First-person navigation through the space.' },
        { name: 'Rendering', detail: 'Real-time rendering inside Unreal Engine 5.' },
        { name: 'Delivery (planned)', detail: 'Web-based streaming so the experience runs in a browser.' },
      ],
      features: [
        'First-person exploration',
        'Realistic interior environment',
        'Real-time 3D visualization',
        'Planned web-based streaming delivery',
      ],
      screenshots: [],
      process: [
        'Plan the interior layout and scope',
        'Build the environment in Unreal Engine 5',
        'Add first-person navigation',
        'Refine lighting and materials',
        'Research web-based streaming delivery',
      ],
      challenges: [
        {
          challenge: 'Balancing visual realism with real-time performance.',
          approach: 'Iterate on lighting and asset detail while profiling the scene.',
        },
        {
          challenge: 'Bringing a UE5 experience to the web.',
          approach: 'Investigate streaming-based delivery as a later project phase.',
        },
      ],
    },
  },
  {
    id: 'finguard-ai',
    code: 'PRJ-03',
    title: 'FinGuard AI',
    summary:
      'An autonomous regulatory intelligence and policy-mapping agent for the BFSI sector, automating Bank of Thailand circular parsing, version diffing and internal policy gap analysis.',
    filter: 'web',
    categoryLabel: 'Full-Stack / AI Agent',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'Neon Serverless PostgreSQL (pgvector)'],
    status: { label: 'In Development · 2026 – Present', stage: 'in-progress' },
    cover: { src: '', alt: 'FinGuard AI regulatory intelligence agent', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/Finguard-Ai', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'FinGuard AI is a multi-agent regulatory workflow for banking, financial services and insurance. It parses Bank of Thailand (BOT) circulars, tracks how regulations change between versions and maps them against internal policies to surface gaps.',
      objective:
        'Automate regulatory change analysis while keeping a compliance officer in control of every remediation decision, with a verifiable audit trail.',
      architecture: [
        { name: 'Web application', detail: 'Next.js 15 and React 19 interface written in TypeScript.' },
        { name: 'Agent workflow', detail: 'Multi-agent pipeline for circular parsing, version diffing (ADD / MODIFY / DELETE) and policy gap analysis.' },
        { name: 'Governance', detail: 'Human-in-the-loop approval (WAITING_FOR_HUMAN) and server-side RBAC before remediation tickets are dispatched.' },
        { name: 'Data & audit', detail: 'Prisma with Neon serverless PostgreSQL (pgvector) and a SHA-256 tamper-evident audit chain.' },
      ],
      features: [
        'Bank of Thailand circular parsing',
        'Regulation version diffing (ADD / MODIFY / DELETE)',
        'Internal policy gap analysis',
        'Grounded AI reasoning with anti-hallucination guardrails',
        'Human-in-the-loop approval and RBAC',
        'SHA-256 tamper-evident audit chain',
      ],
      screenshots: [],
      process: [],
      challenges: [],
    },
  },
  {
    id: 'modern-catchyspu',
    code: 'PRJ-04',
    title: 'Modern-CatchySPU',
    summary:
      'A smart distributed university registration system with AI-predictive scaling, built on a database sharding architecture to avoid single points of failure.',
    filter: 'web',
    categoryLabel: 'Full-Stack / Distributed Systems',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Supabase (PostgreSQL)', 'Prisma'],
    status: { label: 'Built · 2026', stage: 'built' },
    cover: { src: '', alt: 'Modern-CatchySPU distributed registration system', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/Modern-CatchySPU', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'A high-concurrency university registration platform that spreads load across three independent database node groups, so one failing group does not take the whole system down.',
      objective:
        'Keep course registration available under peak load by combining sharding with predictive, proactive scaling.',
      architecture: [
        { name: 'Web application', detail: 'Next.js 15 and React 19 in TypeScript.' },
        { name: 'Sharded data layer', detail: 'Supabase (PostgreSQL) with Prisma, partitioned across 3 independent node groups.' },
        { name: 'Predictive scaling', detail: 'AI-driven staggered scheduling and an in-engine linear regression model forecasting CPU / memory trends 10 minutes ahead.' },
        { name: 'Monitoring', detail: 'Real-time dashboard with live telemetry, traffic simulation and shard health visualization.' },
      ],
      features: [
        'Database sharding across 3 node groups',
        'AI-driven staggered scheduling',
        'Linear-regression load forecasting',
        'Real-time shard monitoring dashboard',
        'Traffic simulation lab',
      ],
      screenshots: [],
      process: [],
      challenges: [],
    },
  },
  {
    id: 'ai-parcel-damage',
    code: 'PRJ-05',
    title: 'AI Parcel Box Damage Detection System',
    summary:
      'An Edge AI and IoT monitoring dashboard for real-time parcel integrity checks, combining dual-camera machine vision with load-cell weight anomaly detection to drive PASS / REJECT sorting.',
    filter: 'automation',
    categoryLabel: 'Edge AI / IoT Automation',
    tech: ['TypeScript', 'React 19', 'Tailwind CSS v4', 'CiRA CORE Edge AI', 'MQTT', 'SQLite'],
    status: { label: 'Built · 2026', stage: 'built' },
    cover: { src: '', alt: 'AI parcel box damage detection dashboard', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/AI-Parcel-Box-Damage-Detection-System', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'An industrial-style inspection station dashboard: two cameras and a machine-vision model classify box defects, a load cell checks mass, and the system decides whether each parcel passes or is rejected.',
      objective:
        'Automate parcel quality inspection on a sorting line without losing data when the network drops.',
      architecture: [
        { name: 'Edge vision', detail: 'Dual-camera optical inspection with CiRA CORE deep-learning confidence scoring.' },
        { name: 'Decision engine', detail: 'Combines vision confidence with load-cell mass anomaly detection (5% weight tolerance) for deterministic PASS / REJECT.' },
        { name: 'Resilience', detail: 'Store-and-forward queue in local SQLite with MQTT, so no data is lost during network disruptions.' },
        { name: 'Dashboard', detail: 'React 19 + Tailwind CSS v4 dashboard with real-time telemetry, OEE scorecards and pneumatic sorting controls.' },
      ],
      features: [
        'Dual-camera machine-vision defect classification',
        'Load-cell weight anomaly detection',
        'Deterministic PASS / REJECT sorting',
        'Offline store-and-forward with SQLite + MQTT',
        'OEE metrics (Availability, Performance, Quality)',
        'Pneumatic sorting actuator controls',
      ],
      screenshots: [],
      process: [],
      challenges: [],
    },
  },
];
