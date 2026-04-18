function decodeHtmlEntities(str) {
  if (!str) return '';
  const el = document.createElement('textarea');
  el.innerHTML = str;
  return el.value;
}

/**
 * Normalise a raw AniList entry into the internal data model.
 */
export function normaliseAnilistEntry(entry) {
  const genres = entry.genres || [];
  const season = (entry.season || '').toLowerCase();
  const year   = entry.seasonYear || null;

  return {
    id:        entry.idMal || entry.id,
    anilistId: entry.id,
    title:    entry.title?.english || entry.title?.romaji || 'Unknown Title',
    score:    entry.meanScore ? entry.meanScore / 10 : null,
    members:  entry.popularity ?? 0,
    genres,
    studio:   entry.studios?.nodes?.[0]?.name || 'Unknown Studio',
    season,
    year,
    episodes: entry.episodes ?? null,
    type:     entry.format || 'TV',
    image:      entry.coverImage?.large      || null,
    imageLarge: entry.coverImage?.extraLarge || entry.coverImage?.large || null,
    synopsis: decodeHtmlEntities(entry.description?.replace(/<[^>]*>/g, '') ?? ''),
    anilistUrl: `https://anilist.co/anime/${entry.id}`,
  };
}

/** Convert season string to a short display label, e.g. winter 2024 → 'W2024' */
export function seasonLabel(season, year) {
  const prefixes = { winter: 'W', spring: 'Sp', summer: 'Su', fall: 'F' };
  return `${prefixes[season] ?? season[0].toUpperCase()}${year}`;
}

/** Return true if an entry matches the format filter */
export function matchesFormat(entry, format) {
  if (!format || format === 'all') return true;
  return entry.type?.toLowerCase() === format.toLowerCase();
}

/**
 * Given a list of normalised entries, aggregate by genre per season.
 * Returns: { [seasonKey]: { [genre]: { avg, titles[] } } }
 */
export function aggregateByGenre(entries) {
  const map = {};

  for (const entry of entries) {
    if (!entry.score || entry.score <= 0) continue;
    const key = `${entry.season}-${entry.year}`;

    if (!map[key]) map[key] = {};

    for (const genre of entry.genres) {
      if (!map[key][genre]) map[key][genre] = { scores: [], titles: [] };
      map[key][genre].scores.push(entry.score);
      map[key][genre].titles.push(entry);
    }
  }

  // Flatten to { seasonKey, genre, avg, titles }
  const result = {};
  for (const [seasonKey, genres] of Object.entries(map)) {
    result[seasonKey] = {};
    for (const [genre, data] of Object.entries(genres)) {
      const avg = data.scores.reduce((s, v) => s + v, 0) / data.scores.length;
      result[seasonKey][genre] = {
        avg:    parseFloat(avg.toFixed(2)),
        count:  data.scores.length,
        titles: data.titles.sort((a, b) => b.score - a.score).slice(0, 10),
      };
    }
  }

  return result;
}

/**
 * Build chart-ready data for Recharts LineChart.
 * Returns array sorted by season order:
 * [{ season: 'W2024', Action: 7.2, Comedy: 6.8, ... }, ...]
 */
export function buildTrendChartData(aggregated, seasons, selectedGenres) {
  return seasons.map(({ season, year }) => {
    const key   = `${season}-${year}`;
    const label = seasonLabel(season, year);
    const point = { season: label, _key: key };

    for (const genre of selectedGenres) {
      point[genre] = aggregated[key]?.[genre]?.avg ?? null;
    }

    return point;
  });
}

/**
 * Build momentum data: % change in a metric per genre across the range.
 * getValue extracts the numeric value from an aggregated cell.
 * Defaults to score avg; pass different extractors for popularity or count.
 */
export function buildMomentumData(aggregated, seasons, selectedGenres, getValue = (d) => d?.avg) {
  if (seasons.length < 2) return [];

  const firstKey = `${seasons[0].season}-${seasons[0].year}`;
  const lastKey  = `${seasons[seasons.length - 1].season}-${seasons[seasons.length - 1].year}`;

  return selectedGenres
    .map((genre) => {
      const first = getValue(aggregated[firstKey]?.[genre]);
      const last  = getValue(aggregated[lastKey]?.[genre]);
      if (first == null || last == null) return null;
      const change = parseFloat(((last - first) / first * 100).toFixed(1));
      return { genre, change, first, last };
    })
    .filter(Boolean)
    .sort((a, b) => b.change - a.change);
}

/**
 * Aggregate entries by genre per season using members as the viewership metric.
 * Returns: { [seasonKey]: { [genre]: { avgMembers, totalMembers, count, titles[] } } }
 */
export function aggregateViewershipByGenre(entries) {
  const map = {};

  for (const entry of entries) {
    if (!entry.members || entry.members <= 0) continue;
    const key = `${entry.season}-${entry.year}`;

    if (!map[key]) map[key] = {};

    for (const genre of entry.genres) {
      if (!map[key][genre]) map[key][genre] = { members: [], titles: [] };
      map[key][genre].members.push(entry.members);
      map[key][genre].titles.push(entry);
    }
  }

  const result = {};
  for (const [seasonKey, genres] of Object.entries(map)) {
    result[seasonKey] = {};
    for (const [genre, data] of Object.entries(genres)) {
      const total = data.members.reduce((s, v) => s + v, 0);
      result[seasonKey][genre] = {
        avgMembers:   Math.round(total / data.members.length),
        totalMembers: total,
        count:        data.members.length,
        titles:       data.titles.sort((a, b) => b.members - a.members).slice(0, 10),
      };
    }
  }

  return result;
}

/**
 * Build chart-ready data for the viewership trend (avg members per genre per season).
 */
export function buildViewershipTrendData(viewershipAggregated, seasons, selectedGenres) {
  return seasons.map(({ season, year }) => {
    const key   = `${season}-${year}`;
    const label = seasonLabel(season, year);
    const point = { season: label, _key: key };

    for (const genre of selectedGenres) {
      point[genre] = viewershipAggregated[key]?.[genre]?.avgMembers ?? null;
    }

    return point;
  });
}

/**
 * Aggregate raw title counts by genre per season (all entries, regardless of score).
 * Returns: { [seasonKey]: { [genre]: count } }
 */
export function aggregateCountByGenre(entries) {
  const map = {};
  for (const entry of entries) {
    const key = `${entry.season}-${entry.year}`;
    if (!map[key]) map[key] = {};
    for (const genre of entry.genres) {
      map[key][genre] = (map[key][genre] || 0) + 1;
    }
  }
  return map;
}

/**
 * Build chart-ready data for a title-count trend (number of titles per genre per season).
 */
export function buildCountChartData(countAggregated, seasons, selectedGenres) {
  return seasons.map(({ season, year }) => {
    const key   = `${season}-${year}`;
    const label = seasonLabel(season, year);
    const point = { season: label, _key: key };
    for (const genre of selectedGenres) {
      point[genre] = countAggregated[key]?.[genre] ?? null;
    }
    return point;
  });
}

/**
 * Top titles ranked by AniList popularity.
 */
export function buildMostWatchedTitles(entries, limit = 10) {
  return [...entries]
    .filter((e) => e.members > 0)
    .sort((a, b) => b.members - a.members)
    .slice(0, limit);
}

/**
 * Build breakout titles: titles that most outperformed their genre avg.
 */
export function buildBreakoutTitles(entries, aggregated) {
  const results = [];

  for (const entry of entries) {
    if (!entry.score) continue;

    const key = `${entry.season}-${entry.year}`;
    for (const genre of entry.genres) {
      const genreAvg = aggregated[key]?.[genre]?.avg;
      if (!genreAvg) continue;
      const delta = parseFloat((entry.score - genreAvg).toFixed(2));
      if (delta > 0) {
        results.push({ ...entry, delta, comparedGenre: genre });
        break; // one entry per title
      }
    }
  }

  // Deduplicate by id and take top 10
  const seen = new Set();
  return results
    .sort((a, b) => b.delta - a.delta)
    .filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    })
    .slice(0, 10);
}
