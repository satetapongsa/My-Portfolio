/**
 * Single source of truth for every indexable route's metadata.
 *
 * - The build (scripts/prerender.mjs) loads this module through Vite and
 *   writes one real HTML file per route with this title, description,
 *   canonical, Open Graph / Twitter tags and JSON-LD — so crawlers that don't
 *   run JavaScript still see correct, unique metadata.
 * - The sitemap is generated from the same list, so a URL can only be in the
 *   sitemap if it has a prerendered page.
 * - Client pages build their titles from the same strings (useDocumentMeta),
 *   so the static and rendered metadata agree.
 *
 * Static HTML is English (the default language). Thai is a client-side
 * preference on the same URL, so there are no separate hreflang URLs.
 */
import { caseStudies, languageSnapshot } from '../data/caseStudies';
import { getArticles } from '../data/journal';
import { projects } from '../data/projects';
import { documentTitles, homeDescriptions } from '../i18n/content';
import { labStrings } from '../pages/DeveloperLab/strings';
import { journalStrings } from '../pages/Journal/strings';
import { caseStudyStrings } from '../pages/ProjectCaseStudy/strings';
import { absoluteUrl, OG_IMAGE, PROJECT_OG_SIZE, projectOgImagePath, SITE_URL } from '../config/site';

export interface RouteMeta {
  /** Canonical path without trailing slash ("/" for home). */
  path: string;
  title: string;
  description: string;
  type: 'website' | 'article';
  image: { url: string; width: number; height: number; alt: string };
  /** Route-specific JSON-LD (the Person/WebSite graph is on every page already). */
  jsonLd?: Record<string, unknown>;
  /** Visible text for <noscript>, so non-JS readers get the page's gist. */
  noscript: { heading: string; text: string };
  /** ISO date — only where a real date is known (article publication). */
  lastmod?: string;
}

const PERSON_ID = `${SITE_URL}/#person`;
const DEFAULT_IMAGE = { url: OG_IMAGE, width: 1200, height: 630, alt: 'Satetapong Sanguansuk — Wave — Computer Engineering Student & Developer' };


const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absoluteUrl(item.path) })),
});

export function getRouteMetas(): RouteMeta[] {
  const lab = labStrings.en;
  const journal = journalStrings.en;
  const cs = caseStudyStrings.en;

  const home: RouteMeta = {
    path: '/',
    title: documentTitles.en,
    description: homeDescriptions.en,
    type: 'website',
    image: DEFAULT_IMAGE,
    noscript: { heading: 'Satetapong Sanguansuk (Wave)', text: homeDescriptions.en },
  };

  const projectPages: RouteMeta[] = projects.map((p) => {
    const path = `/projects/${p.id}`;
    const study = caseStudies[p.id]?.en;
    const image = p.cover
      ? { url: absoluteUrl(projectOgImagePath(p.id)), ...PROJECT_OG_SIZE, alt: p.cover.alt }
      : DEFAULT_IMAGE;
    // Team projects credit me as a contributor, not as the sole author.
    const credit = study?.role ? { contributor: { '@id': PERSON_ID } } : { author: { '@id': PERSON_ID } };
    return {
      path,
      title: `${p.title} — ${cs.metaSuffix}`,
      description: p.summary,
      type: 'article',
      image,
      noscript: { heading: p.title, text: p.summary },
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareSourceCode',
            '@id': `${absoluteUrl(path)}#project`,
            name: p.title,
            ...(p.subtitle ? { alternateName: p.subtitle } : {}),
            description: p.summary,
            url: absoluteUrl(path),
            codeRepository: p.links.github.url,
            programmingLanguage: (languageSnapshot[p.id] ?? []).filter((l) => l.share >= 1).map((l) => l.name),
            ...(p.cover ? { image: image.url } : {}),
            ...credit,
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Projects', path: '/#projects' },
            { name: p.title, path },
          ]),
        ],
      },
    };
  });

  const articles = getArticles('en');
  const journalIndex: RouteMeta = {
    path: '/journal',
    title: journal.metaTitle,
    description: journal.metaDescription,
    type: 'website',
    image: DEFAULT_IMAGE,
    noscript: { heading: journal.label, text: journal.metaDescription },
  };

  const articlePages: RouteMeta[] = articles.map((a) => {
    const path = `/journal/${a.slug}`;
    return {
      path,
      title: `${a.title} · ${journal.articleSuffix}`,
      description: a.description,
      type: 'article',
      image: DEFAULT_IMAGE,
      lastmod: a.date,
      noscript: { heading: a.title, text: a.description },
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'BlogPosting',
            '@id': `${absoluteUrl(path)}#article`,
            headline: a.title,
            description: a.description,
            datePublished: a.date,
            inLanguage: a.available,
            keywords: a.tags.join(', '),
            articleSection: a.category,
            mainEntityOfPage: absoluteUrl(path),
            url: absoluteUrl(path),
            image: DEFAULT_IMAGE.url,
            author: { '@id': PERSON_ID },
            publisher: { '@id': PERSON_ID },
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Journal', path: '/journal' },
            { name: a.title, path },
          ]),
        ],
      },
    };
  });

  const labPage: RouteMeta = {
    path: '/lab',
    title: lab.metaTitle,
    description: lab.metaDescription,
    type: 'website',
    image: DEFAULT_IMAGE,
    noscript: { heading: lab.label, text: lab.metaDescription },
  };

  return [home, ...projectPages, journalIndex, ...articlePages, labPage];
}

/** The 404 document: not indexable, no canonical. */
export const notFoundMeta = {
  title: '404 — Page Not Found · Satetapong Sanguansuk (Wave)',
  description: "The page you're looking for doesn't exist or may have been moved.",
};
