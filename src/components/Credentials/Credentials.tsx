import { BadgeCheck, Download, ExternalLink, Maximize2, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { certificates, formatCertDate } from '../../data/certificates';
import type { Certificate } from '../../data/types';
import { Dialog } from '../ui/Dialog';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import './credentials.css';

const fileName = (cert: Certificate) => decodeURI(cert.image.split('/').pop() ?? `${cert.id}.png`);

function CertActions({ cert, onView }: { cert: Certificate; onView?: () => void }) {
  return (
    <div className="cert-actions">
      {onView ? (
        <button type="button" className="btn btn--primary btn--sm" onClick={onView}>
          <Maximize2 aria-hidden /> View
          <span className="sr-only"> {cert.title}</span>
        </button>
      ) : (
        <a className="btn btn--primary btn--sm" href={cert.image} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden /> Open full size
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
      <a className="btn btn--ghost btn--sm" href={cert.image} download={fileName(cert)}>
        <Download aria-hidden /> Download
        <span className="sr-only"> {cert.title}</span>
      </a>
      {cert.verifyUrl && (
        <a className="btn btn--ghost btn--sm" href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
          <BadgeCheck aria-hidden /> Verify
          <span className="sr-only"> {cert.title} with the issuer (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

export function Credentials() {
  const [active, setActive] = useState<Certificate | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const issuers = useMemo(() => new Set(certificates.map((c) => c.issuer.split(' · ')[0])).size, []);

  return (
    <section id="credentials" className="section credentials" aria-labelledby="credentials-title">
      <div className="container">
        <SectionHeader
          id="credentials-title"
          index="05"
          label="Certifications & Credentials"
          title={
            <>
              Verified <span className="gradient-text">credentials</span>.
            </>
          }
          lead="Certificates carried over from my original portfolio. Every title, issuer and date below is transcribed from the certificate itself."
        />

        <Reveal className="cred-stats mono" y={12}>
          <span>
            <b>{String(certificates.length).padStart(2, '0')}</b> certificates
          </span>
          <span>
            <b>{String(issuers).padStart(2, '0')}</b> issuing organizations
          </span>
          <span>
            focus <b>cybersecurity</b>
          </span>
        </Reveal>

        <ul className="cred-grid">
          {certificates.map((cert, i) => (
            <Reveal as="li" key={cert.id} delay={(i % 3) * 0.06} className="cert-card glow-card">
              <button type="button" className="cert-card__thumb" onClick={() => setActive(cert)} aria-label={`View certificate: ${cert.title}`}>
                <img src={cert.image} alt="" loading="lazy" decoding="async" width={cert.width} height={cert.height} />
                <span className="cert-card__zoom" aria-hidden="true">
                  <Maximize2 />
                </span>
              </button>
              <div className="cert-card__body">
                <p className="cert-card__date mono">
                  <time dateTime={cert.date}>{formatCertDate(cert.date)}</time>
                </p>
                <h3 className="cert-card__title">{cert.title}</h3>
                <p className="cert-card__issuer">{cert.issuer}</p>
                {cert.note && <p className="cert-card__note mono">{cert.note}</p>}
                <CertActions cert={cert} onView={() => setActive(cert)} />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <Dialog open={active !== null} onClose={() => setActive(null)} labelledBy="cert-title" panelClassName="cert-viewer" initialFocus={closeRef}>
        {active && (
          <>
            <header className="cert-viewer__head">
              <div>
                <p className="cert-viewer__meta mono">
                  {active.issuer} · <time dateTime={active.date}>{formatCertDate(active.date)}</time>
                </p>
                <h2 id="cert-title" className="cert-viewer__title">
                  {active.title}
                </h2>
              </div>
              <button ref={closeRef} type="button" className="icon-btn" onClick={() => setActive(null)} aria-label="Close certificate">
                <X aria-hidden />
              </button>
            </header>
            <div className="cert-viewer__image">
              <img
                src={active.image}
                alt={`Certificate: ${active.title}, issued by ${active.issuer} to Satetapong Sanguansuk`}
                width={active.width}
                height={active.height}
                decoding="async"
              />
            </div>
            <footer className="cert-viewer__foot">
              {active.note && <p className="mono">{active.note}</p>}
              <CertActions cert={active} />
            </footer>
          </>
        )}
      </Dialog>
    </section>
  );
}
