import { useEffect } from 'react';
import { absoluteUrl, OG_IMAGE } from '../../config/site';

interface DocumentMeta {
  title: string;
  description: string;
  /** Route path, e.g. "/projects/wavy-ide". Ignored for noindex pages. */
  path: string;
  type?: 'website' | 'article';
  /** Absolute share image; defaults to the site card. */
  image?: string;
  /** Error pages: robots noindex, and no canonical / og:url. */
  noindex?: boolean;
  /** Skip entirely (e.g. a page that is about to render the 404 instead). */
  disabled?: boolean;
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

const removeMeta = (attr: 'name' | 'property', key: string) => document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();

/**
 * Keeps <title>, description, canonical and the Open Graph / Twitter tags in
 * step with the current route after client-side navigation. The first load of
 * every route already has the same values in its prerendered HTML
 * (src/seo/routeMeta.ts → scripts/prerender.mjs).
 */
export function useDocumentMeta({ title, description, path, type = 'website', image = OG_IMAGE, noindex = false, disabled = false }: DocumentMeta) {
  useEffect(() => {
    if (disabled) return;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Route-specific JSON-LD from the prerendered HTML only describes the page it was rendered for.
    const routeLd = document.getElementById('route-ld');
    if (routeLd && routeLd.dataset.path !== path) routeLd.remove();

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (noindex) {
      canonical?.remove();
      removeMeta('property', 'og:url');
      setMeta('name', 'robots', 'noindex');
      return;
    }
    removeMeta('name', 'robots');
    const url = absoluteUrl(path);
    setMeta('property', 'og:url', url);
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, type, image, noindex, disabled]);
}
