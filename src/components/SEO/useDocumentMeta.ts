import { useEffect } from 'react';
import { absoluteUrl } from '../../config/site';

interface DocumentMeta {
  title: string;
  description: string;
  /** Route path, e.g. "/projects/wavy-ide". */
  path: string;
  type?: 'website' | 'article';
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

/**
 * Keeps <title>, description, canonical and the Open Graph / Twitter tags in
 * step with the current route. index.html carries the home-page defaults for
 * crawlers that do not run JavaScript.
 */
export function useDocumentMeta({ title, description, path, type = 'website' }: DocumentMeta) {
  useEffect(() => {
    const url = absoluteUrl(path);
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, type]);
}
