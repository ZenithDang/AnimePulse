import { normaliseJikanEntry } from '../utils/transforms';

const BASE_URL     = 'https://api.jikan.moe/v4';
const MIN_INTERVAL = 400; // ms between requests — keeps us under 3 req/sec
const BACKOFF_429  = 1500; // ms to wait after a 429 before retrying

// Serial request queue. Each entry only starts after the previous one
// has fully settled AND MIN_INTERVAL ms have elapsed. This means concurrent
// callers (e.g. React Query firing 6 season fetches at once) are automatically
// serialised rather than hitting the API simultaneously.
let queue = Promise.resolve();

async function doFetch(url) {
  const res = await fetch(url);

  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, BACKOFF_429));
    const retry = await fetch(url);
    if (!retry.ok) throw new Error(`Jikan ${retry.status}: ${url}`);
    return retry.json();
  }

  if (!res.ok) throw new Error(`Jikan ${res.status}: ${url}`);
  return res.json();
}

function rateLimitedFetch(url) {
  // Attach this call to the end of the queue. Promise.all ensures we wait
  // both for the fetch to complete AND for MIN_INTERVAL to elapse before
  // the next item in the queue can start.
  const entry = queue.then(() =>
    Promise.all([
      doFetch(url),
      new Promise((r) => setTimeout(r, MIN_INTERVAL)),
    ]).then(([data]) => data),
  );

  // Advance the queue regardless of success/failure so one bad request
  // doesn't stall every subsequent fetch.
  queue = entry.then(() => {}, () => {});

  return entry;
}

/**
 * Fetch all anime for a given season, handling pagination.
 * Returns normalised entries.
 */
export async function fetchSeason(year, season) {
  const entries = [];
  let page      = 1;
  let hasNext   = true;

  while (hasNext) {
    const url  = `${BASE_URL}/seasons/${year}/${season}?page=${page}&limit=25`;
    const data = await rateLimitedFetch(url);

    for (const item of (data.data || [])) {
      entries.push(normaliseJikanEntry(item, season, year));
    }

    hasNext = data.pagination?.has_next_page ?? false;
    page++;

    if (page > 10) break; // cap at ~250 titles per season
  }

  return entries;
}


/**
 * Fetch watching/completed/dropped/etc. counts for a single title.
 * Fires on demand (when a user opens the detail panel) — one request per title.
 */
export async function fetchAnimeStatistics(id) {
  const data = await rateLimitedFetch(`${BASE_URL}/anime/${id}/statistics`);
  const s = data.data;
  return {
    watching:      s.watching      ?? 0,
    completed:     s.completed     ?? 0,
    on_hold:       s.on_hold       ?? 0,
    dropped:       s.dropped       ?? 0,
    plan_to_watch: s.plan_to_watch ?? 0,
    total:         s.total         ?? 0,
  };
}

export async function fetchAvailableSeasons() {
  const data = await rateLimitedFetch(`${BASE_URL}/seasons`);
  return data.data || [];
}

export async function fetchGenres() {
  const data = await rateLimitedFetch(`${BASE_URL}/genres/anime`);
  return (data.data || []).map((g) => g.name);
}
