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

export type ContactErrors = Partial<Record<keyof ContactMessage, string>>;

export type SendResult =
  | { ok: true; mode: 'endpoint' | 'mailto' }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getDeliveryMode(): DeliveryMode {
  if (isConfigured(profile.contact.formEndpoint)) return 'endpoint';
  if (isConfigured(profile.contact.email)) return 'mailto';
  return 'unavailable';
}

export function validateContact(data: ContactMessage): ContactErrors {
  const errors: ContactErrors = {};
  if (data.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!EMAIL_PATTERN.test(data.email.trim())) errors.email = 'Please enter a valid email address.';
  if (data.message.trim().length < 10) errors.message = 'Please write a message of at least 10 characters.';
  else if (data.message.length > 4000) errors.message = 'Please keep the message under 4000 characters.';
  return errors;
}

export async function sendContactMessage(data: ContactMessage): Promise<SendResult> {
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
      if (!response.ok) return { ok: false, error: `The server responded with ${response.status}. Please try again later.` };
      return { ok: true, mode };
    } catch {
      return { ok: false, error: 'The message could not be sent. Check your connection and try again.' };
    } finally {
      window.clearTimeout(timeout);
    }
  }

  if (mode === 'mailto') {
    const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`);
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
    window.location.href = `mailto:${profile.contact.email}?subject=${subject}&body=${body}`;
    return { ok: true, mode };
  }

  return { ok: false, error: 'Messaging is not configured yet.' };
}
