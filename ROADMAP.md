# AnimePulse — Roadmap & Known Issues

## Feature Ideas

- **Vercel KV caching proxy** — replace the current passthrough `vercel.json` rewrite with a serverless function that caches AniList responses server-side (Vercel KV). First user of the day fetches live; everyone after gets a cached response instantly. Completed seasons could be cached for days; current season for ~1 hour.
- **Build-time static JSON** — alternative to the KV proxy. Pre-generate season data as static JSON files at build time and hydrate React Query from them before making any network requests. Requires a scheduled CI rebuild to stay fresh but needs no new infrastructure.
