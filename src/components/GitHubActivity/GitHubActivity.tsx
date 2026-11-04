import { Activity, ExternalLink, FolderGit2, GitBranch, GitCommitHorizontal, RefreshCw, Star, Tag } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import type { Lang } from '../../i18n/lang';
import { getGitHubSnapshot, GITHUB_PROFILE_URL, languageCounts, type GitHubActivityItem, type GitHubResult } from '../../services/githubService';
import { GitHubIcon } from '../ui/BrandIcons';
import { Reveal } from '../ui/Reveal';
import { SectionHeader } from '../ui/SectionHeader';
import { activityStrings, type ActivityStrings } from './strings';
import './github-activity.css';

const MAX_REPOS = 6;
const MAX_EVENTS = 8;

export function relativeTime(when: string | number, lang: Lang) {
  const rtf = new Intl.RelativeTimeFormat(lang === 'th' ? 'th' : 'en', { numeric: 'auto' });
  const diff = (new Date(when).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, seconds] of units) {
    if (Math.abs(diff) >= seconds) return rtf.format(Math.round(diff / seconds), unit);
  }
  return rtf.format(Math.round(diff), 'second');
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ''));

const KIND_ICON: Record<GitHubActivityItem['kind'], typeof Star> = {
  push: GitCommitHorizontal,
  'create-repo': FolderGit2,
  'create-branch': GitBranch,
  release: Tag,
  'pull-request': GitBranch,
  star: Star,
  other: Activity,
};

/** True once the element is within 600 px of the viewport — the fetch waits for it. */
function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (!('IntersectionObserver' in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setNear(true), { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  return [ref, near] as const;
}

/** Public GitHub profile, languages, recent repositories and activity — fetched live, cached for an hour. */
export function GitHubActivity() {
  const { lang, t } = useI18n();
  const s = activityStrings[lang];
  const [ref, near] = useNearViewport<HTMLElement>();
  const [result, setResult] = useState<GitHubResult | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    void getGitHubSnapshot().then((r) => {
      setResult(r);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (near && !result && !loading) load();
  }, [near, result, loading, load]);

  let body;
  if (result?.status === 'ok') body = <GitHubData result={result} s={s} lang={lang} />;
  else if (result?.status === 'error' && !loading) body = <GitHubError result={result} s={s} lang={lang} onRetry={load} />;
  else body = <GitHubSkeleton label={s.loading} />;

  return (
    <section ref={ref} id="activity" className="section gh" aria-labelledby="activity-title">
      <div className="container">
        <SectionHeader
          id="activity-title"
          index="04"
          label={s.label}
          title={
            <>
              {s.titleA} <span className="gradient-text">{s.titleAccent}</span>
              {t.common.dot}
            </>
          }
          lead={s.lead}
        />
        {body}
      </div>
    </section>
  );
}

interface PartProps {
  s: ActivityStrings;
  lang: Lang;
}

function GitHubError({ result, s, lang, onRetry }: PartProps & { result: Extract<GitHubResult, { status: 'error' }>; onRetry: () => void }) {
  const message =
    result.reason === 'rate-limit'
      ? fill(s.errorRate, { time: result.resetAt ? relativeTime(result.resetAt, lang) : '' })
      : result.reason === 'network'
        ? s.errorNetwork
        : s.errorHttp;
  return (
    <div className="gh-error" role="alert">
      <p className="gh-error__title">{s.errorTitle}</p>
      <p className="gh-error__body">{message}</p>
      <div className="gh-error__actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={onRetry}>
          <RefreshCw aria-hidden /> {s.retry}
        </button>
        <a className="btn btn--primary btn--sm" href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          <GitHubIcon /> {s.profile}
          <span className="sr-only"> {s.opensNewTab}</span>
        </a>
      </div>
    </div>
  );
}

function GitHubData({ result, s, lang }: PartProps & { result: Extract<GitHubResult, { status: 'ok' }> }) {
  const { profile, repos, activity, fetchedAt } = result.data;
  const langs = languageCounts(repos);
  const top = langs.items.slice(0, 6);
  const recentRepos = repos.slice(0, MAX_REPOS);
  const events = activity?.slice(0, MAX_EVENTS) ?? null;
  const locale = lang === 'th' ? 'th-TH' : 'en-GB';

  return (
    <div className="gh-grid">
      {result.stale && (
        <p className="gh-stale" role="status">
          {s.stale}
        </p>
      )}

      <Reveal className="gh-stats">
        <dl>
          <div>
            <dt>{s.stats.repos}</dt>
            <dd className="mono">{profile.publicRepos}</dd>
          </div>
          <div>
            <dt>{s.stats.followers}</dt>
            <dd className="mono">{profile.followers}</dd>
          </div>
          <div>
            <dt>{s.stats.following}</dt>
            <dd className="mono">{profile.following}</dd>
          </div>
          <div>
            <dt>{s.stats.since}</dt>
            <dd className="mono">{new Date(profile.createdAt).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}</dd>
          </div>
        </dl>
      </Reveal>

      <div className="gh-panels">
        <Reveal className="gh-panel">
          <h3 className="gh-panel__title">{s.languages}</h3>
          <ul className="gh-langs">
            {top.map((l) => (
              <li key={l.name}>
                <div className="gh-langs__row">
                  <span>
                    <span className="lang-dot" data-lang={l.name} aria-hidden="true" /> {l.name}
                  </span>
                  <span className="mono">{fill(s.repoCount, { n: l.count })}</span>
                </div>
                <div className="gh-langs__track" aria-hidden="true">
                  <span className="gh-langs__fill" data-lang={l.name} style={{ width: `${Math.max(l.share * 100, 2)}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="gh-note">{fill(s.languagesNote, { n: langs.total })}</p>
        </Reveal>

        <Reveal className="gh-panel">
          <h3 className="gh-panel__title">{s.activity}</h3>
          {events === null ? (
            <p className="gh-note">{s.activityUnavailable}</p>
          ) : events.length === 0 ? (
            <p className="gh-note">{s.activityEmpty}</p>
          ) : (
            <ol className="gh-events">
              {events.map((e) => {
                const Icon = KIND_ICON[e.kind];
                return (
                  <li key={e.id}>
                    <Icon aria-hidden />
                    <span className="gh-events__text">
                      {fill(s.kinds[e.kind], { ref: e.ref ?? '' })}{' '}
                      <a href={`${GITHUB_PROFILE_URL}/${e.repo}`} target="_blank" rel="noopener noreferrer">
                        {e.repo}
                      </a>
                    </span>
                    <time className="mono" dateTime={e.createdAt}>
                      {relativeTime(e.createdAt, lang)}
                    </time>
                  </li>
                );
              })}
            </ol>
          )}
        </Reveal>
      </div>

      <div className="gh-recent">
        <h3 className="gh-panel__title">{s.recent}</h3>
        <ul className="gh-repos">
          {recentRepos.map((r) => (
            <li key={r.name} className="gh-repo">
              <a className="gh-repo__name" href={r.url} target="_blank" rel="noopener noreferrer">
                <GitHubIcon /> <span>{r.name}</span>
                <span className="sr-only"> {s.opensNewTab}</span>
              </a>
              <p className="gh-repo__desc">{r.description || s.noDescription}</p>
              <div className="gh-repo__meta mono">
                {r.language && (
                  <span>
                    <span className="lang-dot" data-lang={r.language} aria-hidden="true" /> {r.language}
                  </span>
                )}
                {r.stars > 0 && (
                  <span>
                    <Star aria-hidden /> {r.stars}
                  </span>
                )}
                <time dateTime={r.pushedAt}>{fill(s.updated, { time: relativeTime(r.pushedAt, lang) })}</time>
              </div>
              {r.homepage && /^https:\/\//.test(r.homepage) && (
                <a className="gh-repo__live" href={r.homepage} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden /> {s.live}
                  <span className="sr-only"> {s.opensNewTab}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="gh-foot">
        <p className="gh-note mono">
          {s.source} · {fill(s.fetched, { time: relativeTime(fetchedAt, lang) })}
        </p>
        <a className="btn btn--ghost btn--sm" href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
          <GitHubIcon /> {s.profile}
          <span className="sr-only"> {s.opensNewTab}</span>
        </a>
      </div>
    </div>
  );
}

function GitHubSkeleton({ label }: { label: string }) {
  return (
    <div className="gh-skeleton" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="gh-skeleton__row">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="gh-skel gh-skel--stat" />
        ))}
      </div>
      <div className="gh-skeleton__cols">
        <span className="gh-skel gh-skel--panel" />
        <span className="gh-skel gh-skel--panel" />
      </div>
    </div>
  );
}
