import { normaliseAnilistEntry } from '../utils/transforms';

const BASE_URL = 'https://graphql.anilist.co';

const SEASON_QUERY = `
  query ($season: MediaSeason, $seasonYear: Int, $page: Int, $format: MediaFormat) {
    Page(page: $page, perPage: 50) {
      pageInfo {
        hasNextPage
      }
      media(
        season: $season,
        seasonYear: $seasonYear,
        type: ANIME,
        format: $format,
        sort: POPULARITY_DESC
      ) {
        id
        idMal
        title { english romaji }
        genres
        format
        episodes
        meanScore
        popularity
        favourites
        season
        seasonYear
        description(asHtml: false)
        coverImage { large }
        studios(isMain: true) { nodes { name } }
      }
    }
  }
`;

const JIKAN_TO_ANILIST_SEASON = {
  winter: 'WINTER',
  spring: 'SPRING',
  summer: 'SUMMER',
  fall:   'FALL',
};

async function graphqlFetch(query, variables) {
  const response = await fetch(BASE_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    throw new Error(`AniList GraphQL error: ${json.errors[0].message}`);
  }
  return json.data;
}

/**
 * Fetch AniList data for a given season as enrichment data.
 * Keyed by MAL ID for easy merging.
 */
export async function fetchAnilistSeason(year, season, format = 'TV') {
  const anilistSeason = JIKAN_TO_ANILIST_SEASON[season];
  if (!anilistSeason) return {};

  const formatMap = { TV: 'TV', Movie: 'MOVIE', OVA: 'OVA', ONA: 'ONA' };
  const anilistFormat = formatMap[format];

  try {
    const data = await graphqlFetch(SEASON_QUERY, {
      season:     anilistSeason,
      seasonYear: year,
      page:       1,
      format:     anilistFormat,
    });

    const entries = (data?.Page?.media || []).map(normaliseAnilistEntry);
    const byMalId = {};
    for (const e of entries) {
      if (e.id) byMalId[e.id] = e;
    }
    return byMalId;
  } catch {
    // AniList is supplementary — fail silently
    return {};
  }
}

/**
 * Merge AniList enrichment into Jikan entries.
 * Uses AniList popularity as a secondary members signal when Jikan's is low.
 */
export function mergeWithAnilist(jikanEntries, anilistMap) {
  return jikanEntries.map((entry) => {
    const anilist = anilistMap[entry.id];
    if (!anilist) return entry;

    return {
      ...entry,
      // Use whichever popularity signal is higher
      members: Math.max(entry.members, anilist.members),
      // Fill missing synopsis from AniList
      synopsis: entry.synopsis || anilist.synopsis,
    };
  });
}
