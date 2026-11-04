/**
 * Public site address. This is the real Vercel production URL; if a custom
 * domain is connected later (see docs/CUSTOM_DOMAIN_SETUP.md), change it here
 * and in index.html and public/robots.txt; the prerendered pages and the
 * sitemap are generated from this value at build time.
 */
export const SITE_URL = 'https://satetapong-portfolio.vercel.app';

export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;

/** Share image for a project, built from its real cover screenshot by scripts/prerender.mjs. */
export const projectOgImagePath = (id: string) => `/og/projects/${id}.jpg`;
export const PROJECT_OG_SIZE = { width: 1200, height: 750 };
