/**
 * Public GitHub data for github.com/satetapongsa, from the official REST API.
 *
 * - Three unauthenticated requests (profile, repositories, public events) —
 *   no token ever ships to the browser, and visitors never sign in.
 * - Cached in localStorage for an hour; refreshes send the stored ETags, so an
 *   unchanged response is a 304 that does not count against the rate limit.
 * - If GitHub is unreachable or rate-limited, the last cached snapshot is
 *   served (marked stale); with no cache the UI shows a fallback link.
 * - Only public data exists on these endpoints; forks are left out.
 */
export const GITHUB_USER = 'satetapongsa';
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USER}`;

const API = 'https://api.github.com';
const CACHE_KEY = 'wave-github-v1';
const TTL_MS = 60 * 60 * 1000;
const TIMEOUT_MS = 8000;

export interface GitHubProfile {
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export type GitHubActivityKind = 'push' | 'create-repo' | 'create-branch' | 'release' | 'pull-request' | 'star' | 'other';

export interface GitHubActivityItem {
  id: string;
  kind: GitHubActivityKind;
  repo: string;
  /** Branch or tag name where relevant. */
  ref?: string;
  createdAt: string;
}

export interface GitHubSnapshot {
  fetchedAt: number;
  profile: GitHubProfile;
  repos: GitHubRepo[];
  /** null when the events endpoint failed but the rest succeeded. */
  activity: GitHubActivityItem[] | null;
}

export type GitHubResult =
  | { status: 'ok'; data: GitHubSnapshot; stale: boolean }
  | { status: 'error'; reason: 'rate-limit' | 'network' | 'http'; resetAt?: number };

interface CacheEntry {
  data: GitHubSnapshot;
  etags: Partial<Record<'profile' | 'repos' | 'events', string>>;
}

class RateLimitError extends Error {
  constructor(public resetAt?: number) {
    super('rate-limit');
  }
}

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as CacheEntry) : null;
  } catch {
    return null;
  }
}

function writeCache(entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // Storage full or blocked: the data is still shown, just not cached.
  }
}

/** GET with an ETag; `body` is null on 304 (use the cached mapping). */
async function getJson(path: string, etag: string | undefined): Promise<{ body: unknown | null; etag?: string }> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Accept: 'application/vnd.github+json', ...(etag ? { 'If-None-Match': etag } : {}) },
      signal: controller.signal,
    });
    if (res.status === 304) return { body: null, etag };
    if ((res.status === 403 || res.status === 429) && res.headers.get('x-ratelimit-remaining') === '0') {
      const reset = Number(res.headers.get('x-ratelimit-reset'));
      throw new RateLimitError(Number.isFinite(reset) ? reset * 1000 : undefined);
    }
    if (!res.ok) throw new Error(`http ${res.status}`);
    return { body: await res.json(), etag: res.headers.get('etag') ?? undefined };
  } finally {
    window.clearTimeout(timer);
  }
}

type RawRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  private: boolean;
};

type RawEvent = { id: string; type: string; repo: { name: string }; created_at: string; payload: Record<string, unknown> };

function mapProfile(raw: unknown): GitHubProfile {
  const p = raw as { public_repos: number; followers: number; following: number; created_at: string };
  return { publicRepos: p.public_repos, followers: p.followers, following: p.following, createdAt: p.created_at };
}

function mapRepos(raw: unknown): GitHubRepo[] {
  return (raw as RawRepo[])
    .filter((r) => !r.fork && !r.private)
    .map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
    }))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
}

function mapEvents(raw: unknown): GitHubActivityItem[] {
  return (raw as RawEvent[]).map((e) => {
    const repo = e.repo.name.replace(`${GITHUB_USER}/`, '');
    const payload = e.payload ?? {};
    const refName = typeof payload.ref === 'string' ? payload.ref.replace(/^refs\/(heads|tags)\//, '') : undefined;
    let kind: GitHubActivityKind = 'other';
    if (e.type === 'PushEvent') kind = 'push';
    else if (e.type === 'CreateEvent') kind = payload.ref_type === 'repository' ? 'create-repo' : 'create-branch';
    else if (e.type === 'ReleaseEvent') kind = 'release';
    else if (e.type === 'PullRequestEvent') kind = 'pull-request';
    else if (e.type === 'WatchEvent') kind = 'star';
    return { id: e.id, kind, repo, ref: refName, createdAt: e.created_at };
  });
}

let inflight: Promise<GitHubResult> | null = null;

/** Profile, public repositories and recent public activity — cached, deduplicated, never throws. */
export function getGitHubSnapshot(): Promise<GitHubResult> {
  const cache = readCache();
  if (cache && Date.now() - cache.data.fetchedAt < TTL_MS) {
    return Promise.resolve({ status: 'ok', data: cache.data, stale: false });
  }
  inflight ??= (async (): Promise<GitHubResult> => {
    try {
      // ETags are only sent when there is a cached mapping to fall back on.
      const [profile, repos] = await Promise.all([
        getJson(`/users/${GITHUB_USER}`, cache?.etags.profile),
        getJson(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner`, cache?.etags.repos),
      ]);
      // Activity is a nice-to-have: its failure must not hide the rest.
      const events = await getJson(`/users/${GITHUB_USER}/events/public?per_page=30`, cache?.data.activity ? cache.etags.events : undefined).catch(
        () => null,
      );
      if ((profile.body === null || repos.body === null) && !cache) throw new Error('304 without cache');
      const data: GitHubSnapshot = {
        fetchedAt: Date.now(),
        profile: profile.body !== null ? mapProfile(profile.body) : cache!.data.profile,
        repos: repos.body !== null ? mapRepos(repos.body) : cache!.data.repos,
        activity: events ? (events.body !== null ? mapEvents(events.body) : (cache?.data.activity ?? null)) : null,
      };
      writeCache({ data, etags: { profile: profile.etag, repos: repos.etag, events: events?.etag } });
      return { status: 'ok', data, stale: false };
    } catch (error) {
      if (cache) return { status: 'ok', data: cache.data, stale: true };
      if (error instanceof RateLimitError) return { status: 'error', reason: 'rate-limit', resetAt: error.resetAt };
      return { status: 'error', reason: error instanceof TypeError || (error as Error).name === 'AbortError' ? 'network' : 'http' };
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

/** Repository count per primary language (GitHub's own "language" field). */
export function languageCounts(repos: GitHubRepo[]) {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const withLanguage = [...counts.values()].reduce((a, b) => a + b, 0);
  return {
    total: withLanguage,
    items: [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, share: count / withLanguage })),
  };
}
