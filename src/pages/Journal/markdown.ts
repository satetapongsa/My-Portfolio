/**
 * Markdown → HTML for journal articles (marked), plus a table of contents.
 * The content is first-party (files in this repository), so the HTML is
 * trusted; external links still open with rel="noopener noreferrer".
 */
import { Marked, type Tokens } from 'marked';

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Unicode-aware slug (keeps Thai letters and their combining marks). */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

export function renderMarkdown(source: string, newTabLabel = '(opens in a new tab)'): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const used = new Map<string, number>();

  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        const plain = inner.replace(/<[^>]+>/g, '');
        let id = slugify(plain) || `section-${toc.length + 1}`;
        const n = used.get(id) ?? 0;
        used.set(id, n + 1);
        if (n) id = `${id}-${n + 1}`;
        if (depth === 2 || depth === 3) toc.push({ id, text: plain, depth });
        return `<h${depth} id="${id}"><a class="md-anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return external
          ? `<a href="${escapeHtml(href)}"${t} target="_blank" rel="noopener noreferrer">${text}<span class="sr-only"> ${escapeHtml(newTabLabel)}</span></a>`
          : `<a href="${escapeHtml(href)}"${t}>${text}</a>`;
      },
      image({ href, title, text }: Tokens.Image) {
        const caption = title ? `<figcaption>${escapeHtml(title)}</figcaption>` : '';
        return `<figure class="md-figure"><img src="${escapeHtml(href)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async" />${caption}</figure>`;
      },
      code({ text, lang }: Tokens.Code) {
        const language = (lang ?? '').split(/\s/)[0];
        const label = language ? `<span class="md-code__lang">${escapeHtml(language)}</span>` : '';
        return `<div class="md-code">${label}<pre tabindex="0"><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(text)}</code></pre></div>`;
      },
    },
  });

  const html = (marked.parse(source, { async: false }) as string)
    // Wide tables scroll inside their own box instead of the page.
    .replace(/<table>/g, '<div class="md-table" tabindex="0"><table>')
    .replace(/<\/table>/g, '</table></div>');

  return { html, toc };
}
