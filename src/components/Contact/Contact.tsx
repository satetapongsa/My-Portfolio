import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { profile } from '../../data/portfolio';
import { configuredSocials, copyText, hasEmail, isConfigured } from '../../utils/links';
import { SocialIcon } from '../ui/BrandIcons';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { useToast } from '../ui/Toast';
import { ContactForm } from './ContactForm';
import './contact.css';

export function Contact() {
  const socials = configuredSocials();
  const notify = useToast();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    const ok = await copyText(profile.contact.email);
    notify(ok ? 'Email copied to clipboard' : 'Couldn’t copy — please copy it manually', ok ? 'success' : 'error');
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
          index="06"
          label="Contact"
          title={
            <>
              Let’s build <span className="gradient-text">something</span>.
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
                  <p className="channel__label mono">Email</p>
                  <a className="channel__value" href={`mailto:${profile.contact.email}`}>
                    {profile.contact.email}
                  </a>
                </div>
                <button type="button" className="icon-btn" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'}>
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
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}

            {!hasEmail() && socials.length === 0 && (
              <div className="channel channel--pending">
                <span className="status-dot status-dot--amber" aria-hidden="true" />
                <p>
                  Contact channels are being set up. Email, GitHub and LinkedIn will appear here once they’re published.
                </p>
              </div>
            )}

            <div className="contact__note mono">
              <span>tip</span>
              <p>Press Ctrl/⌘ + K anywhere to jump around the site.</p>
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
