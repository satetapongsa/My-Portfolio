import { CircleAlert, LoaderCircle, Send } from 'lucide-react';
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { getDeliveryMode, sendContactMessage, validateContact, type ContactErrors, type ContactMessage } from '../../services/contact';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'sent'; mode: 'endpoint' | 'mailto' }
  | { state: 'error'; message: string };

const EMPTY: ContactMessage = { name: '', email: '', message: '' };

export function ContactForm() {
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
      setTouched((t) => ({ ...t, [name]: true }));
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
    const result = await sendContactMessage(values);
    if (result.ok) {
      setStatus({ state: 'sent', mode: result.mode });
      if (result.mode === 'endpoint') {
        setValues(EMPTY);
        setTouched({});
      }
    } else {
      setStatus({ state: 'error', message: result.error });
    }
  };

  const renderError = (name: keyof ContactMessage) =>
    touched[name] && errors[name] ? (
      <p id={`${uid}-${name}-error`} className="form-field__error">
        <CircleAlert aria-hidden /> {errors[name]}
      </p>
    ) : null;

  const disabled = mode === 'unavailable' || status.state === 'sending';

  return (
    <form className="contact-form glow-card" onSubmit={onSubmit} noValidate aria-describedby={`${uid}-mode`}>
      <div className="contact-form__head">
        <h3>Send a message</h3>
        <p id={`${uid}-mode`} className="contact-form__mode mono">
          {mode === 'endpoint' && 'Delivered directly to my inbox.'}
          {mode === 'mailto' && 'Opens your email app with the message drafted.'}
          {mode === 'unavailable' && 'The contact form activates once an email or form endpoint is configured.'}
        </p>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`${uid}-name`}>Name</label>
          <input type="text" autoComplete="name" placeholder="Your name" disabled={mode === 'unavailable'} {...field('name')} />
          {renderError('name')}
        </div>
        <div className="form-field">
          <label htmlFor={`${uid}-email`}>Email</label>
          <input type="email" autoComplete="email" inputMode="email" placeholder="you@domain.com" disabled={mode === 'unavailable'} {...field('email')} />
          {renderError('email')}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`${uid}-message`}>Message</label>
        <textarea rows={5} placeholder="What would you like to talk about?" disabled={mode === 'unavailable'} {...field('message')} />
        {renderError('message')}
      </div>

      <div className="contact-form__footer">
        <button type="submit" className="btn btn--primary" disabled={disabled}>
          {status.state === 'sending' ? (
            <>
              <LoaderCircle className="spin" aria-hidden /> Sending…
            </>
          ) : (
            <>
              {mode === 'mailto' ? 'Compose email' : 'Send message'} <Send aria-hidden />
            </>
          )}
        </button>

        <div className="contact-form__status" role="status" aria-live="polite">
          {status.state === 'sent' && status.mode === 'endpoint' && <p className="is-success">Message sent — thank you. I’ll get back to you soon.</p>}
          {status.state === 'sent' && status.mode === 'mailto' && (
            <p className="is-info">Your email app should now be open with the message drafted. It’s only sent once you press send there.</p>
          )}
          {status.state === 'error' && <p className="is-error">{status.message}</p>}
        </div>
      </div>
    </form>
  );
}
