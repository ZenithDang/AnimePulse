# AnimePulse — Anime Release Trend Tracker

A dashboard for exploring genre trends, breakout titles, and studio momentum across anime seasons. Data is sourced from the [Jikan API](https://jikan.moe/) (MyAnimeList) with [AniList](https://anilist.co/) as a supplementary source.

## Features

- **Genre Trend Chart** — multi-line chart showing average MAL score per genre across seasons. Hover a data point to see the top 3 titles driving that score.
- **Score Heatmap** — genre × season grid with colour-interpolated cells for spotting cross-season patterns at a glance.
- **Genre Momentum** — horizontal bar chart showing % score change per genre over the selected period, colour-coded rising/declining.
- **Breakout Titles** — ranked list of titles that most outperformed their genre's average score. Click any card to open a detail panel.
- **Studio Momentum** — top studios ranked by average score across all releases in the selected range.
- **Title Detail Panel** — slide-in panel with synopsis, score, member count, genres, and a link to MyAnimeList.
- **Summary Stat Tiles** — total titles tracked, seasons covered, top genre, and average score.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Data fetching | TanStack React Query |
| State | Zustand |
| APIs | Jikan REST (primary), AniList GraphQL (supplementary) |

## Getting Started

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. On first load it pre-populates with the last 6 seasons across 5 default genres — there is no empty state.

## Project Structure

```text
src/
  api/
    jikan.js          — rate-limited Jikan client + response normaliser
    anilist.js        — AniList GraphQL client
  components/
    FilterBar.jsx     — season range, genre multi-select, format filter
    GenreTrendChart.jsx
    GenreMomentum.jsx
    ScoreHeatmap.jsx
    BreakoutTitles.jsx
    TitleDetailPanel.jsx
    StudioMomentum.jsx
    StatTiles.jsx
    SkeletonLoader.jsx
  hooks/
    useSeasonData.js  — React Query hook for season fetching
    useGenreTrends.js — derived trend aggregation
    useDebounce.js    — debounces season range inputs before triggering fetches
  store/
    filterStore.js    — Zustand store (single source of truth for filter state)
  utils/
    transforms.js     — API normalisation + chart data aggregation
    colours.js        — genre → accent colour mapping
```

## API Notes

- Jikan is rate-limited to 3 req/sec. The client enforces a 400ms minimum interval between requests and backs off on 429 responses.
- Season range inputs are debounced by 400ms so scrolling through years doesn't fire a request for every intermediate value.
- React Query caches season data for 10 minutes (stale) / 30 minutes (gc). Changing genres or format never triggers a new network request — filtering is applied client-side on already-fetched data.

## Deployment

```bash
npm run build        # outputs to dist/
npx vercel           # deploy to Vercel
```
