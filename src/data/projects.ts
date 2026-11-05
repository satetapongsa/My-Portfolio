/**
 * Projects — only real repositories from github.com/satetapongsa.
 *
 * Selected after reviewing each repository's README, manifests and source.
 * Names match the README titles; technologies, features and statuses are
 * backed by repository evidence. Screenshots were captured from each
 * project's own live deployment (November 2026) and optimized to WebP by
 * `npm run images`. A project without a real screenshot gets no image.
 *
 * To add a project: put screenshots in /public/assets/projects/<id>/, run
 * `npm run images`, then append an entry here (and its Thai text in
 * src/i18n/content.th.ts).
 */
import { asset } from '../utils/asset';
import type { Project, ProjectFilter, ProjectImage } from './types';

export const projectFilters: { id: ProjectFilter | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Data' },
  { id: 'web', label: 'Web Platforms' },
  { id: 'tools', label: 'Developer Tools' },
  { id: 'iot', label: 'IoT & Automation' },
  { id: 'interactive', label: 'Interactive' },
];

/** A 1440×900 screenshot with its 720 px card thumbnail. */
const shot = (path: string): ProjectImage => ({
  src: asset(`assets/projects/${path}-1440.webp`),
  thumb: asset(`assets/projects/${path}-720.webp`),
  width: 1440,
  height: 900,
});

/** A 640×480 synthetic test image from the parcel repository's datasets/synthetic folder. */
const sample = (name: 'tear' | 'printed'): ProjectImage => {
  const src = asset(`assets/projects/parcel-damage-detection/synthetic-${name}-640.webp`);
  return { src, thumb: src, width: 640, height: 480 };
};

/** Featured projects, strongest first (see `rank`). */
export const projects: Project[] = [
  {
    id: 'finguard-ai',
    rank: 1,
    code: 'PRJ-01',
    title: 'FinGuard AI',
    subtitle: 'Autonomous Regulatory Intelligence & Policy Mapping Agent',
    repo: 'Finguard-Ai',
    team: 'Competition team (3) · Digital Innovation Challenge 2026',
    summary:
      'A multi-agent regulatory intelligence workflow for banking compliance: it detects Bank of Thailand regulation changes, diffs them, maps the impact onto internal policies and holds every remediation for human approval.',
    filter: 'ai',
    categoryLabel: 'AI Agents / FinTech Compliance',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'Prisma', 'PostgreSQL + pgvector', 'Vercel AI SDK', 'NextAuth', 'Zustand', 'Zod'],
    status: { label: 'In development · live demo on synthetic data', stage: 'in-progress' },
    cover: { ...shot('finguard-ai/dashboard'), alt: 'FinGuard AI compliance dashboard showing the detect, diff, impact, review and audit workflow' },
    links: {
      github: { url: 'https://github.com/satetapongsa/Finguard-Ai', label: 'Source' },
      demo: { url: 'https://finguard-ai-one.vercel.app/dashboard', label: 'Live Demo', verifiedOn: '2026-11-04' },
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
      screenshots: [{ ...shot('finguard-ai/dashboard'), caption: 'Live demo — compliance overview with the five-stage agent workflow' }],
    },
  },
  {
    id: 'wavy-ide',
    rank: 2,
    code: 'PRJ-02',
    title: 'WAVY IDE',
    repo: 'WAVY_IDE',
    summary:
      'A browser-based development environment with a Monaco editor, an IndexedDB virtual file system, an xterm.js terminal, in-browser JSX/TSX transpilation with live preview, and an AI coding agent whose edits are reviewed in a diff view.',
    filter: 'tools',
    categoryLabel: 'Developer Tools / Web IDE',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Monaco Editor', 'xterm.js', 'IndexedDB (idb-keyval)', 'Sucrase', 'Zustand', 'Vitest'],
    status: { label: 'Experimental · v0.1.0 · live demo', stage: 'experimental' },
    cover: { ...shot('wavy-ide/workspace'), alt: 'WAVY IDE workspace with file explorer, editor tabs and the integrated terminal' },
    links: {
      github: { url: 'https://github.com/satetapongsa/WAVY_IDE', label: 'Source' },
      demo: { url: 'https://wavy-ide-beige.vercel.app', label: 'Live Demo', verifiedOn: '2026-11-04' },
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
      screenshots: [{ ...shot('wavy-ide/workspace'), caption: 'Live demo — empty workspace, editor tabs and integrated terminal' }],
    },
  },
  {
    id: 'spare-change',
    rank: 3,
    code: 'PRJ-03',
    title: 'SPARE CHANGE',
    subtitle: 'A Street Life Simulator',
    repo: 'beggarsrole',
    summary:
      'A narrative browser game about surviving homelessness: every run generates a new life in one of 15 real cities, where daily choices, needs and hundreds of events lead toward a way off the street — or not.',
    filter: 'interactive',
    categoryLabel: 'Interactive / Browser Game',
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'Neon Postgres', 'html-to-image'],
    status: { label: 'Completed · playable online (v1.25)', stage: 'completed' },
    cover: { ...shot('spare-change/title-screen'), alt: 'SPARE CHANGE title screen with pixel-art character under a street lamp' },
    links: {
      github: { url: 'https://github.com/satetapongsa/beggarsrole', label: 'Source' },
      demo: { url: 'https://beggarsrole.vercel.app/', label: 'Play Online', verifiedOn: '2026-11-04' },
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
      screenshots: [{ ...shot('spare-change/title-screen'), caption: 'Live game — title screen (Thai UI)' }],
    },
  },
  {
    id: 'vision-training-studio',
    rank: 4,
    code: 'PRJ-04',
    title: 'Vision Training Studio',
    subtitle: 'Production Deep Learning System & KDel 4.0 Architecture',
    repo: 'training',
    summary:
      'A full-stack computer-vision training platform: import an image folder, annotate boxes in the browser, train a custom PyTorch object detector (KDel 4.0) or a YOLO / classification model, and watch loss curves stream live over WebSockets.',
    filter: 'ai',
    categoryLabel: 'Computer Vision / ML Platform',
    tech: ['Python', 'PyTorch', 'FastAPI', 'SQLAlchemy', 'WebSockets', 'Ultralytics YOLO', 'OpenCV', 'React 19', 'Vite'],
    status: { label: 'In development · runs locally, no public deployment', stage: 'in-progress' },
    links: {
      github: { url: 'https://github.com/satetapongsa/training', label: 'Source' },
      demo: { url: '', label: 'Live Demo' },
    },
    details: {
      overview:
        'Vision Training Studio covers the whole loop of training an object detector on your own images. Datasets are imported from a local folder, validated, split and augmented; boxes are drawn on an HTML5 canvas annotator and exported as COCO, VOC or YOLO; training runs in a background worker that streams epoch, loss and hardware telemetry to the browser; trained weights are registered, exported and used for single or batch inference. Its own detector, KDel 4.0, is written from scratch in PyTorch.',
      objective:
        'Make detector training transparent end to end — from raw images and annotations to a trained, exportable model — without hiding the network behind a third-party training wrapper.',
      architecture: [
        { name: 'KDel 4.0 model', detail: 'Custom PyTorch detector: convolutional backbone with spatial/channel attention and residual blocks, a PANet neck and a decoupled anchor-free head (app/models/kdel.py).' },
        { name: 'Training', detail: 'Trainer registry with KDel, Ultralytics YOLO and image-classification trainers; AdamW, cosine schedule, mixed precision and checkpointing; jobs run in a background worker.' },
        { name: 'Data pipeline', detail: 'Dataset manager, validator, splitter and augmentor, plus COCO / VOC / YOLO annotation converters.' },
        { name: 'API & telemetry', detail: 'FastAPI routers for projects, datasets, annotations, training, models, inference and system status; SQLAlchemy models; WebSocket event stream.' },
        { name: 'Web studio', detail: 'React 19 + Vite views for datasets, annotation, training (live curves) and inference.' },
      ],
      features: [
        'Local folder import with dataset validation, splitting and augmentation',
        'In-browser bounding-box annotation with COCO / VOC / YOLO export',
        'Custom KDel 4.0 detector plus YOLO and classification trainers',
        'Background training jobs with live WebSocket telemetry',
        'Model registry, export and single / batch inference with visualisation',
      ],
      screenshots: [],
    },
  },
  {
    id: 'parcel-damage-detection',
    rank: 5,
    code: 'PRJ-05',
    title: 'AI Parcel Box Damage Detection System',
    repo: 'parcel-damage-detection',
    team: 'Team project (4) · my role: dashboard & UI',
    summary:
      'An end-to-end inspection line that sorts damaged parcels before shipping: cameras and a pretrained YOLOv11n model classify boxes, an ESP32 drives sensors and a pusher, and an offline-capable edge gateway syncs results to a cloud API and dashboards.',
    filter: 'iot',
    categoryLabel: 'Edge AI / IoT / Embedded',
    tech: ['Python', 'YOLOv11n (pretrained)', 'OpenCV', 'CiRA CORE', 'ESP32 (Arduino)', 'MQTT (Aedes)', 'Node.js / Express', 'SQLite', 'Neon Postgres', 'React 19', 'Vite'],
    status: { label: 'In progress · dashboards live in demo mode', stage: 'in-progress' },
    cover: { ...shot('parcel-damage-detection/inspector-dashboard'), alt: 'AI Parcel Damage Inspector dashboard with pass/reject counts, hourly volume chart and station status' },
    links: {
      github: { url: 'https://github.com/satetapongsa/parcel-damage-detection', label: 'Source' },
      demo: { url: 'https://parcel-damage-detection.vercel.app', label: 'Live Demo', verifiedOn: '2026-11-04' },
      related: [{ url: 'https://github.com/satetapongsa/AI-Parcel-Box-Damage-Detection-System', label: 'Conveyor dashboard repo' }],
    },
    details: {
      overview:
        'Boxes ride a conveyor past an IR trigger and two cameras. A pretrained, third-party YOLOv11n model (normal / damaged) plus OpenCV checks for wet or deformed boxes produce a verdict; an ESP32 controller reads a load cell and drives the servo pusher, tower light and buzzer. An edge gateway makes the final PASS / REJECT decision, keeps working without internet and forwards records to a cloud API. A hardware simulator lets the whole pipeline run without the physical rig.',
      objective:
        'Catch dents, tears, deformation and water damage before parcels enter the delivery network, with a line that keeps sorting safely even when the network or the AI is unavailable.',
      architecture: [
        { name: 'Vision', detail: 'Python scripts for CiRA CORE and a stand-alone YOLOv11n detector with OpenCV condition checks (cira/). The YOLO weights are a third-party pretrained model (cvtechniques/PackageDamage, MIT) bundled in models/ — not trained by the team.' },
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
        { ...shot('parcel-damage-detection/inspector-dashboard'), caption: 'Inspector dashboard (demo mode — simulated station data)' },
        { ...shot('parcel-damage-detection/conveyor-hub'), caption: 'Conveyor inspection hub from the companion dashboard repository' },
        { ...sample('tear'), caption: 'Synthetic “tear” test image generated by the repository’s simulator (not a photograph)' },
        { ...sample('printed'), caption: 'Synthetic printed-graphic box from the false-positive test — must PASS (simulator output)' },
      ],
    },
  },
];

/** Link to every public repository, for the "view all" button. */
export const githubReposUrl = 'https://github.com/satetapongsa?tab=repositories';

/** The project's live demo, only if its production URL has been verified (see ProjectLink.verifiedOn). */
export const verifiedDemo = (project: Project) =>
  project.links.demo.url.trim() && project.links.demo.verifiedOn ? project.links.demo : null;
