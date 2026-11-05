/**
 * Engineering case studies for the five projects in src/data/projects.ts.
 *
 * Every statement here is backed by the project's own repository — its
 * README, docs and source as inspected in November 2026. Diagrams only show
 * components and data flows that exist in the code; where a README describes
 * something the source does not implement yet, it is listed under "planned"
 * instead. Projects get as much depth as their evidence supports, no more.
 *
 * Overview, objective, stack and completed features are not repeated here:
 * the case study page reads them from the project entry (and its Thai
 * overrides in src/i18n/content.th.ts).
 */
import type { Lang } from '../i18n/lang';

export type DiagramTone = 'source' | 'process' | 'store' | 'human' | 'output';

export interface DiagramNode {
  label: string;
  detail?: string;
  tone?: DiagramTone;
}

export interface DiagramStage {
  title: string;
  nodes: DiagramNode[];
  /** Label on the connector to the next stage (protocol, trigger…). */
  link?: string;
}

export interface CaseStudyDiagram {
  title: string;
  caption: string;
  stages: DiagramStage[];
  /** Side paths that don't fit the main flow (fallbacks, fail-safes). */
  notes?: string[];
}

export interface CaseStudy {
  /** Set when the project was not built alone. */
  role?: { label: string; detail: string };
  problem: { problem: string; why: string; outcome: string };
  diagrams: CaseStudyDiagram[];
  implementation: { area: string; points: string[] }[];
  /** Work the repository itself lists as in progress or planned. */
  planned?: string[];
  challenges: { title: string; challenge: string; approach: string }[];
  docs: { label: string; url: string }[];
  /** Where the information comes from. */
  evidence: string;
}

/** GitHub language breakdown (bytes of code), snapshot taken 4 Nov 2026. */
export const languageSnapshot: Record<string, { name: string; share: number }[]> = {
  'finguard-ai': [
    { name: 'TypeScript', share: 98.0 },
    { name: 'CSS', share: 2.0 },
  ],
  'wavy-ide': [
    { name: 'TypeScript', share: 99.6 },
    { name: 'CSS', share: 0.2 },
    { name: 'JavaScript', share: 0.2 },
  ],
  'parcel-damage-detection': [
    { name: 'JavaScript', share: 71.4 },
    { name: 'HTML', share: 12.0 },
    { name: 'CSS', share: 7.6 },
    { name: 'Python', share: 5.4 },
    { name: 'C++', share: 3.7 },
  ],
  'vision-training-studio': [
    { name: 'JavaScript', share: 47.4 },
    { name: 'Python', share: 42.1 },
    { name: 'HTML', share: 5.9 },
    { name: 'CSS', share: 4.4 },
  ],
  'spare-change': [
    { name: 'TypeScript', share: 98.9 },
    { name: 'CSS', share: 0.6 },
    { name: 'JavaScript', share: 0.5 },
  ],
};

export const LANGUAGE_SNAPSHOT_DATE = '2026-11-04';

const gh = (repo: string, path = '') => `https://github.com/satetapongsa/${repo}${path}`;

type Studies = Record<string, Record<Lang, CaseStudy>>;

export const caseStudies: Studies = {
  'finguard-ai': {
    en: {
      role: {
        label: 'Competition team project · 3 members',
        detail:
          'Entered in the Digital Innovation Challenge 2026 (BFSI track) as a team of three. The code lives in my GitHub repository; my part, as listed on my résumé, is the multi-step AI workflow, the source-citation guardrails, role-based access with the human-approval step and the hash-chained audit log.',
      },
      problem: {
        problem:
          'When a regulator such as the Bank of Thailand publishes a new circular, a bank’s compliance team has to read it, compare it clause by clause with the previous version and work out which internal policies are affected. It is slow, manual and easy to get wrong.',
        why: 'FinGuard AI was built as a competition project (the repository documents a v1.0.1-competition release) to show that this analysis can be automated without taking the decision away from people.',
        outcome:
          'Agents complete the reading, diffing and impact analysis on their own, then stop at a WAITING_FOR_HUMAN state. Only after a compliance officer approves is a remediation ticket dispatched, and every step is sealed into a tamper-evident audit chain.',
      },
      diagrams: [
        {
          title: 'Regulatory workflow',
          caption: 'The agent pipeline documented in the README and implemented under src/lib/agents.',
          stages: [
            {
              title: 'Source',
              nodes: [
                { label: 'Bank of Thailand circulars', detail: 'Official adapter (bot.or.th)', tone: 'source' },
                { label: 'Synthetic demo dataset', detail: 'Labelled SYNTHETIC_DEMO', tone: 'source' },
              ],
              link: 'safe server-side polling',
            },
            {
              title: 'Detect & ingest',
              nodes: [
                { label: 'Watcher agent', detail: 'SSRF guard · SHA-256 fingerprint', tone: 'process' },
                { label: 'Ingestion agent', detail: 'Bilingual parser · clause splitting', tone: 'process' },
              ],
            },
            {
              title: 'Analyse',
              nodes: [
                { label: 'Diff agent', detail: 'ADD · MODIFY · DELETE · UNCHANGED', tone: 'process' },
                { label: 'Policy retrieval', detail: 'pgvector semantic + lexical', tone: 'store' },
                { label: 'Gap analysis agent', detail: 'Evidence triad · risk classifier', tone: 'process' },
              ],
              link: 'WAITING_FOR_HUMAN',
            },
            {
              title: 'Decide',
              nodes: [{ label: 'Compliance officer review', detail: 'RBAC: officer approves, auditor read-only', tone: 'human' }],
              link: 'approved',
            },
            {
              title: 'Act & record',
              nodes: [
                { label: 'Dispatcher agent', detail: 'Idempotent ticket CMP-2026-XXXX', tone: 'output' },
                { label: 'Audit chain', detail: 'SHA-256 hash-linked events · /api/audit/verify', tone: 'store' },
              ],
            },
          ],
          notes: ['If the evidence is incomplete, gap analysis returns INSUFFICIENT_EVIDENCE instead of guessing.'],
        },
      ],
      implementation: [
        {
          area: 'Application',
          points: [
            'Next.js 15 App Router with pages for the dashboard, agent activity, regulations, gap analysis, compliance, audit and two banking-operations demos (teller, reconciliation).',
            'Server actions for approvals, compliance runs, regulations and transactions; 11 route handlers including a scheduled watcher cron and an audit verifier.',
          ],
        },
        {
          area: 'Data',
          points: [
            'Prisma schema with 14 models on Neon PostgreSQL; clause embeddings stored with pgvector.',
            'A seed script resets a clean demo state (npm run demo:reset).',
          ],
        },
        {
          area: 'AI',
          points: [
            'Vercel AI SDK with OpenAI-compatible and Google providers.',
            'Three documented operating modes: fully offline deterministic, live Bank of Thailand + LLM, and hybrid.',
          ],
        },
        {
          area: 'Security & governance',
          points: [
            'NextAuth with server-side roles (COMPLIANCE_OFFICER, AUDITOR, admin) enforced in middleware.',
            'SSRF guard, prompt-injection guardrails and a SHA-256 audit logger under src/lib/security.',
          ],
        },
        {
          area: 'Testing',
          points: ['Test suites for the agents, the guardrails and an evaluation benchmark (tests/).'],
        },
      ],
      challenges: [
        {
          title: 'An AI must not invent compliance findings',
          challenge: 'A language model asked about incomplete context will still produce a confident answer — unacceptable for regulatory work.',
          approach:
            'Gap analysis is grounded in an “evidence triad” of regulation clause, policy text and reasoning, and returns INSUFFICIENT_EVIDENCE when the evidence is missing (grounded-reasoning.ts).',
        },
        {
          title: 'Fetching regulator pages safely',
          challenge: 'A server that fetches URLs on a schedule can be abused to reach internal addresses (SSRF).',
          approach: 'The watcher only polls an allow-listed set of official Bank of Thailand domains, enforced by ssrf-guard.ts.',
        },
        {
          title: 'Instructions hidden inside documents',
          challenge: 'Regulation or policy text could contain text that tries to steer the model.',
          approach: 'Inputs pass through guardrails.ts before reaching the model, and a dedicated test suite covers adversarial injection cases.',
        },
        {
          title: 'A demo that cannot fail on stage',
          challenge: 'A live presentation should not depend on external APIs or network access.',
          approach:
            'A deterministic offline mode runs on synthetic fixtures with no keys, and provenance labels (OFFICIAL_BOT vs SYNTHETIC_DEMO) keep demo data clearly marked.',
        },
      ],
      docs: [
        { label: 'Architecture', url: gh('Finguard-Ai', '/blob/main/docs/ARCHITECTURE.md') },
        { label: 'Security & threat model', url: gh('Finguard-Ai', '/blob/main/docs/SECURITY.md') },
        { label: 'Deployment', url: gh('Finguard-Ai', '/blob/main/docs/DEPLOYMENT.md') },
      ],
      evidence: 'Based on the Finguard-Ai README, docs/ and source (src/lib/agents, src/lib/security, prisma/schema.prisma).',
    },
    th: {
      role: {
        label: 'โปรเจกต์ทีมแข่งขัน · 3 คน',
        detail:
          'ส่งเข้าแข่งขัน Digital Innovation Challenge 2026 (สาย BFSI) ในทีม 3 คน โค้ดอยู่ใน GitHub repository ของผม ส่วนของผมตามที่ระบุในเรซูเม่คือเวิร์กโฟลว์ AI หลายขั้นตอน guardrail ที่บังคับให้อ้างอิงข้อกฎหมายต้นทาง ระบบสิทธิ์ตามบทบาทพร้อมขั้นตอนอนุมัติโดยเจ้าหน้าที่ และ audit log แบบ hash chain',
      },
      problem: {
        problem:
          'เมื่อหน่วยงานกำกับอย่างธนาคารแห่งประเทศไทยออกประกาศใหม่ ทีม Compliance ของธนาคารต้องอ่าน เทียบกับฉบับก่อนทีละข้อ และหาว่านโยบายภายในข้อใดได้รับผลกระทบ ซึ่งช้า ทำด้วยมือ และผิดพลาดได้ง่าย',
        why: 'FinGuard AI สร้างขึ้นเป็นโปรเจกต์แข่งขัน (ใน repository มีการบันทึก release v1.0.1-competition) เพื่อแสดงว่างานวิเคราะห์นี้ทำอัตโนมัติได้ โดยไม่ดึงการตัดสินใจไปจากคน',
        outcome:
          'เอเจนต์ทำการอ่าน เทียบความต่าง และวิเคราะห์ผลกระทบเองจนจบ แล้วหยุดที่สถานะ WAITING_FOR_HUMAN จะส่งตั๋วแก้ไขได้ก็ต่อเมื่อเจ้าหน้าที่ Compliance อนุมัติ และทุกขั้นตอนถูกบันทึกใน audit chain ที่ตรวจจับการแก้ไขได้',
      },
      diagrams: [
        {
          title: 'เวิร์กโฟลว์ด้านกฎระเบียบ',
          caption: 'ไปป์ไลน์เอเจนต์ตามที่ README อธิบาย และมีโค้ดจริงอยู่ใน src/lib/agents',
          stages: [
            {
              title: 'แหล่งข้อมูล',
              nodes: [
                { label: 'ประกาศ ธปท.', detail: 'Adapter ทางการ (bot.or.th)', tone: 'source' },
                { label: 'ชุดข้อมูลสาธิตสังเคราะห์', detail: 'ติดป้าย SYNTHETIC_DEMO', tone: 'source' },
              ],
              link: 'ดึงข้อมูลฝั่งเซิร์ฟเวอร์อย่างปลอดภัย',
            },
            {
              title: 'ตรวจจับและนำเข้า',
              nodes: [
                { label: 'Watcher agent', detail: 'SSRF guard · ลายนิ้วมือ SHA-256', tone: 'process' },
                { label: 'Ingestion agent', detail: 'ตัวแยกข้อความสองภาษา · แบ่งข้อ', tone: 'process' },
              ],
            },
            {
              title: 'วิเคราะห์',
              nodes: [
                { label: 'Diff agent', detail: 'ADD · MODIFY · DELETE · UNCHANGED', tone: 'process' },
                { label: 'ค้นหานโยบาย', detail: 'pgvector เชิงความหมาย + คำค้น', tone: 'store' },
                { label: 'Gap analysis agent', detail: 'Evidence triad · จัดระดับความเสี่ยง', tone: 'process' },
              ],
              link: 'WAITING_FOR_HUMAN',
            },
            {
              title: 'ตัดสินใจ',
              nodes: [{ label: 'เจ้าหน้าที่ Compliance ตรวจสอบ', detail: 'RBAC: เจ้าหน้าที่อนุมัติ ผู้ตรวจสอบอ่านอย่างเดียว', tone: 'human' }],
              link: 'อนุมัติแล้ว',
            },
            {
              title: 'ดำเนินการและบันทึก',
              nodes: [
                { label: 'Dispatcher agent', detail: 'ตั๋ว CMP-2026-XXXX แบบไม่ซ้ำ', tone: 'output' },
                { label: 'Audit chain', detail: 'เหตุการณ์เชื่อมด้วย SHA-256 · /api/audit/verify', tone: 'store' },
              ],
            },
          ],
          notes: ['ถ้าหลักฐานไม่ครบ ขั้นวิเคราะห์ช่องว่างจะตอบ INSUFFICIENT_EVIDENCE แทนการเดา'],
        },
      ],
      implementation: [
        {
          area: 'แอปพลิเคชัน',
          points: [
            'Next.js 15 App Router มีหน้าแดชบอร์ด กิจกรรมเอเจนต์ กฎระเบียบ การวิเคราะห์ช่องว่าง Compliance Audit และหน้าสาธิตงานธนาคารสองหน้า (teller, reconciliation)',
            'Server actions สำหรับการอนุมัติ การรัน Compliance กฎระเบียบ และธุรกรรม พร้อม route handler 11 ตัว รวม watcher cron ตามเวลาและตัวตรวจ audit',
          ],
        },
        {
          area: 'ข้อมูล',
          points: ['Prisma schema 14 โมเดลบน Neon PostgreSQL เก็บ embedding ของข้อกฎหมายด้วย pgvector', 'สคริปต์ seed รีเซ็ตสถานะเดโมให้สะอาด (npm run demo:reset)'],
        },
        {
          area: 'AI',
          points: ['Vercel AI SDK กับ provider แบบ OpenAI-compatible และ Google', 'มีโหมดทำงานสามแบบตามเอกสาร: ออฟไลน์แบบกำหนดผลแน่นอน, ธปท. จริง + LLM และแบบผสม'],
        },
        {
          area: 'ความปลอดภัยและการกำกับ',
          points: [
            'NextAuth พร้อมบทบาทฝั่งเซิร์ฟเวอร์ (COMPLIANCE_OFFICER, AUDITOR, admin) บังคับใช้ใน middleware',
            'SSRF guard, guardrails ป้องกัน prompt injection และ audit logger แบบ SHA-256 ใน src/lib/security',
          ],
        },
        { area: 'การทดสอบ', points: ['ชุดทดสอบสำหรับเอเจนต์ guardrails และ benchmark สำหรับประเมินผล (tests/)'] },
      ],
      challenges: [
        {
          title: 'AI ต้องไม่แต่งผลการตรวจ Compliance ขึ้นเอง',
          challenge: 'โมเดลภาษาที่ได้บริบทไม่ครบมักยังตอบอย่างมั่นใจ ซึ่งยอมรับไม่ได้ในงานกฎระเบียบ',
          approach: 'การวิเคราะห์อิงหลักฐานสามส่วน (ข้อกฎหมาย ข้อความนโยบาย และเหตุผล) และตอบ INSUFFICIENT_EVIDENCE เมื่อหลักฐานไม่พอ (grounded-reasoning.ts)',
        },
        {
          title: 'ดึงหน้าเว็บของหน่วยงานอย่างปลอดภัย',
          challenge: 'เซิร์ฟเวอร์ที่ดึง URL ตามเวลาอาจถูกใช้เจาะไปยังที่อยู่ภายใน (SSRF)',
          approach: 'Watcher ดึงเฉพาะโดเมนทางการของ ธปท. ที่อยู่ใน allow-list ซึ่งบังคับโดย ssrf-guard.ts',
        },
        {
          title: 'คำสั่งที่ซ่อนอยู่ในเอกสาร',
          challenge: 'ข้อความในประกาศหรือนโยบายอาจมีข้อความที่พยายามชักนำโมเดล',
          approach: 'ข้อมูลเข้าผ่าน guardrails.ts ก่อนถึงโมเดล และมีชุดทดสอบเฉพาะสำหรับกรณีโจมตีแบบ injection',
        },
        {
          title: 'เดโมที่ต้องไม่พังบนเวที',
          challenge: 'การนำเสนอสดไม่ควรขึ้นกับ API ภายนอกหรืออินเทอร์เน็ต',
          approach: 'โหมดออฟไลน์แบบกำหนดผลแน่นอนใช้ข้อมูลสังเคราะห์โดยไม่ต้องมีคีย์ และป้ายแหล่งที่มา (OFFICIAL_BOT กับ SYNTHETIC_DEMO) ทำให้ข้อมูลเดโมแยกได้ชัด',
        },
      ],
      docs: [
        { label: 'สถาปัตยกรรม', url: gh('Finguard-Ai', '/blob/main/docs/ARCHITECTURE.md') },
        { label: 'ความปลอดภัยและ threat model', url: gh('Finguard-Ai', '/blob/main/docs/SECURITY.md') },
        { label: 'การ Deploy', url: gh('Finguard-Ai', '/blob/main/docs/DEPLOYMENT.md') },
      ],
      evidence: 'อ้างอิงจาก README, docs/ และซอร์สโค้ดของ Finguard-Ai (src/lib/agents, src/lib/security, prisma/schema.prisma)',
    },
  },

  'wavy-ide': {
    en: {
      problem: {
        problem: 'Trying out an idea normally starts with setting up a local editor, a Node.js toolchain and a terminal before any code runs.',
        why: 'WAVY IDE explores how much of a desktop IDE workflow — the density of tools like VS Code or Cursor — can run inside a single browser tab, with an AI agent that has real access to the workspace.',
        outcome:
          'One browser surface holds the editor, a workspace that survives reloads, a terminal, a live preview and an AI agent whose changes are shown in a diff before they are applied.',
      },
      diagrams: [
        {
          title: 'Client and AI gateway',
          caption: 'Simplified from the architecture diagram in the README; every box maps to a module in src/.',
          stages: [
            {
              title: 'IDE panels',
              nodes: [
                { label: 'Explorer', tone: 'process' },
                { label: 'Monaco editor', detail: 'tabs · split panes', tone: 'process' },
                { label: 'xterm.js terminal', tone: 'process' },
                { label: 'AI agent panel', tone: 'human' },
              ],
            },
            {
              title: 'Client services',
              nodes: [
                { label: 'Virtual file system', detail: 'IndexedDB via idb-keyval', tone: 'store' },
                { label: 'Runtime adapter', detail: 'Sucrase JSX/TSX transpile', tone: 'process' },
                { label: 'Context manager', detail: 'active file · selection', tone: 'process' },
              ],
              link: 'transpiled bundle',
            },
            {
              title: 'Output',
              nodes: [
                { label: 'Live preview', detail: 'sandboxed iframe · device presets', tone: 'output' },
                { label: 'Diff review', detail: 'accept or reject AI edits', tone: 'human' },
              ],
            },
            {
              title: 'Next.js AI routes',
              nodes: [
                { label: '/api/ai/chat', tone: 'process' },
                { label: '/api/ai/stream', detail: 'Server-Sent Events', tone: 'process' },
                { label: '/api/ai/agent', detail: 'tool-calling loop', tone: 'process' },
              ],
            },
            {
              title: 'Provider',
              nodes: [
                { label: 'DeepSeek adapter', detail: 'OpenAI-compatible', tone: 'source' },
                { label: 'Mock provider', detail: 'used when no key is set', tone: 'source' },
              ],
            },
          ],
          notes: ['AI edits go back into the virtual file system only after the diff is accepted.'],
        },
      ],
      implementation: [
        {
          area: 'Editor',
          points: ['@monaco-editor/react with a custom wavy-dark theme, multi-tab editing, split panes and inline AI quick actions (Explain, Fix, Refactor).'],
        },
        {
          area: 'Workspace',
          points: ['A hierarchical virtual file system persisted to IndexedDB, with search and project templates (React + Vite, Next.js, Express, blank).'],
        },
        {
          area: 'Runtime & terminal',
          points: [
            'JSX/TSX is transpiled in the browser with Sucrase and rendered in a sandboxed iframe; runtime errors are routed to a problems panel.',
            'The xterm.js terminal runs a built-in command interpreter (ls, cat, mkdir, npm run dev…), not a real shell.',
          ],
        },
        {
          area: 'AI agent',
          points: [
            'Seven modes (Ask, Edit, Agent, Explain, Fix, Generate, Refactor) and a tool protocol: read_file, write_file, create_file, list_dir, search_code, run_command, git_status, git_commit.',
          ],
        },
        {
          area: 'State & tests',
          points: ['Eight Zustand stores split by concern; Vitest suites for the agent, provider, file system, runtime and workflows.'],
        },
      ],
      planned: [
        'In progress: live DeepSeek credentials on the server',
        'In progress: loading npm packages from CDNs (esm.sh / unpkg)',
        'In progress: WebContainer-based Node.js execution',
        'Planned: GitHub OAuth, one-click deploys, real-time collaboration and model selection',
      ],
      challenges: [
        {
          title: 'Running code with no server',
          challenge: 'A browser tab has no Node.js process to compile and serve a React project.',
          approach: 'The runtime adapter transpiles JSX/TSX on the fly with Sucrase, resolves a fixed set of built-in modules and renders into a sandboxed iframe.',
        },
        {
          title: 'Keeping AI edits reviewable',
          challenge: 'An agent that can write files can also break a project in one step.',
          approach: 'Every AI change opens a side-by-side Monaco diff; nothing is written until the user accepts it.',
        },
        {
          title: 'A demo that works without an API key',
          challenge: 'Visitors to the live demo have no AI credentials.',
          approach: 'The gateway falls back to a deterministic mock provider, so every panel stays usable.',
        },
      ],
      docs: [{ label: 'README & architecture diagram', url: gh('WAVY_IDE', '#readme') }],
      evidence: 'Based on the WAVY_IDE README (including its own Available now / In progress / Planned lists), package.json and src/.',
    },
    th: {
      problem: {
        problem: 'การลองไอเดียใหม่ปกติต้องเริ่มจากติดตั้ง editor, Node.js toolchain และ terminal ในเครื่องก่อนจะรันโค้ดได้',
        why: 'WAVY IDE ทดลองว่างานแบบ IDE บนเดสก์ท็อป (ความครบเครื่องแบบ VS Code หรือ Cursor) ย้ายมาอยู่ในแท็บเบราว์เซอร์เดียวได้แค่ไหน พร้อมเอเจนต์ AI ที่เข้าถึง workspace ได้จริง',
        outcome: 'หน้าจอเดียวมีทั้ง editor, workspace ที่อยู่รอดหลังรีโหลด, terminal, พรีวิวสด และเอเจนต์ AI ที่การแก้ไขจะแสดงเป็น diff ก่อนนำไปใช้',
      },
      diagrams: [
        {
          title: 'ฝั่งไคลเอนต์และ AI gateway',
          caption: 'ย่อจากแผนภาพสถาปัตยกรรมใน README ทุกกล่องตรงกับโมดูลใน src/',
          stages: [
            {
              title: 'แผง IDE',
              nodes: [
                { label: 'Explorer', tone: 'process' },
                { label: 'Monaco editor', detail: 'แท็บ · แบ่งหน้าจอ', tone: 'process' },
                { label: 'xterm.js terminal', tone: 'process' },
                { label: 'แผงเอเจนต์ AI', tone: 'human' },
              ],
            },
            {
              title: 'บริการฝั่งไคลเอนต์',
              nodes: [
                { label: 'Virtual file system', detail: 'IndexedDB ผ่าน idb-keyval', tone: 'store' },
                { label: 'Runtime adapter', detail: 'แปลง JSX/TSX ด้วย Sucrase', tone: 'process' },
                { label: 'Context manager', detail: 'ไฟล์ที่เปิด · ส่วนที่เลือก', tone: 'process' },
              ],
              link: 'โค้ดที่แปลงแล้ว',
            },
            {
              title: 'ผลลัพธ์',
              nodes: [
                { label: 'Live preview', detail: 'iframe แบบ sandbox · ขนาดอุปกรณ์', tone: 'output' },
                { label: 'ตรวจ diff', detail: 'ยอมรับหรือปฏิเสธการแก้ของ AI', tone: 'human' },
              ],
            },
            {
              title: 'AI routes ของ Next.js',
              nodes: [
                { label: '/api/ai/chat', tone: 'process' },
                { label: '/api/ai/stream', detail: 'Server-Sent Events', tone: 'process' },
                { label: '/api/ai/agent', detail: 'ลูปเรียกใช้เครื่องมือ', tone: 'process' },
              ],
            },
            {
              title: 'Provider',
              nodes: [
                { label: 'DeepSeek adapter', detail: 'OpenAI-compatible', tone: 'source' },
                { label: 'Mock provider', detail: 'ใช้เมื่อไม่มีคีย์', tone: 'source' },
              ],
            },
          ],
          notes: ['การแก้ไขของ AI จะถูกเขียนลง virtual file system หลังจากยอมรับ diff แล้วเท่านั้น'],
        },
      ],
      implementation: [
        { area: 'Editor', points: ['@monaco-editor/react พร้อมธีม wavy-dark แก้ไขหลายแท็บ แบ่งหน้าจอ และปุ่มลัด AI (Explain, Fix, Refactor)'] },
        { area: 'Workspace', points: ['Virtual file system แบบลำดับชั้น เก็บใน IndexedDB มีการค้นหาและเทมเพลตโปรเจกต์ (React + Vite, Next.js, Express, เปล่า)'] },
        {
          area: 'Runtime และ terminal',
          points: [
            'แปลง JSX/TSX ในเบราว์เซอร์ด้วย Sucrase แล้วแสดงใน iframe แบบ sandbox ข้อผิดพลาดตอนรันถูกส่งไปที่แผง Problems',
            'Terminal xterm.js ใช้ตัวแปลคำสั่งในตัว (ls, cat, mkdir, npm run dev…) ไม่ใช่ shell จริง',
          ],
        },
        {
          area: 'เอเจนต์ AI',
          points: ['เจ็ดโหมด (Ask, Edit, Agent, Explain, Fix, Generate, Refactor) และโปรโตคอลเครื่องมือ: read_file, write_file, create_file, list_dir, search_code, run_command, git_status, git_commit'],
        },
        { area: 'State และการทดสอบ', points: ['Zustand store แปดตัวแยกตามหน้าที่ และชุดทดสอบ Vitest สำหรับเอเจนต์ provider ระบบไฟล์ runtime และเวิร์กโฟลว์'] },
      ],
      planned: [
        'กำลังทำ: เชื่อมคีย์ DeepSeek จริงฝั่งเซิร์ฟเวอร์',
        'กำลังทำ: โหลดแพ็กเกจ npm จาก CDN (esm.sh / unpkg)',
        'กำลังทำ: รัน Node.js ด้วย WebContainer',
        'วางแผน: GitHub OAuth, deploy คลิกเดียว, ทำงานร่วมกันแบบเรียลไทม์ และเลือกโมเดลได้',
      ],
      challenges: [
        {
          title: 'รันโค้ดโดยไม่มีเซิร์ฟเวอร์',
          challenge: 'แท็บเบราว์เซอร์ไม่มี Node.js สำหรับคอมไพล์และเสิร์ฟโปรเจกต์ React',
          approach: 'Runtime adapter แปลง JSX/TSX ทันทีด้วย Sucrase ใช้ชุดโมดูลในตัวที่กำหนดไว้ และแสดงผลใน iframe แบบ sandbox',
        },
        {
          title: 'ทำให้การแก้ไขของ AI ตรวจสอบได้',
          challenge: 'เอเจนต์ที่เขียนไฟล์ได้ ก็ทำโปรเจกต์พังได้ในขั้นเดียว',
          approach: 'ทุกการแก้ของ AI เปิดเป็น Monaco diff แบบเทียบข้างกัน และจะไม่เขียนไฟล์จนกว่าผู้ใช้จะยอมรับ',
        },
        {
          title: 'เดโมที่ใช้ได้โดยไม่มี API key',
          challenge: 'ผู้เข้าชมเดโมไม่มีคีย์ AI',
          approach: 'Gateway สลับไปใช้ mock provider ที่ให้ผลแน่นอน ทุกแผงจึงยังใช้งานได้',
        },
      ],
      docs: [{ label: 'README และแผนภาพสถาปัตยกรรม', url: gh('WAVY_IDE', '#readme') }],
      evidence: 'อ้างอิงจาก README ของ WAVY_IDE (รวมรายการ Available now / In progress / Planned ของโปรเจกต์เอง), package.json และ src/',
    },
  },

  'parcel-damage-detection': {
    en: {
      role: {
        label: 'Team capstone project · 4 members',
        detail:
          'Built with three classmates at Sripatum University. My part is the dashboard and UI (listed as “FullStack Architecture & UI/UX Systems” in the companion dashboard repository); vision, embedded control and the IoT network were led by teammates.',
      },
      problem: {
        problem:
          'On a fast sorting conveyor, crushed, torn or water-damaged boxes slip past manual inspection, and when a customer later receives a damaged parcel there is no photographic evidence of the box’s condition before it was shipped.',
        why: 'The team set out to catch damage automatically before parcels enter the delivery network, and to keep a timestamped record of every decision.',
        outcome:
          'An inspection line where cameras, an AI model and sensors produce a PASS / REJECT verdict, an ESP32 pushes rejected boxes aside, and dashboards show live results, evidence and alerts — even if the internet drops.',
      },
      diagrams: [
        {
          title: 'Inspection line',
          caption: 'From the system diagram in the README; on-site parts keep working without internet.',
          stages: [
            {
              title: 'Capture',
              nodes: [
                { label: 'Two cameras', detail: 'top + side view', tone: 'source' },
                { label: 'IR break-beam · load cell · barcode', tone: 'source' },
              ],
            },
            {
              title: 'Inference',
              nodes: [
                { label: 'CiRA CORE or YOLOv11n', detail: 'pretrained third-party model · normal / damaged', tone: 'process' },
                { label: 'OpenCV checks', detail: 'wet · deformed', tone: 'process' },
              ],
              link: 'MQTT / HTTP',
            },
            {
              title: 'Edge gateway',
              nodes: [
                { label: 'Decision engine', detail: 'PASS / REJECT · fail-safe', tone: 'process' },
                { label: 'SQLite', detail: 'written first, always', tone: 'store' },
              ],
              link: 'UART',
            },
            {
              title: 'Actuation',
              nodes: [{ label: 'ESP32 controller', detail: 'servo pusher · tower light · buzzer · belt relay', tone: 'output' }],
              link: 'HTTPS when online',
            },
            {
              title: 'Cloud',
              nodes: [
                { label: 'Express cloud API', detail: 'Neon Postgres', tone: 'store' },
                { label: 'Web dashboards', detail: 'my part of the project', tone: 'human' },
              ],
            },
          ],
          notes: [
            'Network down → the line keeps sorting, the tower light turns yellow and records sync later.',
            'AI not answering or camera dark → fail-safe action (reject by default).',
          ],
        },
      ],
      implementation: [
        {
          area: 'Dashboard (my part)',
          points: [
            'Overview, Live Monitoring, Tracking (evidence search and CSV export), Alerts, Analytics and Settings tabs.',
            'Operating parameters such as the pusher delay and per-class confidence thresholds are tuned from the Settings tab without changing code.',
          ],
        },
        {
          area: 'Edge & cloud',
          points: [
            'A Node.js gateway with an embedded Aedes MQTT broker, local SQLite (node:sqlite) and store-and-forward sync to the cloud API.',
            'Edge → cloud ingestion endpoints protected by an x-api-key header.',
          ],
        },
        {
          area: 'Vision & embedded',
          points: [
            'Python bridges for CiRA CORE plus a stand-alone YOLOv11n detector. The YOLO weights are a pretrained third-party model (cvtechniques/PackageDamage on Hugging Face, MIT licence) included in models/; the team’s own CiRA CORE model is meant to be added there.',
            'ESP32 firmware (ArduinoJson, ESP32Servo, HX711) owns the pusher timing.',
          ],
        },
        {
          area: 'Verification',
          points: ['Automated tests including an offline fail-safe test, and a simulator for camera, AI and ESP32 faults (dark camera, AI off, belt jam).'],
        },
      ],
      planned: [
        'Companion dashboard roadmap: direct CiRA CORE ingestion over MQTT',
        'Companion dashboard roadmap: sensor / PLC coupling and the SQLite sync engine',
        'Companion dashboard roadmap: on-site deployment at a test logistics hub',
      ],
      challenges: [
        {
          title: 'Sorting must not stop when the network does',
          challenge: 'A conveyor line cannot wait for the cloud.',
          approach: 'The gateway decides locally, writes every result to SQLite first and forwards the queue once the connection returns.',
        },
        {
          title: 'What to do when the AI is late',
          challenge: 'If the model answers after the box has passed the pusher, the decision is useless.',
          approach: 'ai_timeout_ms (1000 ms by default) must stay below reject_delay_ms (1500 ms); on timeout or a dark camera the configurable fail-safe rejects the box.',
        },
        {
          title: 'Millisecond timing',
          challenge: 'A PC can stall; the pusher cannot.',
          approach: 'The ESP32 times the pusher itself and applies the fail-safe on its own if the gateway stops responding.',
        },
        {
          title: 'Printed boxes that look damaged',
          challenge: 'Graphics that resemble tears could cause false rejects.',
          approach: 'The documented reliability test plan includes a false-positive case: patterned boxes must PASS.',
        },
      ],
      docs: [
        { label: 'Main repository README (Thai)', url: gh('parcel-damage-detection', '#readme') },
        { label: 'Companion conveyor dashboard', url: gh('AI-Parcel-Box-Damage-Detection-System', '#readme') },
      ],
      evidence: 'Based on the READMEs, test plan and source of parcel-damage-detection and AI-Parcel-Box-Damage-Detection-System.',
    },
    th: {
      role: {
        label: 'โปรเจกต์ทีม (Capstone) · 4 คน',
        detail:
          'ทำร่วมกับเพื่อนร่วมชั้นสามคนที่มหาวิทยาลัยศรีปทุม ส่วนของผมคือแดชบอร์ดและ UI (ใน repository แดชบอร์ดคู่กันระบุว่า “FullStack Architecture & UI/UX Systems”) ส่วน Vision, ระบบควบคุมฝังตัว และเครือข่าย IoT เป็นงานที่เพื่อนในทีมรับผิดชอบ',
      },
      problem: {
        problem: 'บนสายพานคัดแยกความเร็วสูง กล่องที่บุบ ฉีก หรือเปียกน้ำมักหลุดรอดการตรวจด้วยตา และเมื่อลูกค้าได้รับพัสดุเสียหาย ก็ไม่มีภาพหลักฐานสภาพกล่องก่อนส่ง',
        why: 'ทีมต้องการจับความเสียหายอัตโนมัติก่อนพัสดุเข้าสู่ระบบขนส่ง และเก็บบันทึกพร้อมเวลาของทุกการตัดสินใจ',
        outcome: 'สายตรวจที่กล้อง โมเดล AI และเซนเซอร์ให้ผล PASS / REJECT แล้ว ESP32 ปัดกล่องที่ไม่ผ่านออก โดยมีแดชบอร์ดแสดงผลสด หลักฐาน และการแจ้งเตือน แม้อินเทอร์เน็ตจะหลุด',
      },
      diagrams: [
        {
          title: 'สายตรวจพัสดุ',
          caption: 'จากแผนภาพระบบใน README ส่วนที่หน้างานทำงานต่อได้แม้ไม่มีอินเทอร์เน็ต',
          stages: [
            {
              title: 'รับข้อมูล',
              nodes: [
                { label: 'กล้อง 2 ตัว', detail: 'มุมบน + มุมข้าง', tone: 'source' },
                { label: 'IR · Load cell · บาร์โค้ด', tone: 'source' },
              ],
            },
            {
              title: 'ประมวลผล AI',
              nodes: [
                { label: 'CiRA CORE หรือ YOLOv11n', detail: 'โมเดลสำเร็จรูปจากภายนอก · ปกติ / ชำรุด', tone: 'process' },
                { label: 'ตรวจด้วย OpenCV', detail: 'เปียก · ผิดรูป', tone: 'process' },
              ],
              link: 'MQTT / HTTP',
            },
            {
              title: 'Edge gateway',
              nodes: [
                { label: 'ตัวตัดสินผล', detail: 'PASS / REJECT · fail-safe', tone: 'process' },
                { label: 'SQLite', detail: 'บันทึกก่อนเสมอ', tone: 'store' },
              ],
              link: 'UART',
            },
            {
              title: 'สั่งงาน',
              nodes: [{ label: 'ESP32', detail: 'แขนปัด · tower light · buzzer · relay สายพาน', tone: 'output' }],
              link: 'HTTPS เมื่อมีเน็ต',
            },
            {
              title: 'คลาวด์',
              nodes: [
                { label: 'Cloud API (Express)', detail: 'Neon Postgres', tone: 'store' },
                { label: 'เว็บแดชบอร์ด', detail: 'ส่วนที่ผมรับผิดชอบ', tone: 'human' },
              ],
            },
          ],
          notes: ['เน็ตหลุด → ยังคัดแยกได้ ไฟเหลือง และข้อมูลส่งขึ้นภายหลัง', 'AI ไม่ตอบหรือกล้องมืด → ใช้ fail-safe (ค่าเริ่มต้นคือปัดออก)'],
        },
      ],
      implementation: [
        {
          area: 'แดชบอร์ด (ส่วนของผม)',
          points: ['แท็บภาพรวม, Live Monitoring, หลักฐาน (ค้นหาและ Export CSV), แจ้งเตือน, Analytics และตั้งค่า', 'ปรับค่าการทำงาน เช่น ดีเลย์แขนปัดและ threshold ของแต่ละคลาส ได้จากแท็บตั้งค่าโดยไม่ต้องแก้โค้ด'],
        },
        {
          area: 'Edge และคลาวด์',
          points: ['Gateway ด้วย Node.js มี MQTT broker (Aedes) ในตัว SQLite ในเครื่อง (node:sqlite) และส่งต่อขึ้น Cloud API แบบ store-and-forward', 'Endpoint รับข้อมูลจาก edge ป้องกันด้วย header x-api-key'],
        },
        { area: 'Vision และระบบฝังตัว', points: ['สคริปต์ Python เชื่อม CiRA CORE และตัวตรวจจับ YOLOv11n แบบแยกอิสระ โดยน้ำหนักโมเดล YOLO เป็นโมเดลสำเร็จรูปจากภายนอก (cvtechniques/PackageDamage บน Hugging Face, สัญญาอนุญาต MIT) ที่ใส่ไว้ใน models/ ส่วนโมเดล CiRA CORE ของทีมจะเพิ่มในโฟลเดอร์เดียวกัน', 'เฟิร์มแวร์ ESP32 (ArduinoJson, ESP32Servo, HX711) เป็นผู้จับเวลาแขนปัด'] },
        { area: 'การตรวจสอบ', points: ['ทดสอบอัตโนมัติรวมการทดสอบ fail-safe ตอนออฟไลน์ และตัวจำลองความผิดพลาดของกล้อง AI และ ESP32 (กล้องมืด, ปิด AI, สายพานติด)'] },
      ],
      planned: ['แผนของแดชบอร์ดคู่กัน: รับข้อมูลจาก CiRA CORE ผ่าน MQTT โดยตรง', 'แผนของแดชบอร์ดคู่กัน: เชื่อมเซนเซอร์ / PLC และระบบ sync ของ SQLite', 'แผนของแดชบอร์ดคู่กัน: ติดตั้งจริงที่ศูนย์โลจิสติกส์ทดสอบ'],
      challenges: [
        {
          title: 'การคัดแยกต้องไม่หยุดเมื่อเน็ตหยุด',
          challenge: 'สายพานรอคลาวด์ไม่ได้',
          approach: 'Gateway ตัดสินผลในเครื่อง บันทึกลง SQLite ก่อนทุกครั้ง และส่งคิวต่อเมื่อเชื่อมต่อกลับมา',
        },
        {
          title: 'ถ้า AI ตอบช้าจะทำอย่างไร',
          challenge: 'ถ้าโมเดลตอบหลังกล่องผ่านแขนปัดไปแล้ว ผลนั้นไร้ประโยชน์',
          approach: 'ai_timeout_ms (ค่าเริ่มต้น 1000 ms) ต้องน้อยกว่า reject_delay_ms (1500 ms) เมื่อหมดเวลาหรือกล้องมืด fail-safe ที่ตั้งค่าได้จะปัดกล่องออก',
        },
        {
          title: 'จังหวะระดับมิลลิวินาที',
          challenge: 'คอมพิวเตอร์ค้างได้ แต่แขนปัดค้างไม่ได้',
          approach: 'ESP32 จับเวลาแขนปัดเอง และทำ fail-safe ด้วยตัวเองหาก gateway ไม่ตอบ',
        },
        {
          title: 'กล่องลายพิมพ์ที่ดูเหมือนชำรุด',
          challenge: 'ลายกราฟิกคล้ายรอยขาดอาจทำให้ปัดกล่องดีทิ้ง',
          approach: 'แผนทดสอบความน่าเชื่อถือที่บันทึกไว้มีกรณี false positive: กล่องลายต้องได้ PASS',
        },
      ],
      docs: [
        { label: 'README ของ repository หลัก (ภาษาไทย)', url: gh('parcel-damage-detection', '#readme') },
        { label: 'แดชบอร์ดสายพานคู่กัน', url: gh('AI-Parcel-Box-Damage-Detection-System', '#readme') },
      ],
      evidence: 'อ้างอิงจาก README แผนทดสอบ และซอร์สโค้ดของ parcel-damage-detection และ AI-Parcel-Box-Damage-Detection-System',
    },
  },

  'spare-change': {
    en: {
      problem: {
        problem: 'Homelessness is easy to look past. Statistics rarely convey the daily trade-offs of surviving on the street.',
        why: 'SPARE CHANGE uses game systems to put players in that position — choosing between food, safety, money and dignity every day — while keeping all content in data files so it can grow without code changes.',
        outcome:
          'A finished, playable browser game (installable as a PWA) with 15 real cities, 266 events and 40 endings, plus an optional online layer: leaderboards, a daily challenge and traces left by other players.',
      },
      diagrams: [
        {
          title: 'Engine and online layer',
          caption: 'The game runs entirely in the browser; the online features are optional and never change the engine.',
          stages: [
            {
              title: 'Content',
              nodes: [
                { label: 'JSON data', detail: 'cities · events · actions · endings · origins · traits · items', tone: 'source' },
                { label: 'Validation', detail: 'load-time checks + validate script', tone: 'process' },
              ],
            },
            {
              title: 'Engine',
              nodes: [{ label: 'step(state, action)', detail: 'pure TypeScript · seeded RNG inside the state', tone: 'process' }],
            },
            {
              title: 'Client',
              nodes: [
                { label: 'Next.js pages', detail: 'play · end · endings · achievements · leaderboard', tone: 'output' },
                { label: 'Browser storage', detail: 'autosave · past lives', tone: 'store' },
              ],
              link: 'seed + action list',
            },
            {
              title: 'Online (optional)',
              nodes: [
                { label: '/api/runs', detail: 'replays the run with the same engine and scores it', tone: 'process' },
                { label: 'Neon Postgres', detail: 'runs · names · traces · daily', tone: 'store' },
              ],
            },
          ],
        },
      ],
      implementation: [
        {
          area: 'Engine',
          points: [
            'lib/engine.ts exposes step(state, action) with no React and no Math.random; the RNG state lives in GameState, so a seed plus the same choices always replays the same life.',
            'Malformed data entries are skipped with a warning instead of crashing the game.',
          ],
        },
        {
          area: 'Tooling',
          points: ['Scripts validate every data file, simulate hundreds of lives with an auto-pilot, check that each way of living can reach its ending, and verify server replays.'],
        },
        {
          area: 'Online',
          points: [
            'Neon Postgres via @neondatabase/serverless; tables are created on first use.',
            'Per-IP rate limits, a Thai/English word filter for names and notes, and share cards rendered with next/og.',
          ],
        },
        {
          area: 'Platform',
          points: ['A web app manifest and service worker let the game install and play offline after the first visit.'],
        },
      ],
      challenges: [
        {
          title: 'Leaderboards that can’t be faked',
          challenge: 'Any score computed in the browser can be edited before it is sent.',
          approach: 'The client sends only the seed and its action list; /api/runs replays the life with the same pure engine and computes the score itself.',
        },
        {
          title: 'Thai text in generated images',
          challenge: 'Satori (used by next/og) cannot stack Thai tone marks above upper vowels.',
          approach: 'The share-card route positions those marks by hand so cards stay readable.',
        },
        {
          title: 'Keyboard play on a Thai layout',
          challenge: 'Number and letter shortcuts break when the keyboard is set to Thai.',
          approach: 'Keys are read by physical position, so 1–9 and Q W E R work on either layout.',
        },
      ],
      docs: [{ label: 'README', url: gh('beggarsrole', '#readme') }],
      evidence: 'Based on the beggarsrole README, package.json and data/ (counts taken from the JSON files).',
    },
    th: {
      problem: {
        problem: 'ปัญหาคนไร้บ้านเป็นเรื่องที่มองข้ามได้ง่าย ตัวเลขสถิติไม่ค่อยสื่อถึงการตัดสินใจรายวันของการเอาชีวิตรอดบนถนน',
        why: 'SPARE CHANGE ใช้ระบบเกมพาผู้เล่นไปอยู่ในจุดนั้น เลือกระหว่างอาหาร ความปลอดภัย เงิน และศักดิ์ศรีทุกวัน โดยเก็บเนื้อหาทั้งหมดในไฟล์ข้อมูลเพื่อเพิ่มได้โดยไม่ต้องแก้โค้ด',
        outcome: 'เกมบนเบราว์เซอร์ที่เล่นได้จบ (ติดตั้งเป็น PWA ได้) มี 15 เมืองจริง 266 เหตุการณ์ และ 40 ฉากจบ พร้อมส่วนออนไลน์ที่เลือกได้ ได้แก่ กระดานคะแนน ภารกิจรายวัน และร่องรอยจากผู้เล่นอื่น',
      },
      diagrams: [
        {
          title: 'เอนจินและส่วนออนไลน์',
          caption: 'เกมทำงานในเบราว์เซอร์ทั้งหมด ส่วนออนไลน์เป็นตัวเลือกเสริมและไม่เปลี่ยนเอนจิน',
          stages: [
            {
              title: 'เนื้อหา',
              nodes: [
                { label: 'ข้อมูล JSON', detail: 'เมือง · เหตุการณ์ · การกระทำ · ฉากจบ · ภูมิหลัง · นิสัย · ไอเทม', tone: 'source' },
                { label: 'ตรวจความถูกต้อง', detail: 'ตรวจตอนโหลด + สคริปต์ validate', tone: 'process' },
              ],
            },
            { title: 'เอนจิน', nodes: [{ label: 'step(state, action)', detail: 'TypeScript ล้วน · RNG แบบมี seed อยู่ใน state', tone: 'process' }] },
            {
              title: 'ไคลเอนต์',
              nodes: [
                { label: 'หน้า Next.js', detail: 'เล่น · สรุปชีวิต · ฉากจบ · ความสำเร็จ · กระดานคะแนน', tone: 'output' },
                { label: 'พื้นที่เก็บในเบราว์เซอร์', detail: 'บันทึกอัตโนมัติ · ชีวิตที่ผ่านมา', tone: 'store' },
              ],
              link: 'seed + รายการการกระทำ',
            },
            {
              title: 'ออนไลน์ (ไม่บังคับ)',
              nodes: [
                { label: '/api/runs', detail: 'เล่นซ้ำด้วยเอนจินเดียวกันแล้วคิดคะแนนเอง', tone: 'process' },
                { label: 'Neon Postgres', detail: 'ผลการเล่น · ชื่อ · ร่องรอย · รายวัน', tone: 'store' },
              ],
            },
          ],
        },
      ],
      implementation: [
        {
          area: 'เอนจิน',
          points: [
            'lib/engine.ts มีฟังก์ชัน step(state, action) ที่ไม่ใช้ React และไม่ใช้ Math.random สถานะ RNG อยู่ใน GameState ดังนั้น seed เดียวกันกับการเลือกเดิมจะได้ชีวิตเดิมเสมอ',
            'ข้อมูลที่ผิดรูปแบบจะถูกข้ามพร้อมคำเตือนแทนที่จะทำให้เกมล่ม',
          ],
        },
        { area: 'เครื่องมือ', points: ['สคริปต์ตรวจไฟล์ข้อมูลทั้งหมด จำลองการเล่นหลายร้อยชีวิตด้วย auto-pilot ตรวจว่าแต่ละวิถีชีวิตไปถึงฉากจบของตัวเองได้ และตรวจการเล่นซ้ำฝั่งเซิร์ฟเวอร์'] },
        {
          area: 'ออนไลน์',
          points: ['Neon Postgres ผ่าน @neondatabase/serverless ตารางถูกสร้างเมื่อใช้งานครั้งแรก', 'จำกัดอัตราตาม IP ตัวกรองคำไทย/อังกฤษสำหรับชื่อและโน้ต และการ์ดแชร์ที่สร้างด้วย next/og'],
        },
        { area: 'แพลตฟอร์ม', points: ['Web app manifest และ service worker ทำให้ติดตั้งและเล่นออฟไลน์ได้หลังเข้าครั้งแรก'] },
      ],
      challenges: [
        {
          title: 'กระดานคะแนนที่ปลอมไม่ได้',
          challenge: 'คะแนนที่คำนวณในเบราว์เซอร์แก้ไขได้ก่อนส่ง',
          approach: 'ไคลเอนต์ส่งเพียง seed และรายการการกระทำ แล้ว /api/runs เล่นชีวิตนั้นซ้ำด้วยเอนจินเดียวกันและคำนวณคะแนนเอง',
        },
        {
          title: 'ข้อความไทยในภาพที่สร้างอัตโนมัติ',
          challenge: 'Satori (ที่ next/og ใช้) วางวรรณยุกต์ไทยซ้อนบนสระบนไม่ได้',
          approach: 'Route สร้างการ์ดแชร์จัดตำแหน่งวรรณยุกต์เองเพื่อให้อ่านได้',
        },
        {
          title: 'เล่นด้วยคีย์บอร์ดภาษาไทย',
          challenge: 'ปุ่มลัดตัวเลขและตัวอักษรใช้ไม่ได้เมื่อแป้นพิมพ์เป็นภาษาไทย',
          approach: 'อ่านปุ่มตามตำแหน่งจริงบนแป้น ทำให้ 1–9 และ Q W E R ใช้ได้ทั้งสองภาษา',
        },
      ],
      docs: [{ label: 'README', url: gh('beggarsrole', '#readme') }],
      evidence: 'อ้างอิงจาก README, package.json และโฟลเดอร์ data/ ของ beggarsrole (จำนวนนับจากไฟล์ JSON)',
    },
  },
  'vision-training-studio': {
    en: {
      problem: {
        problem:
          'Training an object detector on your own images usually means stitching together a labelling tool, format-conversion scripts, a training framework and separate inference code — and treating the network itself as a black box.',
        why: 'Vision Training Studio puts that whole loop behind one API and one web studio, and implements its own detector, KDel 4.0, directly in PyTorch instead of only calling a training library.',
        outcome:
          'A locally run platform where a dataset can be imported, annotated, trained (with KDel 4.0, YOLO or a classifier), monitored live and then used for inference — all from the browser.',
      },
      diagrams: [
        {
          title: 'From folder to trained model',
          caption: 'Modules from app/ and frontend/src in the repository; the platform runs locally (there is no public deployment).',
          stages: [
            {
              title: 'Data in',
              nodes: [
                { label: 'Local image folder', detail: 'imported from the browser', tone: 'source' },
                { label: 'Canvas annotator', detail: 'boxes · COCO / VOC / YOLO converters', tone: 'human' },
              ],
            },
            {
              title: 'Dataset pipeline',
              nodes: [
                { label: 'Validator & splitter', detail: 'train / val / test', tone: 'process' },
                { label: 'Augmentor', tone: 'process' },
                { label: 'SQLAlchemy store', detail: 'projects · datasets · jobs · models', tone: 'store' },
              ],
              link: 'start job',
            },
            {
              title: 'Training worker',
              nodes: [
                { label: 'KDel 4.0 trainer', detail: 'custom PyTorch detector · AdamW · cosine · AMP', tone: 'process' },
                { label: 'YOLO trainer', detail: 'Ultralytics', tone: 'process' },
                { label: 'Classification trainer', tone: 'process' },
              ],
              link: 'events over WebSocket',
            },
            {
              title: 'Monitor',
              nodes: [{ label: 'React 19 studio', detail: 'live loss curves · telemetry', tone: 'output' }],
            },
            {
              title: 'Use the model',
              nodes: [
                { label: 'Model registry & exporter', detail: 'checkpoints', tone: 'store' },
                { label: 'Predictor', detail: 'single / batch · visualiser', tone: 'output' },
              ],
            },
          ],
        },
      ],
      implementation: [
        {
          area: 'KDel 4.0 network',
          points: [
            'Convolution + batch-norm blocks with residual units and a combined channel / spatial attention module in the backbone.',
            'A PANet neck fuses three scales; a decoupled anchor-free head predicts class, box and objectness separately, trained with a composite multi-task loss (KDelLoss).',
          ],
        },
        {
          area: 'Training',
          points: [
            'A trainer registry selects KDel, Ultralytics YOLO or image classification.',
            'AdamW with cosine annealing, mixed precision with gradient scaling, and checkpointing; jobs run in a background worker and publish progress events.',
          ],
        },
        {
          area: 'Backend',
          points: ['FastAPI routers for projects, datasets, annotations, training, models, inference and system status, with Pydantic v2 schemas and SQLAlchemy models; a command-line interface (app/cli.py).'],
        },
        {
          area: 'Web studio',
          points: ['React 19 + Vite views for datasets, annotation, training and inference; JSZip for packaging data in the browser.'],
        },
      ],
      challenges: [
        {
          title: 'Turning grid outputs into boxes',
          challenge: 'An anchor-free head predicts per grid cell at three resolutions, not boxes in image coordinates.',
          approach: 'The model decodes each scale with its stride back into image-space boxes before scoring (_decode_predictions in kdel.py).',
        },
        {
          title: 'Long training without a frozen API',
          challenge: 'A training run can take minutes or hours, while the UI still needs to respond and show progress.',
          approach: 'Jobs run in a background worker that emits events; the browser follows them over a WebSocket instead of polling.',
        },
        {
          title: 'Many annotation formats',
          challenge: 'Datasets arrive labelled for different tools.',
          approach: 'Dedicated COCO, Pascal VOC and YOLO converters (app/annotations) normalise annotations in one place.',
        },
      ],
      docs: [{ label: 'README — architecture, maths and workflow', url: gh('training', '#readme') }],
      evidence:
        'Based on the repository README and source (app/models/kdel.py, app/training, app/api, frontend/src). The README mentions automated tests, but the repository contains no test files yet, so none are claimed here.',
    },
    th: {
      problem: {
        problem: 'การฝึกโมเดลตรวจจับวัตถุด้วยภาพของตัวเองมักต้องต่อหลายเครื่องมือเข้าด้วยกัน ทั้งเครื่องมือ label สคริปต์แปลงรูปแบบ เฟรมเวิร์กฝึก และโค้ดทำนายแยกต่างหาก และมักมองโครงข่ายเป็นกล่องดำ',
        why: 'Vision Training Studio รวมทั้งกระบวนการไว้หลัง API และเว็บสตูดิโอเดียว และเขียนโมเดลตรวจจับของตัวเอง KDel 4.0 ด้วย PyTorch โดยตรง แทนการเรียกใช้ไลบรารีฝึกเพียงอย่างเดียว',
        outcome: 'แพลตฟอร์มที่รันในเครื่อง สามารถนำเข้า ทำ annotation ฝึก (ด้วย KDel 4.0, YOLO หรือตัวจำแนกภาพ) ติดตามแบบสด และนำโมเดลไปทำนายได้จากเบราว์เซอร์',
      },
      diagrams: [
        {
          title: 'จากโฟลเดอร์สู่โมเดลที่ฝึกแล้ว',
          caption: 'โมดูลจาก app/ และ frontend/src ใน repository แพลตฟอร์มนี้รันในเครื่อง (ยังไม่มีเว็บสาธารณะ)',
          stages: [
            {
              title: 'ข้อมูลเข้า',
              nodes: [
                { label: 'โฟลเดอร์ภาพในเครื่อง', detail: 'นำเข้าจากเบราว์เซอร์', tone: 'source' },
                { label: 'ตัววาดกรอบบน canvas', detail: 'กรอบวัตถุ · แปลง COCO / VOC / YOLO', tone: 'human' },
              ],
            },
            {
              title: 'ไปป์ไลน์ชุดข้อมูล',
              nodes: [
                { label: 'ตรวจสอบและแบ่งชุด', detail: 'train / val / test', tone: 'process' },
                { label: 'เพิ่มข้อมูล (augment)', tone: 'process' },
                { label: 'ที่เก็บ SQLAlchemy', detail: 'โปรเจกต์ · ชุดข้อมูล · งานฝึก · โมเดล', tone: 'store' },
              ],
              link: 'เริ่มงานฝึก',
            },
            {
              title: 'Worker ฝึกโมเดล',
              nodes: [
                { label: 'Trainer KDel 4.0', detail: 'โมเดล PyTorch ที่เขียนเอง · AdamW · cosine · AMP', tone: 'process' },
                { label: 'Trainer YOLO', detail: 'Ultralytics', tone: 'process' },
                { label: 'Trainer จำแนกภาพ', tone: 'process' },
              ],
              link: 'เหตุการณ์ผ่าน WebSocket',
            },
            { title: 'ติดตาม', nodes: [{ label: 'สตูดิโอ React 19', detail: 'กราฟ loss สด · telemetry', tone: 'output' }] },
            {
              title: 'ใช้งานโมเดล',
              nodes: [
                { label: 'ทะเบียนโมเดลและตัวส่งออก', detail: 'checkpoint', tone: 'store' },
                { label: 'ตัวทำนาย', detail: 'ทีละภาพ / เป็นชุด · แสดงผล', tone: 'output' },
              ],
            },
          ],
        },
      ],
      implementation: [
        {
          area: 'โครงข่าย KDel 4.0',
          points: [
            'บล็อก convolution + batch-norm พร้อม residual unit และโมดูล attention เชิงช่องสัญญาณ / พื้นที่ใน backbone',
            'Neck แบบ PANet รวมสามสเกล และ head แบบ anchor-free ที่แยกทำนายคลาส กรอบ และ objectness ฝึกด้วย loss แบบหลายงาน (KDelLoss)',
          ],
        },
        {
          area: 'การฝึก',
          points: ['ทะเบียน trainer เลือกได้ระหว่าง KDel, Ultralytics YOLO หรือการจำแนกภาพ', 'AdamW กับ cosine annealing, mixed precision พร้อม gradient scaling และ checkpoint งานฝึกรันใน worker เบื้องหลังและส่งเหตุการณ์ความคืบหน้า'],
        },
        { area: 'แบ็กเอนด์', points: ['Router ของ FastAPI สำหรับโปรเจกต์ ชุดข้อมูล annotation การฝึก โมเดล การทำนาย และสถานะระบบ พร้อม schema แบบ Pydantic v2 โมเดล SQLAlchemy และ CLI (app/cli.py)'] },
        { area: 'เว็บสตูดิโอ', points: ['หน้าจอ React 19 + Vite สำหรับชุดข้อมูล annotation การฝึก และการทำนาย ใช้ JSZip รวมไฟล์ข้อมูลในเบราว์เซอร์'] },
      ],
      challenges: [
        {
          title: 'แปลงผลลัพธ์จาก grid เป็นกรอบ',
          challenge: 'Head แบบ anchor-free ทำนายต่อช่อง grid ในสามความละเอียด ไม่ได้ให้กรอบในพิกัดภาพโดยตรง',
          approach: 'โมเดลถอดรหัสแต่ละสเกลด้วย stride กลับเป็นกรอบในพิกัดภาพก่อนให้คะแนน (_decode_predictions ใน kdel.py)',
        },
        {
          title: 'ฝึกนานโดยไม่ทำให้ API ค้าง',
          challenge: 'การฝึกหนึ่งรอบอาจใช้เวลาหลายนาทีถึงหลายชั่วโมง แต่หน้าจอยังต้องตอบสนองและแสดงความคืบหน้า',
          approach: 'งานฝึกรันใน worker เบื้องหลังที่ส่งเหตุการณ์ออกมา และเบราว์เซอร์ติดตามผ่าน WebSocket แทนการถามซ้ำ',
        },
        {
          title: 'รูปแบบ annotation ที่หลากหลาย',
          challenge: 'ชุดข้อมูลมักถูก label มาสำหรับเครื่องมือต่างกัน',
          approach: 'ตัวแปลง COCO, Pascal VOC และ YOLO โดยเฉพาะ (app/annotations) ปรับ annotation ให้เป็นรูปแบบเดียวกันในที่เดียว',
        },
      ],
      docs: [{ label: 'README — สถาปัตยกรรม คณิตศาสตร์ และขั้นตอนการทำงาน', url: gh('training', '#readme') }],
      evidence:
        'อ้างอิงจาก README และซอร์สโค้ดของ repository (app/models/kdel.py, app/training, app/api, frontend/src) README กล่าวถึงการทดสอบอัตโนมัติ แต่ใน repository ยังไม่มีไฟล์ทดสอบ จึงไม่ได้อ้างถึงที่นี่',
    },
  },
};
