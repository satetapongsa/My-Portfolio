/**
 * Projects. To add one, append an object to `projects`.
 *
 * Featured works (featured: true) were selected from github.com/satetapongsa after
 * inspecting each repository's README, manifests and source. Every technology,
 * feature and status below is backed by repository evidence; screenshots were
 * captured from the projects' own live deployments (November 2026).
 *
 * - Images live in /public/assets/projects/<id>/ and are referenced via `asset()`.
 * - Links: leave `url: ''` until a repo/demo is actually public.
 * - `onRawPage: true` lists the project on the unstyled intro page as well.
 */
import { asset } from '../utils/asset';
import type { Project, ProjectFilter } from './types';

export const projectFilters: { id: ProjectFilter | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Data' },
  { id: 'web', label: 'Web Platforms' },
  { id: 'tools', label: 'Developer Tools' },
  { id: 'iot', label: 'IoT & Automation' },
  { id: 'interactive', label: 'Interactive' },
];

const img = (path: string) => asset(`assets/projects/${path}`);

export const projects: Project[] = [
  // ── Featured works (from GitHub) ────────────────────────────────────────────
  {
    id: 'finguard-ai',
    featured: true,
    code: 'PRJ-01',
    title: 'FinGuard AI',
    summary:
      'A multi-agent regulatory intelligence workflow for banking compliance: it detects Bank of Thailand regulation changes, diffs them, maps the impact onto internal policies and holds every remediation for human approval.',
    filter: 'ai',
    categoryLabel: 'AI Agents / FinTech Compliance',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL + pgvector', 'Vercel AI SDK', 'NextAuth', 'Zustand', 'Zod'],
    status: { label: 'In development · live demo on synthetic data', stage: 'in-progress' },
    cover: { src: img('finguard-ai/dashboard.png'), alt: 'FinGuard AI compliance dashboard showing the detect, diff, impact, review and audit workflow', kind: 'screenshot', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/Finguard-Ai', label: 'Source' },
      demo: { url: 'https://finguard-ai-one.vercel.app/dashboard', label: 'Live Demo' },
    },
    details: {
      overview:
        'FinGuard AI models how a bank compliance team reacts to a new regulatory circular. A chain of agents watches for regulation updates, splits them into semantic clauses, classifies what changed, retrieves the affected internal policies and drafts a gap analysis — then stops until a compliance officer approves before any remediation ticket is dispatched. The public demo runs on a clearly labelled synthetic regulatory dataset.',
      objective:
        'Reduce the manual effort of tracking regulatory change in BFSI while keeping a human accountable for every operational action and preserving a verifiable record of each decision.',
      architecture: [
        { name: 'Agent pipeline', detail: 'Watcher, ingestion, diff, gap-analysis, orchestration and dispatcher agents (src/lib/agents) coordinate the Detect → Diff → Impact → Review → Act workflow.' },
        { name: 'Retrieval & AI', detail: 'Clause embeddings stored with pgvector; LLM calls through the Vercel AI SDK with OpenAI-compatible and Google providers, behind prompt-injection guardrails.' },
        { name: 'Governance', detail: 'NextAuth roles plus a WAITING_FOR_HUMAN workflow state: analysis completes automatically, operational action is blocked until an officer approves.' },
        { name: 'Audit & data', detail: 'Prisma schema with 14 models; a SHA-256 hash chain links audit events, with an /api/audit/verify endpoint to check integrity.' },
        { name: 'API surface', detail: '11 Next.js route handlers covering compliance analysis, policies, transactions, audit, stats, health and a scheduled watcher cron.' },
      ],
      features: [
        'Regulation change detection and clause-level diffing (ADD / MODIFY)',
        'Impact mapping from regulatory clauses to internal bank policies',
        'Human-in-the-loop approval before any remediation is dispatched',
        'Tamper-evident SHA-256 audit chain with a verify endpoint',
        'Role-based access with NextAuth',
        'Agent activity log and compliance-gap review dashboard',
      ],
      screenshots: [{ src: img('finguard-ai/dashboard.png'), caption: 'Live demo — compliance overview with the five-stage agent workflow', width: 1440, height: 900 }],
      process: [],
      challenges: [],
    },
  },
  {
    id: 'wavy-ide',
    featured: true,
    code: 'PRJ-02',
    title: 'WAVY IDE',
    summary:
      'A browser-based development environment with a Monaco editor, an IndexedDB virtual file system, an xterm.js terminal, in-browser JSX/TSX transpilation with live preview, and an AI coding agent whose edits are reviewed in a diff view.',
    filter: 'tools',
    categoryLabel: 'Developer Tools / Web IDE',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Monaco Editor', 'xterm.js', 'IndexedDB (idb-keyval)', 'Sucrase', 'Zustand', 'Vitest'],
    status: { label: 'Experimental · v0.1.0 · live demo', stage: 'experimental' },
    cover: { src: img('wavy-ide/workspace.png'), alt: 'WAVY IDE workspace with file explorer, editor tabs and the integrated terminal', kind: 'screenshot', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/WAVY_IDE', label: 'Source' },
      demo: { url: 'https://wavy-ide-beige.vercel.app', label: 'Live Demo' },
    },
    details: {
      overview:
        'WAVY IDE explores how much of a desktop editor workflow can run inside a browser tab. Projects live in a client-side virtual file system that persists across sessions, code is edited in Monaco, transpiled in the browser and rendered in a sandboxed preview, and an AI agent can read and write workspace files — with changes surfaced in a side-by-side diff before they are applied.',
      objective:
        'Remove local toolchain setup from quick prototyping by putting the editor, terminal, runtime and an AI assistant in a single browser surface.',
      architecture: [
        { name: 'Editor', detail: 'Monaco editor with multi-tab editing and a DiffEditorModal for reviewing AI-generated changes.' },
        { name: 'Workspace storage', detail: 'Virtual file system modules (src/lib/filesystem) persisted to IndexedDB via idb-keyval.' },
        { name: 'Runtime', detail: 'A runtime adapter transpiles JSX/TSX with Sucrase and renders the result in a sandboxed preview.' },
        { name: 'Terminal', detail: 'xterm.js terminal panel with fit and web-links add-ons.' },
        { name: 'AI layer', detail: 'Next.js API routes for chat, streaming, completion, an agent endpoint and a connection test; state managed with Zustand stores.' },
        { name: 'Tests', detail: 'Six Vitest suites covering the agent, AI provider, IDE state, persistence, runtime and workflow.' },
      ],
      features: [
        'Monaco-based multi-tab editor',
        'Persistent virtual workspace in IndexedDB',
        'In-browser JSX/TSX transpilation with live preview',
        'Integrated xterm.js terminal',
        'AI coding agent with diff review before changes are applied',
        'Automated tests with Vitest',
      ],
      screenshots: [{ src: img('wavy-ide/workspace.png'), caption: 'Live demo — empty workspace, editor tabs and integrated terminal', width: 1440, height: 900 }],
      process: [],
      challenges: [],
    },
  },
  {
    id: 'parcel-damage-detection',
    featured: true,
    code: 'PRJ-03',
    title: 'AI Parcel Damage Detection System',
    summary:
      'An end-to-end inspection line that sorts damaged parcels before shipping: cameras and a YOLOv11n model classify boxes, an ESP32 drives sensors and a pusher, and an offline-capable edge gateway syncs results to a cloud API and dashboards.',
    filter: 'iot',
    categoryLabel: 'Edge AI / IoT / Embedded',
    tech: ['Python', 'YOLOv11n', 'OpenCV', 'CiRA CORE', 'ESP32 (Arduino)', 'MQTT (Aedes)', 'Node.js / Express', 'SQLite', 'Neon Postgres', 'React 19', 'Vite'],
    status: { label: 'In progress · dashboards live in demo mode', stage: 'in-progress' },
    cover: { src: img('parcel-damage-detection/inspector-dashboard.png'), alt: 'AI Parcel Damage Inspector dashboard with pass/reject counts, hourly volume chart and station status', kind: 'screenshot', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/parcel-damage-detection', label: 'Source' },
      demo: { url: 'https://parcel-damage-detection.vercel.app', label: 'Live Demo' },
      related: [{ url: 'https://github.com/satetapongsa/AI-Parcel-Box-Damage-Detection-System', label: 'Conveyor dashboard repo' }],
    },
    details: {
      overview:
        'Boxes ride a conveyor past an IR trigger and two cameras. A YOLOv11n model (normal / damaged) plus OpenCV checks for wet or deformed boxes produce a verdict; an ESP32 controller reads a load cell and drives the servo pusher, tower light and buzzer. An edge gateway makes the final PASS / REJECT decision, keeps working without internet and forwards records to a cloud API. A hardware simulator lets the whole pipeline run without the physical rig.',
      objective:
        'Catch dents, tears, deformation and water damage before parcels enter the delivery network, with a line that keeps sorting safely even when the network or the AI is unavailable.',
      architecture: [
        { name: 'Vision', detail: 'Python scripts for CiRA CORE and a stand-alone YOLOv11n detector with OpenCV condition checks (cira/).' },
        { name: 'Embedded control', detail: 'ESP32 firmware for the IR sensor, load cell, servo pusher, tower light, buzzer and conveyor (firmware/).' },
        { name: 'Edge gateway', detail: 'Node.js decision engine with fail-safe actions on AI timeout or vision fault, local SQLite (node:sqlite) and store-and-forward sync; MQTT via an embedded Aedes broker.' },
        { name: 'Cloud & dashboards', detail: 'Express cloud API on Neon Postgres, a web dashboard, and a separate React 19 + Vite conveyor dashboard.' },
        { name: 'Verification', detail: 'Automated tests for the decision logic, offline fail-safe behaviour and Postgres storage, plus a camera/AI/ESP32 simulator.' },
      ],
      features: [
        'Damage classes: dent, tear, deformation and wet — normal boxes pass',
        'Dual-camera capture triggered by an IR beam',
        'Fail-safe decisions when the AI times out or vision faults',
        'Offline store-and-forward with local SQLite',
        'Live monitoring dashboards with pass / reject analytics',
        'Full hardware simulator for demos without the rig',
      ],
      screenshots: [
        { src: img('parcel-damage-detection/inspector-dashboard.png'), caption: 'Inspector dashboard (demo mode — simulated station data)', width: 1440, height: 900 },
        { src: img('parcel-damage-detection/conveyor-hub.png'), caption: 'Conveyor inspection hub from the companion dashboard repository', width: 1440, height: 900 },
      ],
      process: [],
      challenges: [],
    },
  },
  {
    id: 'mirrix',
    featured: true,
    code: 'PRJ-04',
    title: 'MIRRIX — Real-World Intelligence',
    summary:
      'A geospatial situational-awareness dashboard for Bangkok that layers incidents, traffic cameras, flood zones and critical services on a MapLibre map, backed by an ingestion pipeline with geocoding, deduplication and data-age tracking.',
    filter: 'web',
    categoryLabel: 'Geospatial / Real-Time Dashboard',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'MapLibre GL', 'Turf.js', 'WebSocket (ws)'],
    status: { label: 'Experimental prototype · seeded sample data', stage: 'experimental' },
    cover: { src: img('mirrix/artwork.jpg'), alt: 'MIRRIX project artwork — a holographic globe with the title Real-World Intelligence', kind: 'artwork', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/alertbkk-map', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'MIRRIX ("mirror + matrix") is a tactical map interface for answering what is happening, where, how recent it is and which public sensors and services are nearby. The current prototype runs on an in-memory spatial database seeded with Bangkok sample data; the ingestion modules are structured so public data adapters can be plugged in later.',
      objective:
        'Bring scattered public-safety signals — incidents, cameras, flood information and emergency services — into one map-centric view with clear provenance and data freshness.',
      architecture: [
        { name: 'Map client', detail: 'MapLibre GL map with 2D / 3D views, panels and a heads-up display (src/components).' },
        { name: 'Ingestion pipeline', detail: 'Source registry, bilingual normalizer, geocoding, spatial-temporal deduplication, data-age, provenance and health-monitor modules (src/lib/ingestion).' },
        { name: 'Spatial queries', detail: 'Radius and bounding-box area scans implemented in TypeScript with Turf.js over an in-memory store.' },
        { name: 'API & realtime', detail: '12 Next.js route handlers (incidents, cameras, POIs, search, sources, analytics) and a ws-based WebSocket event bus.' },
      ],
      features: [
        'Incident, camera, flood-zone and point-of-interest layers',
        'Radial area scanner around any map point',
        'Spatial and temporal duplicate merging',
        'Data-age states (live / recent / stale / offline) per source',
        'Source health and provenance tracking',
      ],
      screenshots: [],
      process: [],
      challenges: [],
    },
  },
  {
    id: 'spare-change',
    featured: true,
    code: 'PRJ-05',
    title: 'SPARE CHANGE — Street Life Simulator',
    summary:
      'A narrative browser game about surviving homelessness: every run generates a new life in one of 15 real cities, where daily choices, needs and hundreds of events lead toward a way off the street — or not.',
    filter: 'interactive',
    categoryLabel: 'Interactive / Browser Game',
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Neon Postgres', 'html-to-image'],
    status: { label: 'Completed · playable online (v1.25)', stage: 'completed' },
    cover: { src: img('spare-change/title-screen.png'), alt: 'SPARE CHANGE title screen with pixel-art character under a street lamp', kind: 'screenshot', placeholder: 'generic' },
    links: {
      github: { url: 'https://github.com/satetapongsa/beggarsrole', label: 'Source' },
      demo: { url: 'https://beggarsrole.vercel.app/', label: 'Play Online' },
    },
    details: {
      overview:
        'SPARE CHANGE is a choice-driven life simulation played in Thai with a full English translation. Each day is split into morning, afternoon and night; players pick actions such as begging, busking, day labour or visiting an NGO while managing health, hunger, hope, reputation and police attention. Lives play out across real neighbourhoods with local prices and seasons, and autosave in the browser.',
      objective:
        'Use game systems to build empathy for life on the street, while keeping the design data-driven so content can grow without code changes.',
      architecture: [
        { name: 'Content data', detail: 'JSON data files define 15 cities, 266 events, 36 actions and 40 endings, plus origins, traits and items.' },
        { name: 'Game engine', detail: 'TypeScript simulation of day phases, eight needs, events and endings, with an auto-pilot to skip ahead.' },
        { name: 'Tooling', detail: 'Scripts to validate data, run batch simulations, verify replays and check achievements.' },
        { name: 'Online features', detail: 'Leaderboard and daily challenge backed by Neon Postgres; shareable result cards rendered with html-to-image.' },
        { name: 'Accessibility', detail: 'Keyboard play (1–9, arrow keys) that also works on a Thai keyboard layout; bilingual i18n.' },
      ],
      features: [
        '15 real cities with local currency, seasons and neighbourhoods',
        '266 events and 40 possible endings',
        'Eight interacting survival needs',
        'Daily challenge, leaderboard and achievements',
        'Thai / English with one-click switching',
        'Full keyboard control',
      ],
      screenshots: [{ src: img('spare-change/title-screen.png'), caption: 'Live game — title screen (Thai UI)', width: 1440, height: 900 }],
      process: [],
      challenges: [],
    },
  },

  // ── Concepts in development (no public repository yet) ──────────────────────
  {
    id: 'liquid-mixing',
    code: 'CON-01',
    onRawPage: true,
    title: 'Automatic Liquid Mixing & Tank Control System',
    summary:
      'An industrial process simulation concept involving automatic and manual operating modes, alarm management, process trends, and historical data.',
    filter: 'iot',
    categoryLabel: 'Industrial Automation / PLC',
    tech: ['PLC', 'HMI', 'WECON PI Studio'],
    status: { label: 'System Design / In Progress', stage: 'concept' },
    cover: { src: '', alt: 'Automatic liquid mixing and tank control system', placeholder: 'tank-system' },
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
      features: ['Auto and Manual operating modes', 'Alarm management', 'Real-time process trends', 'Historical data visualization'],
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
    code: 'CON-02',
    onRawPage: true,
    title: 'Unreal Engine 5 Penthouse Viewer',
    summary:
      'An interactive 3D architectural visualization concept designed to let visitors explore a realistic penthouse environment from a first-person perspective.',
    filter: 'interactive',
    categoryLabel: '3D Interactive Experience',
    tech: ['Unreal Engine 5', '3D Visualization', 'Interactive Environment'],
    status: { label: 'Concept / In Progress', stage: 'concept' },
    cover: { src: '', alt: 'Unreal Engine 5 penthouse interior viewer', placeholder: 'penthouse' },
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
      features: ['First-person exploration', 'Realistic interior environment', 'Real-time 3D visualization', 'Planned web-based streaming delivery'],
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
];

export const featuredProjects = projects.filter((p) => p.featured);
export const conceptProjects = projects.filter((p) => !p.featured);

/** Link to every public repository, for the "view all" button. */
export const githubReposUrl = 'https://github.com/satetapongsa?tab=repositories';
