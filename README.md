# AnimePulse — Anime Release Trend Tracker

A dashboard for exploring genre trends, viewership, breakout titles, and studio momentum across anime seasons. Data is sourced from the [Jikan API](https://jikan.moe/) (MyAnimeList).

## Features

- **Genre Trends** — multi-line chart showing average MAL score or MAL member count per genre across seasons. Toggle between Score and Members with the pill switch. Hover a data point to see the top 3 titles for that genre/season.
- **Genre Heatmap** — genre × season grid. Toggle between Score (violet) and Members (teal) modes. Cells use opacity-scaled accent colours so low values are always visible against the dark background. Members mode normalises to the visible dataset's range; a "(relative)" label in the legend makes this explicit.
- **Genre Momentum** — bar chart showing % score change per genre from the first to the last season in the selected range, colour-coded rising/declining.
- **Studio Momentum** — top studios ranked by average score across all releases in the selected range (minimum 2 titles).
- **Ranked Titles** — tabbed sidebar panel. *Breakout* lists titles that most outperformed their genre's average score; *Most Watched* lists titles by raw MAL member count. Click any card to open the detail panel.
- **Title Detail Panel** — slide-in drawer with cover image, score, member count, genres, synopsis, and a Viewership Breakdown section. The breakdown fires a single `/anime/{id}/statistics` request on open and renders a segmented Watching / Completed / On Hold / Dropped / Plan to Watch bar with a colour-coded legend.
- **Summary Stat Tiles** — six tiles: Titles Tracked, Seasons Covered, Top Genre (by count), Avg Score, Most Watched Genre (by cumulative members), and Avg Members / Title.

## Stack

| Layer         | Choice                               |
| ------------- | ------------------------------------ |
| Framework     | React 19 + Vite 8                    |
| Styling       | Tailwind CSS v4                      |
| Charts        | Recharts                             |
| Data fetching | TanStack React Query v5              |
| State         | Zustand v5                           |
| API           | Jikan REST v4 (MyAnimeList)          |

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
    jikan.js              — rate-limited Jikan client, response normaliser,
                            season pagination, and per-title statistics fetch
  components/
    FilterBar.jsx         — season range, genre multi-select, format filter; collapses to a toggle on mobile
    GenreTrendChart.jsx   — tabbed Score / Members line chart
    ScoreHeatmap.jsx      — tabbed Score / Members genre × season heatmap
    GenreMomentum.jsx     — % score change bar chart
    StudioMomentum.jsx    — top studios by avg score
    RankedTitlesPanel.jsx — tabbed Breakout / Most Watched title list
    TitleDetailPanel.jsx  — slide-in detail drawer with completion funnel
    StatTiles.jsx         — 6-tile summary (score + viewership stats)
    SkeletonLoader.jsx    — loading skeletons and error banner
  hooks/
    useSeasonData.js      — React Query hook for season fetching + format filter
    useGenreTrends.js     — score and viewership aggregation for all charts
    useAnimeStatistics.js — on-demand per-title statistics for the detail panel
    useDebounce.js        — debounces season range inputs
  store/
    filterStore.js        — Zustand store (single source of truth for filter state)
  utils/
    transforms.js         — API normalisation, score + viewership aggregation,
                            chart data builders
    colours.js            — genre → accent colour mapping
```

## API Notes

- Jikan is rate-limited to 3 req/sec. The client enforces a 400ms minimum interval between requests via a serial promise queue and backs off 1.5s on 429 responses.
- Season range inputs are debounced 400ms so scrolling through years doesn't fire a request for every intermediate value.
- React Query caches season data for 10 minutes (stale) / 30 minutes (gc). Changing genres or format never triggers a new network request — filtering is applied client-side.
- Per-title statistics (`/anime/{id}/statistics`) are fetched on demand when a detail panel opens, cached 10 minutes per title. Closing and reopening the same title is instant.

## Deployment

```bash
npm run build        # outputs to dist/
npx vercel           # deploy to Vercel
```
