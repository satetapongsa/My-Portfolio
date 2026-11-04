/**
 * Post-build static generation (runs after `vite build`).
 *
 * The site is a client-rendered SPA, but every valid URL now gets its own
 * real HTML file with that page's title, description, canonical, Open Graph /
 * Twitter tags, JSON-LD and <noscript> text, taken from src/seo/routeMeta.ts.
 * Vercel serves these files directly (cleanUrls) and serves dist/404.html with
 * a genuine HTTP 404 for anything else — there is no catch-all rewrite.
 *
 * Also writes:
 *   dist/404.html               noindex, no canonical
 *   dist/sitemap.xml            exactly the prerendered routes
 *   dist/og/projects/<id>.jpg   1200×750 share images from each project's real cover screenshot
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { createServer } from 'vite';

const DIST = 'dist';

const vite = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom', logLevel: 'error' });
let routeMeta, site, data;
try {
  routeMeta = await vite.ssrLoadModule('/src/seo/routeMeta.ts');
  site = await vite.ssrLoadModule('/src/config/site.ts');
  data = await vite.ssrLoadModule('/src/data/projects.ts');
} finally {
  await vite.close();
}

const { getRouteMetas, notFoundMeta } = routeMeta;
const { SITE_URL, absoluteUrl, projectOgImagePath, PROJECT_OG_SIZE } = site;
const metas = getRouteMetas();

// ── Validation: fail the build instead of shipping bad metadata ──
const problems = [];
const seen = (key) => {
  const set = new Set();
  for (const m of metas) {
    if (!m[key]?.trim()) problems.push(`${m.path}: empty ${key}`);
    if (set.has(m[key])) problems.push(`duplicate ${key}: ${m[key]}`);
    set.add(m[key]);
  }
};
seen('path');
seen('title');
seen('description');
for (const m of metas) if (m.path !== '/' && m.path.endsWith('/')) problems.push(`${m.path}: trailing slash`);
if (problems.length) {
  console.error('prerender: metadata problems\n  ' + problems.join('\n  '));
  process.exit(1);
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: template is missing ${label}`);
  return html.replace(pattern, replacement);
}
const setMetaTag = (html, attr, key, value) =>
  replaceOnce(html, new RegExp(`(<meta ${attr}="${key.replace(/:/g, '\\:')}" content=")[^"]*(")`), `$1${esc(value)}$2`, `${attr}=${key}`);

function noscriptBlock(heading, text) {
  return `<noscript>
      <h1>${esc(heading)}</h1>
      <p>${esc(text)}</p>
      <p><a href="/">Satetapong Sanguansuk — Computer Engineering Student &amp; Developer</a> · <a href="https://github.com/satetapongsa">GitHub</a></p>
      <p>This site needs JavaScript for the full interface.</p>
    </noscript>`;
}

function renderRoute(m) {
  const url = absoluteUrl(m.path);
  let html = template;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`, '<title>');
  html = setMetaTag(html, 'name', 'description', m.description);
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`, 'canonical');
  html = setMetaTag(html, 'property', 'og:type', m.type);
  html = setMetaTag(html, 'property', 'og:url', url);
  html = setMetaTag(html, 'property', 'og:title', m.title);
  html = setMetaTag(html, 'property', 'og:description', m.description);
  html = setMetaTag(html, 'property', 'og:image', m.image.url);
  html = setMetaTag(html, 'property', 'og:image:type', m.image.url.endsWith('.jpg') ? 'image/jpeg' : 'image/png');
  html = setMetaTag(html, 'property', 'og:image:width', m.image.width);
  html = setMetaTag(html, 'property', 'og:image:height', m.image.height);
  html = setMetaTag(html, 'property', 'og:image:alt', m.image.alt);
  html = setMetaTag(html, 'name', 'twitter:title', m.title);
  html = setMetaTag(html, 'name', 'twitter:description', m.description);
  html = setMetaTag(html, 'name', 'twitter:image', m.image.url);
  html = setMetaTag(html, 'name', 'twitter:image:alt', m.image.alt);
  if (m.jsonLd) {
    const ld = JSON.stringify(m.jsonLd).replace(/</g, '\\u003c');
    html = html.replace('</head>', `    <script type="application/ld+json" id="route-ld" data-path="${esc(m.path)}">${ld}</script>\n  </head>`);
  }
  html = replaceOnce(html, /<noscript>[\s\S]*?<\/noscript>/, noscriptBlock(m.noscript.heading, m.noscript.text), '<noscript>');
  return html;
}

function render404() {
  let html = template;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(notFoundMeta.title)}</title>`, '<title>');
  html = setMetaTag(html, 'name', 'description', notFoundMeta.description);
  // Not indexable: no canonical, no og:url, explicit noindex.
  html = replaceOnce(html, /\s*<link rel="canonical" href="[^"]*" \/>/, '\n    <meta name="robots" content="noindex" />', 'canonical');
  html = replaceOnce(html, /\s*<meta property="og:url" content="[^"]*" \/>/, '', 'og:url');
  html = setMetaTag(html, 'property', 'og:title', notFoundMeta.title);
  html = setMetaTag(html, 'property', 'og:description', notFoundMeta.description);
  html = setMetaTag(html, 'name', 'twitter:title', notFoundMeta.title);
  html = setMetaTag(html, 'name', 'twitter:description', notFoundMeta.description);
  html = replaceOnce(html, /<noscript>[\s\S]*?<\/noscript>/, noscriptBlock('404 — Page Not Found', notFoundMeta.description), '<noscript>');
  return html;
}

// ── Route files ──
const fileFor = (p) => (p === '/' ? 'index.html' : `${p.slice(1)}.html`);
for (const m of metas) {
  const file = path.join(DIST, fileFor(m.path));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, renderRoute(m));
}
fs.writeFileSync(path.join(DIST, '404.html'), render404());

// ── Project share images from the real cover screenshots ──
let images = 0;
for (const p of data.projects) {
  if (!p.cover) continue;
  const source = path.join(DIST, decodeURI(p.cover.src).replace(/^\/+/, ''));
  const out = path.join(DIST, projectOgImagePath(p.id).slice(1));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await sharp(source).resize(PROJECT_OG_SIZE.width, PROJECT_OG_SIZE.height, { fit: 'cover', position: 'top' }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  images++;
}

// ── Sitemap: exactly the prerendered, indexable routes ──
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${metas.map((m) => `  <url>\n    <loc>${esc(absoluteUrl(m.path))}</loc>${m.lastmod ? `\n    <lastmod>${m.lastmod}</lastmod>` : ''}\n  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// ── Final guard: nothing may point at localhost or a preview domain ──
for (const f of [...metas.map((m) => fileFor(m.path)), '404.html', 'sitemap.xml']) {
  const text = fs.readFileSync(path.join(DIST, f), 'utf8');
  if (/localhost|127\.0\.0\.1|-git-|\.vercel\.app/.test(text.replaceAll(SITE_URL, ''))) {
    console.error(`prerender: ${f} references a non-production host`);
    process.exit(1);
  }
}

console.log(`prerender: ${metas.length} routes + 404.html, ${images} project share images, sitemap with ${metas.length} URLs`);
