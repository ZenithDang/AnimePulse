import { useQuery } from '@tanstack/react-query';
import { fetchAnilistStatistics } from '../api/anilist';

export function useAnimeStatistics(anilistId) {
  const { data, isLoading } = useQuery({
    queryKey: ['animeStats', anilistId],
    queryFn:  () => fetchAnilistStatistics(anilistId),
    enabled:  !!anilistId,
    staleTime: 10 * 60 * 1000,
    gcTime:    24 * 60 * 60 * 1000, // match persister maxAge so stats survive page refreshes
    retry: 1,
  });

  return { stats: data ?? null, isLoading };
}
