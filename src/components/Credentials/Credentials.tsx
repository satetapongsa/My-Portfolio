import { BadgeCheck, Download, ExternalLink, ImageOff, Maximize2, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { formatCertDate } from '../../data/certificates';
import type { Certificate } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { fill } from '../../i18n/ui';
import { Dialog } from '../ui/Dialog';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import './credentials.css';

const fileName = (cert: Certificate) => decodeURI(cert.image.split('/').pop() ?? `${cert.id}.png`);

/**
 * Image with a fixed-ratio skeleton, fade-in on load and an error state.
 * Sizes come from the data, so nothing shifts while it loads.
 */
function CertImage({ src, alt, width, height, eager = false }: { src: string; alt: string; width: number; height: number; eager?: boolean }) {
  const { t } = useI18n();
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  return (
    <span className={`cert-img is-${state}`} style={{ aspectRatio: `${width} / ${height}`, ["--ratio" as string]: width / height }}>
      {state === 'error' ? (
        <span className="cert-img__error">
          <ImageOff aria-hidden />
          {t.credentials.loadError}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          ref={(el) => {
            // Already in the HTTP cache (e.g. reopening the viewer): skip the skeleton.
            if (el?.complete && el.naturalWidth > 0 && state === 'loading') setState('loaded');
          }}
        />
      )}
    </span>
  );
}

function CertActions({ cert, onView }: { cert: Certificate; onView?: () => void }) {
  const { t } = useI18n();
  const c = t.credentials;
  return (
    <div className="cert-actions">
      {onView ? (
        <button type="button" className="btn btn--primary btn--sm" onClick={onView}>
          <Maximize2 aria-hidden /> {c.view}
          <span className="sr-only"> {cert.title}</span>
        </button>
      ) : (
        <a className="btn btn--primary btn--sm" href={cert.image} target="_blank" rel="noopener noreferrer">
          <ExternalLink aria-hidden /> {c.openFull}
          <span className="sr-only"> {t.common.opensInNewTab}</span>
        </a>
      )}
      <a className="btn btn--ghost btn--sm" href={cert.image} download={fileName(cert)}>
        <Download aria-hidden /> {c.download}
        <span className="sr-only"> {cert.title}</span>
      </a>
      {cert.verifyUrl && (
        <a className="btn btn--ghost btn--sm" href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
          <BadgeCheck aria-hidden /> {c.verify}
          <span className="sr-only">
            {' '}
            {cert.title} {c.verifyWith} {t.common.opensInNewTab}
          </span>
        </a>
      )}
    </div>
  );
}

export function Credentials() {
  const { t, lang, content } = useI18n();
  const c = t.credentials;
  const { certificates } = content;
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = certificates.find((cert) => cert.id === activeId) ?? null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const issuers = useMemo(() => new Set(certificates.map((cert) => cert.issuer.split(' · ')[0])).size, [certificates]);

  return (
    <section id="credentials" className="section credentials" aria-labelledby="credentials-title">
      <div className="container">
        <SectionHeader
          id="credentials-title"
          index="05"
          label={c.label}
          title={
            <>
              {c.titleA} <span className="gradient-text">{c.titleAccent}</span>
              {t.common.dot}
            </>
          }
          lead={c.lead}
        />

        <Reveal className="cred-stats mono" y={12}>
          <span>
            <b>{String(certificates.length).padStart(2, '0')}</b> {c.certificates}
          </span>
          <span>
            <b>{String(issuers).padStart(2, '0')}</b> {c.issuers}
          </span>
          <span>
            {c.focus} <b>{c.focusValue}</b>
          </span>
        </Reveal>

        <ul className="cred-grid">
          {certificates.map((cert, i) => (
            <Reveal as="li" key={cert.id} delay={(i % 3) * 0.06} className="cert-card glow-card">
              <button type="button" className="cert-card__thumb" onClick={() => setActiveId(cert.id)} aria-label={`${c.viewCert} ${cert.title}`}>
                <CertImage src={cert.thumb} alt="" width={640} height={Math.round((640 * cert.height) / cert.width)} />
                <span className="cert-card__zoom" aria-hidden="true">
                  <Maximize2 />
                </span>
              </button>
              <div className="cert-card__body">
                <p className="cert-card__date mono">
                  <time dateTime={cert.date}>{formatCertDate(cert.date, lang)}</time>
                </p>
                <h3 className="cert-card__title">{cert.title}</h3>
                <p className="cert-card__issuer">{cert.issuer}</p>
                {cert.note && <p className="cert-card__note mono">{cert.note}</p>}
                <CertActions cert={cert} onView={() => setActiveId(cert.id)} />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      <Dialog open={active !== null} onClose={() => setActiveId(null)} labelledBy="cert-title" panelClassName="cert-viewer" initialFocus={closeRef}>
        {active && (
          <>
            <header className="cert-viewer__head">
              <div>
                <p className="cert-viewer__meta mono">
                  {active.issuer} · <time dateTime={active.date}>{formatCertDate(active.date, lang)}</time>
                </p>
                <h2 id="cert-title" className="cert-viewer__title">
                  {active.title}
                </h2>
              </div>
              <button ref={closeRef} type="button" className="icon-btn" onClick={() => setActiveId(null)} aria-label={c.closeCert}>
                <X aria-hidden />
              </button>
            </header>
            <div className="cert-viewer__image">
              <CertImage
                key={active.id}
                src={active.preview}
                alt={fill(c.certAlt, { title: active.title, issuer: active.issuer })}
                width={1600}
                height={Math.round((1600 * active.height) / active.width)}
                eager
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
