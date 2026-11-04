/**
 * Engineering Journal content loader.
 *
 * Articles live in src/content/journal/<slug>/<lang>.md with a small YAML-like
 * frontmatter block. Only that folder is bundled — drafts stay in
 * src/content/journal-drafts/ and never reach the site. A file whose
 * frontmatter says `status: draft` is skipped as a second safeguard.
 *
 * An article may exist in English only; Thai readers then get the English
 * text with a notice, never a machine-made translation.
 */
import type { Lang } from '../i18n/lang';

const files = import.meta.glob('../content/journal/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface ArticleMeta {
  slug: string;
  /** Language of this version. */
  lang: Lang;
  title: string;
  description: string;
  /** ISO publication date. */
  date: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  cover?: { src: string; alt: string };
}

export interface Article extends ArticleMeta {
  body: string;
  /** Languages this article is available in. */
  available: Lang[];
}

function parse(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

/** ~220 words a minute for English; Thai has no spaces, so count characters (~650 a minute). */
function readingMinutes(body: string, lang: Lang) {
  const prose = body.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`|-]/g, ' ');
  const units = lang === 'th' ? prose.replace(/\s+/g, '').length / 650 : prose.split(/\s+/).filter(Boolean).length / 220;
  return Math.max(1, Math.round(units));
}

const bySlug = new Map<string, Partial<Record<Lang, Omit<Article, 'available'>>>>();

for (const [path, raw] of Object.entries(files)) {
  const m = /journal\/([a-z0-9-]+)\/(en|th)\.md$/.exec(path);
  if (!m) continue;
  const [, slug, lang] = m as unknown as [string, string, Lang];
  const { meta, body } = parse(raw);
  if (meta.status === 'draft' || !meta.title || !meta.date) continue;
  const entry = bySlug.get(slug) ?? {};
  entry[lang] = {
    slug,
    lang,
    title: meta.title,
    description: meta.description ?? '',
    date: meta.date,
    category: meta.category ?? 'Development Notes',
    tags: (meta.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    readingMinutes: readingMinutes(body, lang),
    cover: meta.cover ? { src: meta.cover, alt: meta.coverAlt ?? '' } : undefined,
    body,
  };
  bySlug.set(slug, entry);
}

function resolve(slug: string, lang: Lang): Article | null {
  const entry = bySlug.get(slug);
  if (!entry) return null;
  const version = entry[lang] ?? entry.en ?? entry.th;
  if (!version) return null;
  return { ...version, available: (['en', 'th'] as Lang[]).filter((l) => entry[l]) };
}

/** Published articles, newest first, in the requested language where available. */
export function getArticles(lang: Lang): Article[] {
  return [...bySlug.keys()]
    .map((slug) => resolve(slug, lang))
    .filter((a): a is Article => a !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export const getArticle = (slug: string, lang: Lang) => resolve(slug, lang);

export const articleSlugs = () => [...bySlug.keys()];

/** Category labels in Thai (categories are stored in English in the frontmatter). */
export const categoryTh: Record<string, string> = {
  'Software Engineering': 'วิศวกรรมซอฟต์แวร์',
  'Web Development': 'การพัฒนาเว็บ',
  Programming: 'การเขียนโปรแกรม',
  'Computer Engineering': 'วิศวกรรมคอมพิวเตอร์',
  'Industrial Automation': 'ระบบอัตโนมัติในอุตสาหกรรม',
  'Unreal Engine': 'Unreal Engine',
  'Development Notes': 'บันทึกการพัฒนา',
};
