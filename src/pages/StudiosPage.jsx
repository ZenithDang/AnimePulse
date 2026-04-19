import { Suspense, lazy } from 'react';
import { useSeasonData }   from '../hooks/useSeasonData';
import { useGenreTrends }  from '../hooks/useGenreTrends';
import useFilterStore      from '../store/filterStore';
import StudioGenreMatrix   from '../components/StudioGenreMatrix';
import { ChartSkeleton }   from '../components/SkeletonLoader';

const StudioMomentum = lazy(() => import('../components/StudioMomentum'));

export default function StudiosPage() {
  const { entries, isLoading, seasonRange } = useSeasonData();
  const { selectedGenres } = useFilterStore();
  const { studioData, studioPopularityData, studioGenreData } = useGenreTrends(entries, seasonRange);

  const showSkeleton = isLoading && entries.length === 0;

  return (
    <main className="flex-1 w-full px-4 py-4 flex flex-col gap-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>
      {showSkeleton ? (
        <ChartSkeleton height={360} />
      ) : (
        <Suspense fallback={<ChartSkeleton height={360} />}>
          <StudioMomentum studioData={studioData} studioPopularityData={studioPopularityData} />
        </Suspense>
      )}

      {showSkeleton ? (
        <ChartSkeleton height={300} />
      ) : (
        <StudioGenreMatrix studioGenreData={studioGenreData} selectedGenres={selectedGenres} />
      )}
    </main>
  );
}
