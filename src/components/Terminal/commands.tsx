import type { ReactNode } from 'react';
import { certificates, formatCertDate } from '../../data/certificates';
import { journey } from '../../data/journey';
import { navItems, profile } from '../../data/portfolio';
import { projects } from '../../data/projects';
import { skillCategories, visibleSkills } from '../../data/skills';
import type { SectionId } from '../../data/types';
import { configuredSocials, hasEmail, hasResume } from '../../utils/links';

/** Side effects a command may trigger in the surrounding page. */
export interface TerminalActions {
  goto: (id: SectionId) => void;
  openProject: (id: string) => void;
}

export interface CommandOutput {
  output?: ReactNode;
  error?: boolean;
  clear?: boolean;
}

interface CommandDef {
  name: string;
  usage?: string;
  description: string;
  run: (args: string[], actions: TerminalActions, history: string[]) => CommandOutput;
}

const Row = ({ k, children }: { k: string; children: ReactNode }) => (
  <div className="term-row">
    <span className="term-key">{k}</span>
    <span>{children}</span>
  </div>
);

const findProject = (query: string) => {
  const q = query.toLowerCase();
  const index = Number.parseInt(q.replace(/^prj-?/, ''), 10);
  return (
    projects.find((p) => p.id === q || p.code.toLowerCase() === q) ??
    (Number.isFinite(index) ? projects[index - 1] : undefined)
  );
};

const sectionIds = navItems.map((n) => n.id);

const COMMANDS: CommandDef[] = [
  {
    name: 'help',
    description: 'List available commands',
    run: () => ({
      output: (
        <div className="term-help">
          {COMMANDS.map((c) => (
            <div key={c.name} className="term-row">
              <span className="term-cmd">{c.usage ?? c.name}</span>
              <span className="term-muted">{c.description}</span>
            </div>
          ))}
          <p className="term-muted term-gap">Tip: ↑/↓ browse history · Tab autocompletes.</p>
        </div>
      ),
    }),
  },
  {
    name: 'about',
    description: 'Who I am',
    run: () => ({
      output: (
        <div>
          <p>
            <span className="term-accent">{profile.fullName}</span> ({profile.nickname}) — {profile.role}
          </p>
          <p className="term-gap">{profile.bio}</p>
          <p className="term-gap">{profile.aboutMe}</p>
        </div>
      ),
    }),
  },
  {
    name: 'whoami',
    description: 'Short identity summary',
    run: () => ({ output: `${profile.fullName} (${profile.nickname.toLowerCase()}) · ${profile.role.toLowerCase()}` }),
  },
  {
    name: 'education',
    description: 'Where I study',
    run: () => ({
      output: (
        <div>
          <Row k="field">{profile.education.field}</Row>
          <Row k="university">{profile.education.university}</Row>
          <Row k="campus">{profile.education.campus}</Row>
          {profile.education.period && <Row k="period">{profile.education.period}</Row>}
        </div>
      ),
    }),
  },
  {
    name: 'skills',
    usage: 'skills [category]',
    description: 'Technologies, grouped by category',
    run: (args) => {
      const query = args.join(' ').toLowerCase();
      const categories = skillCategories.filter((c) => visibleSkills(c).length > 0);
      const matched = query
        ? categories.filter((c) => c.id.includes(query) || c.title.toLowerCase().includes(query))
        : categories;
      if (matched.length === 0) {
        return {
          error: true,
          output: `No listed skills match "${query}". Try: ${categories.map((c) => c.id).join(', ')}`,
        };
      }
      return {
        output: (
          <div>
            {matched.map((c) => (
              <div key={c.id} className="term-block">
                <p className="term-accent">▸ {c.title}</p>
                {visibleSkills(c).map((s) => (
                  <Row key={s.name} k={`  ${s.name}`}>
                    <span className="term-muted">[{s.level}]</span>
                  </Row>
                ))}
              </div>
            ))}
            <p className="term-muted term-gap">More categories are being filled in as I learn.</p>
          </div>
        ),
      };
    },
  },
  {
    name: 'projects',
    description: 'List projects',
    run: () => ({
      output: (
        <div>
          {projects.map((p) => (
            <div key={p.id} className="term-block">
              <p>
                <span className="term-accent">{p.code}</span> {p.title}
              </p>
              <p className="term-muted">
                {'  '}
                {p.categoryLabel} · {p.status.label}
              </p>
            </div>
          ))}
          <p className="term-muted term-gap">
            Run <span className="term-cmd">open 1</span> to view details.
          </p>
        </div>
      ),
    }),
  },
  {
    name: 'open',
    usage: 'open <n|code>',
    description: 'Open a project’s details',
    run: (args, actions) => {
      const project = args[0] ? findProject(args[0]) : undefined;
      if (!project) {
        return { error: true, output: `Usage: open <n|code>. Projects: ${projects.map((p, i) => `${i + 1}=${p.code}`).join(', ')}` };
      }
      actions.openProject(project.id);
      return { output: `Opening ${project.code} — ${project.title}…` };
    },
  },
  {
    name: 'journey',
    description: 'My development timeline',
    run: () => ({
      output: (
        <div>
          {journey
            .filter((j) => !j.placeholder)
            .map((j) => (
              <Row key={j.id} k={j.period || j.kind}>
                {j.title}
              </Row>
            ))}
        </div>
      ),
    }),
  },
  {
    name: 'contact',
    description: 'How to reach me',
    run: () => {
      const socials = configuredSocials();
      if (!hasEmail() && socials.length === 0) {
        return {
          output: (
            <p>
              Contact channels are being configured. Meanwhile, <span className="term-cmd">goto contact</span> shows what’s
              available.
            </p>
          ),
        };
      }
      return {
        output: (
          <div>
            {hasEmail() && <Row k="email">{profile.contact.email}</Row>}
            {socials.map((s) => (
              <Row key={s.id + s.url} k={s.label.toLowerCase()}>
                {s.url}
              </Row>
            ))}
          </div>
        ),
      };
    },
  },
  {
    name: 'resume',
    description: 'Résumé availability',
    run: () =>
      hasResume()
        ? { output: 'Résumé (PDF) is available — use “View My CV” in the About section, or the command palette.' }
        : { output: 'A downloadable résumé isn’t published yet.' },
  },
  {
    name: 'certs',
    description: 'Certifications & credentials',
    run: () => ({
      output: (
        <div>
          {certificates.map((c) => (
            <Row key={c.id} k={formatCertDate(c.date)}>
              {c.title} <span className="term-muted">— {c.issuer}</span>
            </Row>
          ))}
          <p className="term-muted term-gap">
            Run <span className="term-cmd">goto credentials</span> to see them.
          </p>
        </div>
      ),
    }),
  },
  {
    name: 'goto',
    usage: 'goto <section>',
    description: 'Scroll to a section',
    run: (args, actions) => {
      const target = args[0]?.toLowerCase() as SectionId | undefined;
      if (!target || !sectionIds.includes(target)) {
        return { error: true, output: `Usage: goto <${sectionIds.join('|')}>` };
      }
      actions.goto(target);
      return { output: `Navigating to #${target}…` };
    },
  },
  {
    name: 'history',
    description: 'Show command history',
    run: (_args, _actions, history) => ({
      output: history.length ? (
        <div>
          {history.map((h, i) => (
            <Row key={`${i}-${h}`} k={String(i + 1).padStart(3, ' ')}>
              {h}
            </Row>
          ))}
        </div>
      ) : (
        'No history yet.'
      ),
    }),
  },
  {
    name: 'date',
    description: 'Current date & time',
    run: () => ({ output: new Date().toString() }),
  },
  {
    name: 'echo',
    usage: 'echo <text>',
    description: 'Print text',
    run: (args) => ({ output: args.join(' ') }),
  },
  {
    name: 'clear',
    description: 'Clear the screen',
    run: () => ({ clear: true }),
  },
];

const HIDDEN: Record<string, CommandDef['run']> = {
  sudo: () => ({ error: true, output: 'Permission denied: this terminal runs in user mode. Nice try.' }),
  ls: () => ({ output: 'about/  skills/  projects/  journey/  contact/' }),
  exit: () => ({ output: 'There is no escape — but you can scroll down.' }),
};

export const commandNames = COMMANDS.map((c) => c.name);

export function runCommand(input: string, actions: TerminalActions, history: string[]): CommandOutput {
  const [rawName, ...args] = input.trim().split(/\s+/);
  const name = rawName.toLowerCase();
  const command = COMMANDS.find((c) => c.name === name);
  if (command) return command.run(args, actions, history);
  if (HIDDEN[name]) return HIDDEN[name](args, actions, history);
  return { error: true, output: `command not found: ${rawName}. Type "help" for a list of commands.` };
}

export function autocomplete(partial: string): string | null {
  const q = partial.trim().toLowerCase();
  if (!q || q.includes(' ')) {
    const [cmd, arg = ''] = q.split(/\s+/);
    if (cmd === 'goto') {
      const match = sectionIds.find((s) => s.startsWith(arg));
      return match ? `goto ${match}` : null;
    }
    return null;
  }
  const matches = commandNames.filter((n) => n.startsWith(q));
  return matches.length === 1 ? matches[0] : null;
}
