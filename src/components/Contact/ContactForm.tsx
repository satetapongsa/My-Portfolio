import { CircleAlert, LoaderCircle, Send } from 'lucide-react';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { fill } from '../../i18n/ui';
import { getDeliveryMode, sendContactMessage, validateContact, type ContactErrors, type ContactMessage, type SendResult } from '../../services/contact';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; mode: 'endpoint' | 'mailto' }
  | { state: 'error'; result: Extract<SendResult, { ok: false }> };

const EMPTY: ContactMessage = { name: '', email: '', message: '' };

export function ContactForm() {
  const { t } = useI18n();
  const f = t.contact.form;
  const mode = getDeliveryMode();
  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactMessage, boolean>>>({});
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const uid = useId();

  const field = (name: keyof ContactMessage) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    'aria-invalid': Boolean(touched[name] && errors[name]),
    'aria-describedby': touched[name] && errors[name] ? `${uid}-${name}-error` : undefined,
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = { ...values, [name]: event.target.value };
      setValues(next);
      if (touched[name]) setErrors(validateContact(next));
    },
    onBlur: () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors(validateContact(values));
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = (Object.keys(found) as (keyof ContactMessage)[])[0];
    if (firstInvalid) {
      document.getElementById(`${uid}-${firstInvalid}`)?.focus();
      return;
    }
    setStatus({ state: 'sending' });
    const result = await sendContactMessage(values, fill(f.subject, { name: values.name.trim() }));
    if (result.ok) {
      setStatus({ state: 'sent', mode: result.mode });
      if (result.mode === 'endpoint') {
        setValues(EMPTY);
        setTouched({});
      }
    } else {
      setStatus({ state: 'error', result });
    }
  };

  const errorText = (result: Extract<SendResult, { ok: false }>) =>
    result.error === 'server' ? fill(f.errors.server, { status: result.status }) : f.errors[result.error];

  const renderError = (name: keyof ContactMessage) => {
    const code = errors[name];
    return touched[name] && code ? (
      <p id={`${uid}-${name}-error`} className="form-field__error">
        <CircleAlert aria-hidden /> {f.errors[code]}
      </p>
    ) : null;
  };

  const disabled = mode === 'unavailable' || status.state === 'sending';

  return (
    <form className="contact-form glow-card" onSubmit={onSubmit} noValidate aria-describedby={`${uid}-mode`}>
      <div className="contact-form__head">
        <h3>{f.title}</h3>
        <p id={`${uid}-mode`} className="contact-form__mode mono">
          {mode === 'endpoint' && f.modeEndpoint}
          {mode === 'mailto' && f.modeMailto}
          {mode === 'unavailable' && f.modeUnavailable}
        </p>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${uid}-name`}>{f.name}</label>
          <input type="text" autoComplete="name" placeholder={f.namePlaceholder} disabled={mode === 'unavailable'} {...field('name')} />
          {renderError('name')}
        </div>
        <div className="form-field">
          <label htmlFor={`${uid}-email`}>{f.email}</label>
          <input type="email" autoComplete="email" inputMode="email" placeholder={f.emailPlaceholder} disabled={mode === 'unavailable'} {...field('email')} />
          {renderError('email')}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`${uid}-message`}>{f.message}</label>
        <textarea rows={5} placeholder={f.messagePlaceholder} disabled={mode === 'unavailable'} {...field('message')} />
        {renderError('message')}
      </div>

      <div className="contact-form__footer">
        <button type="submit" className="btn btn--primary" disabled={disabled}>
          {status.state === 'sending' ? (
            <>
              <LoaderCircle className="spin" aria-hidden /> {f.sending}
            </>
          ) : (
            <>
              {mode === 'mailto' ? f.compose : f.send} <Send aria-hidden />
            </>
          )}
        </button>

        <div className="contact-form__status" role="status" aria-live="polite">
          {status.state === 'sent' && status.mode === 'endpoint' && <p className="is-success">{f.sent}</p>}
          {status.state === 'sent' && status.mode === 'mailto' && <p className="is-info">{f.mailtoOpened}</p>}
          {status.state === 'error' && <p className="is-error">{errorText(status.result)}</p>}
        </div>
      </div>
    </form>
  );
}
