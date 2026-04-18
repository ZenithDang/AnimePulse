# AnimePulse — Anime Release Trend Tracker

A dashboard for exploring genre trends, viewership, breakout titles, and studio momentum across anime seasons. Data is sourced from the [AniList GraphQL API](https://anilist.co).

## Features

- **Genre Trends** — multi-line chart showing avg score, avg popularity, or title count per genre across seasons. Each mode includes a dashed **All Genres** baseline showing the all-anime average for that metric, making it easy to see whether a genre is outperforming or riding a broader trend. Hover a data point to see the top 3 titles for that genre/season.
- **Genre Heatmap** — genre × season grid. Toggle between Score (violet), Popularity (teal), and Titles (orange) modes. Score uses a fixed 6.0–9.0 scale; Popularity and Titles scale relative to the current dataset, with the actual min/max values shown in the legend.
- **Genre Momentum** — bar chart showing % change per genre from the first to the last season in the selected range, colour-coded rising/declining. Toggle between Score, Popularity, and Titles.
- **Studio Momentum** — top studios ranked by average score or average popularity across all releases in the selected range (minimum 2 titles).
- **Ranked Titles** — tabbed sidebar panel. *Breakout* lists titles that most outperformed their genre's average score; *Most Watched* lists titles by AniList popularity. Click any card to open the detail panel.
- **Title Detail Panel** — slide-in drawer with cover image, score, popularity, genres, synopsis, and a Viewership Breakdown section. The breakdown fires a single AniList statistics request on open and renders a segmented Watching / Completed / On Hold / Dropped / Plan to Watch bar with a colour-coded legend.
- **Summary Stat Tiles** — six tiles: Titles Tracked, Seasons Covered, Top Genre (by count), Avg Score, Most Watched Genre (by cumulative popularity), and Avg Popularity / Title.

## Filters

All filter state persists across sessions via `localStorage` and is reflected in the URL — shareable links restore the exact view.

- **Season range** — select start and end season/year. Defaults to the last 6 completed seasons.
- **+ Current season toggle** — opt in to including the in-progress season. Off by default since incomplete data can skew scores and counts.
- **Format** — TV, Movie, OVA, ONA.
- **Top 50 / All titles toggle** — defaults to the top 50 titles per season by popularity (fast, 1 request per season). Enable *All titles* to paginate through the full season data (slower, multiple requests per season).
- **Genre multi-select** — searchable dropdown. Only genres present in the loaded data are shown.

## Stack

| Layer         | Choice                          |
| ------------- | ------------------------------- |
| Framework     | React 19 + Vite 8               |
| Styling       | Tailwind CSS v4                 |
| Charts        | Recharts                        |
| Data fetching | TanStack React Query v5         |
| State         | Zustand v5 (with persistence)   |
| API           | AniList GraphQL                 |

## Getting Started

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. On first load it pre-populates with the last 6 seasons across 5 default genres — there is no empty state.

The layout is fully responsive. On mobile the filter controls collapse behind a **Filters** toggle button in the header, and the sidebar stacks below the charts.

## Project Structure

```text
src/
  api/
    anilist.js            — AniList GraphQL client, season pagination (top-50 or full),
                            per-title statistics fetch, response normaliser,
                            and concurrency-limited request queue (max 3 in-flight)
  components/
    FilterBar.jsx         — season range, current season toggle, Top 50/All titles toggle,
                            genre multi-select, format filter; collapses to a toggle on mobile
    GenreTrendChart.jsx   — tabbed Score / Popularity / Titles line chart with All Genres baseline
    ScoreHeatmap.jsx      — tabbed Score / Popularity / Titles genre × season heatmap
    GenreMomentum.jsx     — % change bar chart (Score / Popularity / Titles)
    StudioMomentum.jsx    — top studios by avg score or avg popularity
    RankedTitlesPanel.jsx — tabbed Breakout / Most Watched title list
    TitleDetailPanel.jsx  — slide-in detail drawer with completion funnel
    StatTiles.jsx         — 6-tile summary (score + popularity stats)
    SkeletonLoader.jsx    — loading skeletons and error banner
  hooks/
    useSeasonData.js      — React Query hook for season fetching + format filter
    useGenreTrends.js     — score, popularity, count, and baseline aggregation for all charts
    useAnimeStatistics.js — on-demand per-title statistics for the detail panel
    useGenres.js          — derives available genres from loaded entries
    useDebounce.js        — debounces season range inputs
    useUrlSync.js         — bidirectional sync between filter store and URL search params
  store/
    filterStore.js        — Zustand store with persistence (filter state, current season toggle,
                            Top 50/All titles flag)
    uiStore.js            — Zustand store with persistence (active tab per chart panel)
  utils/
    transforms.js         — API normalisation, score / popularity / count aggregation,
                            chart data builders, HTML entity decoder
    colours.js            — genre → accent colour mapping
    requestQueue.js       — concurrency limiter for AniList API requests
```

## API Notes

- AniList requests are proxied through `/anilist-gql` — Vite handles this in development (`vite.config.js`), Vercel handles it in production (`vercel.json`).
- Adult content is filtered at the query level via `isAdult: false`.
- By default the app fetches only the first page per season (top 50 titles by popularity). Enable *All titles* in the filter bar to paginate through the full season. Both datasets are cached independently — switching back to Top 50 after a full fetch is instant.
- A concurrency limiter caps AniList requests to 3 in-flight at a time. Retries on 429 responses are capped at 3 attempts and honour the `Retry-After` header.
- React Query persists the cache to `localStorage` (24-hour TTL, key `animepulse-cache-v2`). Returning users within that window see data instantly with no network requests. After 10 minutes the cache is stale and silently refetches in the background.
- Genre list is derived client-side from loaded entries — the dropdown only shows genres present in the selected season range.
- Per-title statistics are fetched on demand when a detail panel opens, cached for the session. Closing and reopening the same title is instant.

## Deployment

```bash
npm run build        # outputs to dist/
npx vercel           # deploy to Vercel
```
