import { useMemo } from 'react';

export function useGenres(entries) {
  return useMemo(() => {
    const set = new Set();
    for (const entry of entries) {
      for (const genre of entry.genres) {
        if (genre) set.add(genre);
      }
    }
    return [...set].sort();
  }, [entries]);
}
