import type { ReactNode } from 'react';
import { formatCertDate } from '../../data/certificates';
import { visibleSkills } from '../../data/skills';
import type { SectionId } from '../../data/types';
import type { Content } from '../../i18n/content';
import type { Lang } from '../../i18n/lang';
import { fill, type UIStrings } from '../../i18n/ui';
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

/** Everything a command needs: page actions plus the active language's strings and content. */
export interface CommandContext {
  actions: TerminalActions;
  history: string[];
  t: UIStrings;
  content: Content;
  lang: Lang;
}

interface CommandDef {
  name: keyof UIStrings['terminal']['desc'];
  usage?: string;
  run: (args: string[], ctx: CommandContext) => CommandOutput;
}

const Row = ({ k, children }: { k: string; children: ReactNode }) => (
  <div className="term-row">
    <span className="term-key">{k}</span>
    <span>{children}</span>
  </div>
);

const Cmd = ({ children }: { children: ReactNode }) => <span className="term-cmd">{children}</span>;

/** Renders a translated template with a highlighted command in place of {cmd}. */
function withCmd(template: string, cmd: string): ReactNode {
  const [before, after = ''] = template.split('{cmd}');
  return (
    <>
      {before}
      <Cmd>{cmd}</Cmd>
      {after}
    </>
  );
}

const sectionIdsOf = (content: Content) => content.navItems.map((n) => n.id);

const COMMANDS: CommandDef[] = [
  {
    name: 'help',
    run: (_args, { t }) => ({
      output: (
        <div className="term-help">
          {COMMANDS.map((c) => (
            <div key={c.name} className="term-row">
              <span className="term-cmd">{c.usage ?? c.name}</span>
              <span className="term-muted">{t.terminal.desc[c.name]}</span>
            </div>
          ))}
          <p className="term-muted term-gap">{t.terminal.tip}</p>
        </div>
      ),
    }),
  },
  {
    name: 'about',
    run: (_args, { content: { profile } }) => ({
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
    run: (_args, { content: { profile } }) => ({ output: `${profile.fullName} (${profile.nickname}) · ${profile.role}` }),
  },
  {
    name: 'education',
    run: (_args, { t, content: { profile } }) => ({
      output: (
        <div>
          <Row k={t.about.spec.field}>{profile.education.field}</Row>
          <Row k={t.about.spec.university}>{profile.education.university}</Row>
          <Row k={t.about.spec.campus}>{profile.education.campus}</Row>
          {profile.education.period && <Row k={t.about.spec.period}>{profile.education.period}</Row>}
        </div>
      ),
    }),
  },
  {
    name: 'skills',
    usage: 'skills [category]',
    run: (args, { t, content }) => {
      const query = args.join(' ').toLowerCase();
      const categories = content.skillCategories.filter((c) => visibleSkills(c).length > 0);
      const matched = query ? categories.filter((c) => c.id.includes(query) || c.title.toLowerCase().includes(query)) : categories;
      if (matched.length === 0) {
        return { error: true, output: fill(t.terminal.noSkills, { query, options: categories.map((c) => c.id).join(', ') }) };
      }
      return {
        output: (
          <div>
            {matched.map((c) => (
              <div key={c.id} className="term-block">
                <p className="term-accent">▸ {c.title}</p>
                {visibleSkills(c).map((s) => (
                  <Row key={s.name} k={`  ${s.name}`}>
                    <span className="term-muted">[{s.level ? t.skills.levels[s.level] : t.skills.resumeTag}]</span>
                  </Row>
                ))}
              </div>
            ))}
            <p className="term-muted term-gap">{t.terminal.skillsFoot}</p>
          </div>
        ),
      };
    },
  },
  {
    name: 'projects',
    run: (_args, { t, content }) => ({
      output: (
        <div>
          {content.projects.map((p) => (
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
          <p className="term-muted term-gap">{withCmd(t.terminal.projectsFoot, 'open 1')}</p>
        </div>
      ),
    }),
  },
  {
    name: 'open',
    usage: 'open <n|code>',
    run: (args, { t, content, actions }) => {
      const { projects } = content;
      const q = (args[0] ?? '').toLowerCase();
      const index = Number.parseInt(q.replace(/^prj-?/, ''), 10);
      const project = q ? (projects.find((p) => p.id === q || p.code.toLowerCase() === q) ?? (Number.isFinite(index) ? projects[index - 1] : undefined)) : undefined;
      if (!project) {
        return { error: true, output: fill(t.terminal.openUsage, { list: projects.map((p, i) => `${i + 1}=${p.code}`).join(', ') }) };
      }
      actions.openProject(project.id);
      return { output: fill(t.terminal.opening, { code: project.code, title: project.title }) };
    },
  },
  {
    name: 'journey',
    run: (_args, { t, content }) => ({
      output: (
        <div>
          {content.journey
            .filter((j) => !j.placeholder)
            .map((j) => (
              <Row key={j.id} k={j.period || t.journey.kinds[j.kind]}>
                {j.title}
              </Row>
            ))}
        </div>
      ),
    }),
  },
  {
    name: 'contact',
    run: (_args, { t, content: { profile } }) => {
      const socials = configuredSocials();
      if (!hasEmail() && socials.length === 0) {
        return { output: <p>{withCmd(t.terminal.contactPending, 'goto contact')}</p> };
      }
      return {
        output: (
          <div>
            {hasEmail() && <Row k={t.contact.email}>{profile.contact.email}</Row>}
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
    run: (_args, { t }) => ({ output: hasResume() ? t.terminal.resumeYes : t.terminal.resumeNo }),
  },
  {
    name: 'certs',
    run: (_args, { t, content, lang }) => ({
      output: (
        <div>
          {content.certificates.map((c) => (
            <Row key={c.id} k={formatCertDate(c.date, lang)}>
              {c.title} <span className="term-muted">— {c.issuer}</span>
            </Row>
          ))}
          <p className="term-muted term-gap">{withCmd(t.terminal.certsFoot, 'goto credentials')}</p>
        </div>
      ),
    }),
  },
  {
    name: 'goto',
    usage: 'goto <section>',
    run: (args, { t, content, actions }) => {
      const sectionIds = sectionIdsOf(content);
      const target = args[0]?.toLowerCase() as SectionId | undefined;
      if (!target || !sectionIds.includes(target)) {
        return { error: true, output: fill(t.terminal.gotoUsage, { sections: sectionIds.join('|') }) };
      }
      actions.goto(target);
      return { output: fill(t.terminal.navigating, { section: target }) };
    },
  },
  {
    name: 'history',
    run: (_args, { t, history }) => ({
      output: history.length ? (
        <div>
          {history.map((h, i) => (
            <Row key={`${i}-${h}`} k={String(i + 1).padStart(3, ' ')}>
              {h}
            </Row>
          ))}
        </div>
      ) : (
        t.terminal.noHistory
      ),
    }),
  },
  {
    name: 'date',
    run: (_args, { lang }) => ({ output: new Date().toLocaleString(lang === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'full', timeStyle: 'medium' }) }),
  },
  {
    name: 'echo',
    usage: 'echo <text>',
    run: (args) => ({ output: args.join(' ') }),
  },
  {
    name: 'clear',
    run: () => ({ clear: true }),
  },
];

const HIDDEN: Record<string, CommandDef['run']> = {
  sudo: (_args, { t }) => ({ error: true, output: t.terminal.sudo }),
  ls: () => ({ output: 'about/  skills/  projects/  journey/  credentials/  contact/' }),
  exit: (_args, { t }) => ({ output: t.terminal.exit }),
};

export const commandNames = COMMANDS.map((c) => c.name);

export function runCommand(input: string, ctx: CommandContext): CommandOutput {
  const [rawName, ...args] = input.trim().split(/\s+/);
  const name = rawName.toLowerCase();
  const command = COMMANDS.find((c) => c.name === name);
  if (command) return command.run(args, ctx);
  if (HIDDEN[name]) return HIDDEN[name](args, ctx);
  return { error: true, output: fill(ctx.t.terminal.notFound, { cmd: rawName }) };
}

export function autocomplete(partial: string, content: Content): string | null {
  const q = partial.trim().toLowerCase();
  if (!q || q.includes(' ')) {
    const [cmd, arg = ''] = q.split(/\s+/);
    if (cmd === 'goto') {
      const match = sectionIdsOf(content).find((s) => s.startsWith(arg));
      return match ? `goto ${match}` : null;
    }
    return null;
  }
  const matches = commandNames.filter((n) => n.startsWith(q));
  return matches.length === 1 ? matches[0] : null;
}
