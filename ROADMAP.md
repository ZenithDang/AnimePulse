# AnimePulse — Roadmap

## In Progress

- **Genre drill-down** (`/genres/:genre`) — route and navigation wired up; page content is a placeholder. Planned: ranked titles, score distribution, best/worst seasons, momentum for that genre.
- **Hidden gem finder** (`/discover`) — route exists as a placeholder. Planned: titles with high scores but low popularity — critically appreciated, under-watched.

## Completed

- **Studio × Genre Matrix** — heatmap on the Studios page. Score / Popularity / Titles modes, hover tooltip with example titles.
- **Genre co-occurrence chord diagram** — arc size = total title count; ribbon width = shared title count. Hover to highlight connections, click to navigate to genre drill-down.
- **Genre navigation** — every genre label across all charts (trend chart legend, heatmap row headers, momentum Y-axis, chord diagram arcs, stat tiles, ranked title cards) navigates to `/genres/:genre`.
- **Multi-page routing** — Trends, Studios, Discover, and Genre drill-down pages with a persistent NavBar.

## Planned

### Data Gaps

- **Season comparison mode** — select any two seasons and diff them directly: which genres rose/fell, which titles appeared or disappeared. The trend chart shows change over time but can't isolate two points head-to-head.

### Making Existing Data Richer

- **Score distribution** — averages hide polarisation. A histogram or box plot per genre would show whether quality is consistent or whether one breakout title is pulling the average up.

### Visualisation

- **Seasonal pattern chart** — a radial/polar layout placing Winter, Spring, Summer, Fall as quadrants and years as concentric rings, making cyclical genre patterns explicit rather than implied by the heatmap.
- **Shareable snapshots** — URL sync already exists for filters; extend it to deep-link to a specific panel + filter state for sharing a particular view.

### Infrastructure

- **Vercel KV caching proxy** — replace the current passthrough `vercel.json` rewrite with a serverless function that caches AniList responses server-side (Vercel KV). First user of the day fetches live; everyone after gets a cached response instantly. Completed seasons could be cached for days; current season for ~1 hour.
- **Build-time static JSON** — pre-generate season data as static JSON files at build time and hydrate React Query from them before making any network requests. Requires a scheduled CI rebuild to stay fresh but needs no new infrastructure.
