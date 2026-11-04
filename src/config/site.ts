/**
 * Public site address. This is the real Vercel production URL; if a custom
 * domain is connected later (see docs/CUSTOM_DOMAIN_SETUP.md), change it here
 * and in index.html, public/robots.txt and public/sitemap.xml.
 */
export const SITE_URL = 'https://satetapong-portfolio.vercel.app';

export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const absoluteUrl = (path: string) => `${SITE_URL}${path === '/' ? '/' : path}`;
