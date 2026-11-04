import { ArrowLeft, Clock, Link2, Share2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useDocumentMeta } from '../../components/SEO/useDocumentMeta';
import { useToast } from '../../components/ui/Toast';
import { absoluteUrl } from '../../config/site';
import { categoryTh, getArticle, getArticles } from '../../data/journal';
import { useI18n } from '../../i18n/I18nProvider';
import { Link } from '../../router/Link';
import { routePaths } from '../../router/router';
import { copyText } from '../../utils/links';
import { NotFoundPage } from '../NotFound/NotFoundPage';
import { renderMarkdown } from './markdown';
import { formatArticleDate, journalStrings } from './strings';
import './journal.css';

/** Fraction of the article body that has scrolled past the top of the viewport. */
function useReadingProgress(target: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, -rect.top / Math.max(total, 1))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);
  return progress;
}

export default function ArticlePage({ slug }: { slug: string }) {
  const { lang, t } = useI18n();
  const s = journalStrings[lang];
  const notify = useToast();
  const article = getArticle(slug, lang);
  const rendered = useMemo(() => (article ? renderMarkdown(article.body, t.common.opensInNewTab) : null), [article, t.common.opensInNewTab]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const progress = useReadingProgress(bodyRef);
  const [activeId, setActiveId] = useState<string | null>(null);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useDocumentMeta({
    title: article ? `${article.title} · ${s.articleSuffix}` : '',
    description: article?.description ?? '',
    path: routePaths.article(slug),
    type: 'article',
    disabled: !article,
  });

  // Highlight the heading currently being read in the table of contents.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || !rendered?.toc.length) return;
    const headings = rendered.toc.map((e) => root.querySelector<HTMLElement>(`#${CSS.escape(e.id)}`)).filter((h): h is HTMLElement => h !== null);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -65% 0px' },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [rendered]);

  if (!article || !rendered) return <NotFoundPage />;

  const fallback = article.lang !== lang;
  const url = absoluteUrl(routePaths.article(slug));
  const related = getArticles(lang)
    .filter((a) => a.slug !== slug)
    .map((a) => ({ a, score: (a.category === article.category ? 2 : 0) + a.tags.filter((tag) => article.tags.includes(tag)).length }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((x) => x.a);
  const label = (c: string) => (lang === 'th' ? (categoryTh[c] ?? c) : c);

  const copyLink = async () => {
    const ok = await copyText(url);
    notify(ok ? s.copied : s.copyFailed, ok ? 'success' : 'error');
  };
  const shareNative = () => {
    navigator.share({ title: article.title, text: article.description, url }).catch(() => undefined);
  };

  return (
    <article className="page article container" aria-labelledby="article-title">
      <div
        className="article__progress"
        role="progressbar"
        aria-label={s.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <nav className="cs-crumbs mono article__crumbs" aria-label={s.breadcrumb}>
        <ol>
          <li>
            <Link to="/">{s.home}</Link>
          </li>
          <li>
            <Link to={routePaths.journal}>{s.journal}</Link>
          </li>
          <li aria-current="page">{article.title}</li>
        </ol>
      </nav>

      <header className="article__head" lang={article.lang}>
        <p className="article__meta mono">
          <span className="article-card__cat">{label(article.category)}</span>
          <span>
            {s.published} <time dateTime={article.date}>{formatArticleDate(article.date, lang)}</time>
          </span>
          <span>
            <Clock aria-hidden /> {s.minRead.replace('{n}', String(article.readingMinutes))}
          </span>
        </p>
        <h1 id="article-title" className="article__title">
          {article.title}
        </h1>
        <p className="article__lead">{article.description}</p>
        <ul className="article-card__tags" aria-label={s.tags}>
          {article.tags.map((tag) => (
            <li key={tag} className="chip">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {fallback && (
        <p className="article__notice" role="note">
          {s.fallbackNotice}
        </p>
      )}

      <div className="article__layout">
        {rendered.toc.length > 2 && (
          <aside className="article__toc" aria-labelledby="toc-title">
            <details open>
              <summary id="toc-title" className="mono">
                {s.onThisPage}
              </summary>
              <ol>
                {rendered.toc.map((entry) => (
                  <li key={entry.id} className={`toc-depth-${entry.depth}`}>
                    <a href={`#${entry.id}`} className={activeId === entry.id ? 'is-active' : ''} aria-current={activeId === entry.id ? 'location' : undefined}>
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          </aside>
        )}

        <div className="article__main">
          <div ref={bodyRef} className="prose" lang={article.lang} dangerouslySetInnerHTML={{ __html: rendered.html }} />

          <section className="article__share" aria-labelledby="share-title">
            <h2 id="share-title" className="article__share-title">
              {s.share}
            </h2>
            <div className="article__share-actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={copyLink}>
                <Link2 aria-hidden /> {s.copyLink}
              </button>
              {canShare && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={shareNative}>
                  <Share2 aria-hidden /> {s.shareNative}
                </button>
              )}
            </div>
          </section>

          {related.length > 0 && (
            <section className="article__related" aria-labelledby="related-title">
              <h2 id="related-title" className="article__share-title">
                {s.related}
              </h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={routePaths.article(r.slug)} className="cs-link">
                      <span>
                        <strong lang={r.lang}>{r.title}</strong>
                        <span lang={r.lang}>{r.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Link to={routePaths.journal} className="btn btn--ghost btn--sm article__back">
            <ArrowLeft aria-hidden /> {s.back}
          </Link>
        </div>
      </div>
    </article>
  );
}
