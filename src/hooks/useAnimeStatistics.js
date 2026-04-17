import { useQuery } from '@tanstack/react-query';
import { fetchAnimeStatistics } from '../api/jikan';

export function useAnimeStatistics(id) {
  const { data, isLoading } = useQuery({
    queryKey: ['animeStats', id],
    queryFn:  () => fetchAnimeStatistics(id),
    enabled:  !!id,
    staleTime: 10 * 60 * 1000,
    gcTime:    30 * 60 * 1000,
    retry: 1,
  });

  return { stats: data ?? null, isLoading };
}
