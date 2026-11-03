import { profile } from '../data/portfolio';
import type { SectionId, SocialLink } from '../data/types';

/** Content fields use '' for "not configured yet". */
export const isConfigured = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const configuredSocials = (): SocialLink[] => profile.socials.filter((s) => isConfigured(s.url));

export const getSocial = (id: SocialLink['id']) => profile.socials.find((s) => s.id === id && isConfigured(s.url));

export const hasEmail = () => isConfigured(profile.contact.email);

export const hasResume = () => isConfigured(profile.resumePath);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth-scrolls to a section and keeps the URL hash in sync without jumping. */
export function scrollToSection(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', id === 'home' ? window.location.pathname + window.location.search : `#${id}`);
}

export function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** Clipboard API with a textarea fallback for older/insecure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}
