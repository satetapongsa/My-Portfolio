/**
 * Writes public/sitemap.xml from the real routes: the home page, the lab, the
 * journal and every published article (src/content/journal/<slug>/), and a
 * case study per project id in src/data/projects.ts. Runs before every build
 * so the sitemap can't drift from the content.
 */
import fs from 'node:fs';

const SITE = 'https://satetapong-portfolio.vercel.app';

const projectIds = [...fs.readFileSync('src/data/projects.ts', 'utf8').matchAll(/^\s{4}id: '([a-z0-9-]+)',$/gm)].map((m) => m[1]);

const articleSlugs = fs
  .readdirSync('src/content/journal', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .filter((d) => {
    // Published = has an English or Thai file without `status: draft`.
    const dir = `src/content/journal/${d.name}`;
    return fs.readdirSync(dir).some((f) => /^(en|th)\.md$/.test(f) && !/^status:\s*draft\s*$/m.test(fs.readFileSync(`${dir}/${f}`, 'utf8')));
  })
  .map((d) => d.name);

const urls = [
  { path: '/', priority: '1.0' },
  ...projectIds.map((id) => ({ path: `/projects/${id}`, priority: '0.8' })),
  { path: '/journal', priority: '0.7' },
  ...articleSlugs.map((slug) => ({ path: `/journal/${slug}`, priority: '0.6' })),
  { path: '/lab', priority: '0.6' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${SITE}${u.path}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`sitemap.xml: ${urls.length} URLs (${projectIds.length} case studies, ${articleSlugs.length} articles)`);
