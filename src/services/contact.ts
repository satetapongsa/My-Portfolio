/**
 * Contact delivery. Three honest modes:
 *  - 'endpoint'    POST JSON to profile.contact.formEndpoint (Formspree, your API, …)
 *  - 'mailto'      open the visitor's email app with the message pre-filled
 *  - 'unavailable' nothing configured — the form explains this instead of faking success
 */
import { profile } from '../data/portfolio';
import { isConfigured } from '../utils/links';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export type DeliveryMode = 'endpoint' | 'mailto' | 'unavailable';

/** Error codes, localised by the UI (see contact.form.errors in src/i18n/ui.ts). */
export type ValidationError = 'name' | 'email' | 'messageShort' | 'messageLong';
export type ContactErrors = Partial<Record<keyof ContactMessage, ValidationError>>;

export type SendResult =
  | { ok: true; mode: 'endpoint' | 'mailto' }
  | { ok: false; error: 'server'; status: number }
  | { ok: false; error: 'network' | 'unavailable' };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getDeliveryMode(): DeliveryMode {
  if (isConfigured(profile.contact.formEndpoint)) return 'endpoint';
  if (isConfigured(profile.contact.email)) return 'mailto';
  return 'unavailable';
}

export function validateContact(data: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};
  if (data.name.trim().length < 2) errors.name = 'name';
  if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = 'email';
  if (data.message.trim().length < 10) errors.message = 'messageShort';
  else if (data.message.length > 4000) errors.message = 'messageLong';
  return errors;
}

/** `subject` is the already-localised mail subject (used for the mailto fallback). */
export async function sendContactMessage(data: ContactMessage, subject: string): Promise<SendResult> {
  const mode = getDeliveryMode();
  const payload = { name: data.name.trim(), email: data.email.trim(), message: data.message.trim() };

  if (mode === 'endpoint') {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(profile.contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) return { ok: false, error: 'server', status: response.status };
      return { ok: true, mode };
    } catch {
      return { ok: false, error: 'network' };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  if (mode === 'mailto') {
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
    window.location.href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    return { ok: true, mode };
  }

  return { ok: false, error: 'unavailable' };
}
