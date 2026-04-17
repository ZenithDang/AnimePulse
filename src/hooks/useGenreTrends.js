import { useMemo } from 'react';
import useFilterStore from '../store/filterStore';
import {
  aggregateByGenre,
  buildTrendChartData,
  buildMomentumData,
  buildBreakoutTitles,
  aggregateViewershipByGenre,
  buildViewershipTrendData,
  buildMostWatchedTitles,
} from '../utils/transforms';

/**
 * Derives all chart-ready data from normalised entries.
 * Accepts seasonRange from useSeasonData so it shares the same stable reference
 * rather than calling getSeasonRange() again and producing a new array.
 */
export function useGenreTrends(entries, seasonRange) {
  const { selectedGenres } = useFilterStore();

  const aggregated = useMemo(
    () => aggregateByGenre(entries),
    [entries],
  );

  const trendData = useMemo(
    () => buildTrendChartData(aggregated, seasonRange, selectedGenres),
    [aggregated, seasonRange, selectedGenres],
  );

  const momentumData = useMemo(
    () => buildMomentumData(aggregated, seasonRange, selectedGenres),
    [aggregated, seasonRange, selectedGenres],
  );

  const breakoutTitles = useMemo(
    () => buildBreakoutTitles(entries, aggregated),
    [entries, aggregated],
  );

  const viewershipAggregated = useMemo(
    () => aggregateViewershipByGenre(entries),
    [entries],
  );

  const viewershipTrendData = useMemo(
    () => buildViewershipTrendData(viewershipAggregated, seasonRange, selectedGenres),
    [viewershipAggregated, seasonRange, selectedGenres],
  );

  const mostWatchedTitles = useMemo(
    () => buildMostWatchedTitles(entries),
    [entries],
  );

  const studioData = useMemo(() => {
    const map = {};
    for (const entry of entries) {
      if (!entry.score || !entry.studio) continue;
      if (!map[entry.studio]) map[entry.studio] = { scores: [] };
      map[entry.studio].scores.push(entry.score);
    }
    return Object.entries(map)
      .map(([studio, { scores }]) => ({
        studio,
        avg:   parseFloat((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2)),
        count: scores.length,
      }))
      .filter((s) => s.count >= 2)
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 15);
  }, [entries]);

  const stats = useMemo(() => {
    const scored = entries.filter((e) => e.score);
    const genreCounts = {};
    for (const e of entries) {
      for (const g of e.genres) genreCounts[g] = (genreCounts[g] || 0) + 1;
    }
    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const avgScore = scored.length
      ? parseFloat((scored.reduce((s, e) => s + e.score, 0) / scored.length).toFixed(2))
      : 0;

    // Viewership stats
    const withMembers = entries.filter((e) => e.members > 0);
    const avgMembers = withMembers.length
      ? Math.round(withMembers.reduce((s, e) => s + e.members, 0) / withMembers.length)
      : 0;
    const peakMembers = withMembers.length
      ? Math.max(...withMembers.map((e) => e.members))
      : 0;
    const genreMembers = {};
    for (const e of entries) {
      if (!e.members) continue;
      for (const g of e.genres) genreMembers[g] = (genreMembers[g] || 0) + e.members;
    }
    const mostWatchedGenre = Object.entries(genreMembers).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

    return {
      totalTitles:  entries.length,
      seasonsCount: seasonRange.length,
      topGenre,
      avgScore,
      avgMembers,
      peakMembers,
      mostWatchedGenre,
    };
  }, [entries, seasonRange]);

  return {
    aggregated,
    trendData,
    momentumData,
    breakoutTitles,
    studioData,
    stats,
    viewershipAggregated,
    viewershipTrendData,
    mostWatchedTitles,
  };
}
