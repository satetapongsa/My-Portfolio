import { ArrowUpRight, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDocumentMeta } from '../../components/SEO/useDocumentMeta';
import { categoryTh, getArticles } from '../../data/journal';
import { useI18n } from '../../i18n/I18nProvider';
import { Link } from '../../router/Link';
import { routePaths } from '../../router/router';
import { formatArticleDate, journalStrings } from './strings';
import './journal.css';

export default function JournalIndexPage() {
  const { lang } = useI18n();
  const s = journalStrings[lang];
  const articles = useMemo(() => getArticles(lang), [lang]);
  const categories = useMemo(() => [...new Set(articles.map((a) => a.category))], [articles]);
  const [category, setCategory] = useState<string | null>(null);
  const visible = category ? articles.filter((a) => a.category === category) : articles;
  const label = (c: string) => (lang === 'th' ? (categoryTh[c] ?? c) : c);

  useDocumentMeta({ title: s.metaTitle, description: s.metaDescription, path: routePaths.journal });

  return (
    <div className="page journal container">
      <header className="page-head">
        <p className="page-head__meta">
          <span>{s.label}</span>
          <span aria-hidden="true">·</span>
          <span>{s.count.replace('{n}', String(articles.length))}</span>
        </p>
        <h1 className="page-head__title">{s.title}</h1>
        <p className="page-head__lead">{s.lead}</p>
      </header>

      {categories.length > 1 && (
        <div className="journal__filters" role="group" aria-label={s.filter}>
          <button type="button" className={`journal__filter ${category === null ? 'is-active' : ''}`} aria-pressed={category === null} onClick={() => setCategory(null)}>
            {s.all}
          </button>
          {categories.map((c) => (
            <button key={c} type="button" className={`journal__filter ${category === c ? 'is-active' : ''}`} aria-pressed={category === c} onClick={() => setCategory(c)}>
              {label(c)}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="journal__empty">{s.empty}</p>
      ) : (
        <ul className="journal__list">
          {visible.map((a, i) => (
            <li key={a.slug}>
              <article className="article-card glow-card" aria-labelledby={`article-${a.slug}`}>
                <p className="article-card__index mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="article-card__body">
                  <p className="article-card__meta mono">
                    <span className="article-card__cat">{label(a.category)}</span>
                    <time dateTime={a.date}>{formatArticleDate(a.date, lang)}</time>
                    <span>
                      <Clock aria-hidden /> {s.minRead.replace('{n}', String(a.readingMinutes))}
                    </span>
                  </p>
                  <h2 id={`article-${a.slug}`} className="article-card__title" lang={a.lang}>
                    <Link to={routePaths.article(a.slug)}>{a.title}</Link>
                  </h2>
                  <p className="article-card__desc" lang={a.lang}>
                    {a.description}
                  </p>
                  <div className="article-card__foot">
                    <ul className="article-card__tags" aria-label={s.tags}>
                      {a.tags.map((tag) => (
                        <li key={tag} className="chip">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <p className="article-card__langs mono">
                      <span className="sr-only">{s.languages}: </span>
                      {a.available.map((l) => (
                        <span key={l} title={s.langName[l]}>
                          {l.toUpperCase()}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="article-card__arrow" aria-hidden />
              </article>
            </li>
          ))}
        </ul>
      )}

      <p className="journal__note">{s.draftsNote}</p>
    </div>
  );
}
