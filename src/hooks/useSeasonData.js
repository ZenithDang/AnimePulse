import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { fetchSeason } from '../api/jikan';
import useFilterStore from '../store/filterStore';
import { matchesFormat } from '../utils/transforms';
import { useDebounce } from './useDebounce';

export function useSeasonData() {
  const { format, startSeason, startYear, endSeason, endYear, getSeasonRange } = useFilterStore();

  const dStartSeason = useDebounce(startSeason, 400);
  const dStartYear   = useDebounce(startYear,   400);
  const dEndSeason   = useDebounce(endSeason,   400);
  const dEndYear     = useDebounce(endYear,     400);

  // Memoised so downstream useMemo deps see a stable reference
  // and only recompute when the debounced range actually changes.
  const seasonRange = useMemo(
    () => getSeasonRange(dStartSeason, dStartYear, dEndSeason, dEndYear),
    [dStartSeason, dStartYear, dEndSeason, dEndYear, getSeasonRange],
  );

  const seasonQueries = useQueries({
    queries: seasonRange.map(({ season, year }) => ({
      queryKey:  ['season', year, season],
      queryFn:   () => fetchSeason(year, season),
      staleTime: 10 * 60 * 1000,
      gcTime:    30 * 60 * 1000,
      retry:     2,
    })),
  });

  const isLoading = seasonQueries.some((q) => q.isLoading);
  const isError   = seasonQueries.some((q) => q.isError);

  const allEntries = seasonQueries
    .flatMap((q) => q.data || [])
    .filter((entry) => matchesFormat(entry, format));

  return { entries: allEntries, isLoading, isError, seasonRange };
}
