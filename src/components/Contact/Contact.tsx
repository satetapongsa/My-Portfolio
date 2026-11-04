import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { configuredSocials, copyText, hasEmail, isConfigured } from '../../utils/links';
import { SocialIcon } from '../ui/BrandIcons';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { useToast } from '../ui/Toast';
import { ContactForm } from './ContactForm';
import './contact.css';

export function Contact() {
  const { t, content } = useI18n();
  const { profile } = content;
  const c = t.contact;
  const socials = configuredSocials();
  const notify = useToast();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    const ok = await copyText(profile.contact.email);
    notify(ok ? c.copied : c.copyFailed, ok ? 'success' : 'error');
    if (ok) {
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader
          id="contact-title"
          index="07"
          label={c.label}
          title={
            <>
              {c.titleA} <span className="gradient-text">{c.titleAccent}</span>
              {t.common.dot}
            </>
          }
          lead={profile.contact.availability}
        />

        <div className="contact__grid">
          <Reveal className="contact__channels">
            {hasEmail() && (
              <div className="channel channel--email glow-card">
                <span className="channel__icon">
                  <Mail aria-hidden />
                </span>
                <div className="channel__text">
                  <p className="channel__label mono">{c.email}</p>
                  <a className="channel__value" href={`mailto:${profile.contact.email}`}>
                    {profile.contact.email}
                  </a>
                </div>
                <button type="button" className="icon-btn" onClick={copyEmail} aria-label={copied ? c.emailCopied : c.copyEmail} title={copied ? c.emailCopied : c.copyEmail}>
                  {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                </button>
              </div>
            )}

            {socials.map((s) => (
              <a key={s.id + s.url} className="channel glow-card" href={s.url} target="_blank" rel="noopener noreferrer">
                <span className="channel__icon">
                  <SocialIcon id={s.id} />
                </span>
                <span className="channel__text">
                  <span className="channel__label mono">{s.label}</span>
                  <span className="channel__value">{isConfigured(s.handle) ? s.handle : s.url.replace(/^https?:\/\//, '')}</span>
                </span>
                <ArrowUpRight className="channel__arrow" aria-hidden />
                <span className="sr-only"> {t.common.opensInNewTab}</span>
              </a>
            ))}

            {!hasEmail() && socials.length === 0 && (
              <div className="channel channel--pending">
                <span className="status-dot status-dot--amber" aria-hidden="true" />
                <p>{c.pending}</p>
              </div>
            )}

            <div className="contact__note mono">
              <span>{c.tip}</span>
              <p>{c.tipText}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
