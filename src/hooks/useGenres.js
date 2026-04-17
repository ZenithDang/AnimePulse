import { useQuery } from '@tanstack/react-query';
import { fetchGenres } from '../api/jikan';

export function useGenres() {
  const { data, isLoading } = useQuery({
    queryKey: ['genres'],
    queryFn:  fetchGenres,
    staleTime: 24 * 60 * 60 * 1000, // 24 h — genre list rarely changes
    gcTime:    48 * 60 * 60 * 1000, // 48 h
    retry: 2,
  });

  return { genres: data ?? [], isLoading };
}
