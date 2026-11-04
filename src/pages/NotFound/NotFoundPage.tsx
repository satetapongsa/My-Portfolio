import { useDocumentMeta } from '../../components/SEO/useDocumentMeta';
import { useI18n } from '../../i18n/I18nProvider';
import { Link } from '../../router/Link';
import { usePathname } from '../../router/router';

const copy = {
  en: { title: 'Signal lost', body: 'Nothing lives at this address. The page may have moved, or the link is mistyped.', home: 'Back to the portfolio', meta: 'Page not found · Wave' },
  th: { title: 'สัญญาณหาย', body: 'ไม่มีหน้านี้อยู่ที่ที่อยู่นี้ หน้าอาจถูกย้าย หรือพิมพ์ลิงก์ผิด', home: 'กลับไปหน้าพอร์ตโฟลิโอ', meta: 'ไม่พบหน้า · Wave' },
};

export function NotFoundPage() {
  const { lang } = useI18n();
  const path = usePathname();
  const c = copy[lang];
  useDocumentMeta({ title: c.meta, description: c.body, path });
  return (
    <section className="page-404 container" aria-labelledby="nf-title">
      <p className="mono page-404__code">404 · {path}</p>
      <h1 id="nf-title" className="page-404__title gradient-text">
        {c.title}
      </h1>
      <p className="page-404__body">{c.body}</p>
      <Link to="/" className="btn btn--primary">
        {c.home}
      </Link>
    </section>
  );
}

export default NotFoundPage;
