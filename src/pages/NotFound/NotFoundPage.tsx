import { ArrowLeft, FolderGit2, Home } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useDocumentMeta } from '../../components/SEO/useDocumentMeta';
import { useI18n } from '../../i18n/I18nProvider';
import { Link } from '../../router/Link';
import { usePathname } from '../../router/router';

const copy = {
  en: {
    code: 'Error 404',
    title: '404 — Page Not Found',
    body: "The digital path you're looking for doesn't exist or may have been moved.",
    requested: 'Requested address',
    home: 'Back to Home',
    projects: 'Explore Projects',
    back: 'Return to Previous Page',
    meta: '404 — Page Not Found · Satetapong Sanguansuk (Wave)',
  },
  th: {
    code: 'ข้อผิดพลาด 404',
    title: '404 — ไม่พบหน้านี้',
    body: 'เส้นทางดิจิทัลที่คุณกำลังหาไม่มีอยู่ หรืออาจถูกย้ายไปแล้ว',
    requested: 'ที่อยู่ที่ร้องขอ',
    home: 'กลับหน้าแรก',
    projects: 'สำรวจผลงาน',
    back: 'กลับไปหน้าก่อนหน้า',
    meta: '404 — ไม่พบหน้า · เศรษฐพงศ์ สงวนสุข (Wave)',
  },
};

/**
 * Shown for unknown routes. On a direct visit the server has already answered
 * with HTTP 404 (dist/404.html); this page is never indexed (noindex, no
 * canonical) and never listed in the sitemap.
 */
export function NotFoundPage() {
  const { lang } = useI18n();
  const path = usePathname();
  const c = copy[lang];
  const headingRef = useRef<HTMLHeadingElement>(null);
  // "Previous page" only makes sense when this tab has somewhere to go back to.
  const [canGoBack] = useState(() => typeof window !== 'undefined' && window.history.length > 1);

  useDocumentMeta({ title: c.meta, description: c.body, path, noindex: true });

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section className="page-404 container" aria-labelledby="nf-title">
      <p className="page-404__code mono">{c.code}</p>
      <h1 id="nf-title" ref={headingRef} tabIndex={-1} className="page-404__title">
        <span className="gradient-text">404</span> — {c.title.replace(/^404 — /, '')}
      </h1>
      <p className="page-404__body">{c.body}</p>
      <p className="page-404__path mono">
        <span>{c.requested}:</span> <code>{path}</code>
      </p>
      <div className="page-404__actions">
        <Link to="/" className="btn btn--primary">
          <Home aria-hidden /> {c.home}
        </Link>
        <Link to="/#projects" className="btn btn--ghost">
          <FolderGit2 aria-hidden /> {c.projects}
        </Link>
        {canGoBack && (
          <button type="button" className="btn btn--ghost" onClick={() => window.history.back()}>
            <ArrowLeft aria-hidden /> {c.back}
          </button>
        )}
      </div>
    </section>
  );
}

export default NotFoundPage;
