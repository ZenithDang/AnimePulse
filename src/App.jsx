import { useState, useCallback, lazy, Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import FilterBar         from './components/FilterBar';
import ScoreHeatmap      from './components/ScoreHeatmap';
import TitleDetailPanel  from './components/TitleDetailPanel';
import StatTiles         from './components/StatTiles';
import RankedTitlesPanel from './components/RankedTitlesPanel';

// Recharts-heavy components — split into a separate chunk so the main
// bundle parses and renders faster on first load.
const GenreTrendChart = lazy(() => import('./components/GenreTrendChart'));
const GenreMomentum   = lazy(() => import('./components/GenreMomentum'));
const StudioMomentum  = lazy(() => import('./components/StudioMomentum'));
import {
  ChartSkeleton,
  StatTilesSkeleton,
  CardSkeleton,
  ErrorBanner,
  LoadingBar,
} from './components/SkeletonLoader';

import { useSeasonData }      from './hooks/useSeasonData';
import { useGenreTrends }     from './hooks/useGenreTrends';
import { useUrlSync }         from './hooks/useUrlSync';
import useFilterStore         from './store/filterStore';

export default function App() {
  useUrlSync();

  const queryClient = useQueryClient();
  const { entries, isLoading, isError, errorDetail, seasonRange } = useSeasonData();
  const { selectedGenres } = useFilterStore();

  const {
    aggregated,
    trendData,
    momentumData,
    viewershipMomentumData,
    countMomentumData,
    breakoutTitles,
    studioData,
    studioPopularityData,
    stats,
    viewershipAggregated,
    viewershipTrendData,
    mostWatchedTitles,
    countAggregated,
    countTrendData,
  } = useGenreTrends(entries, seasonRange);

  const [selectedTitle, setSelectedTitle] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);

  const handleTitleClick = useCallback((title) => {
    setSelectedTitle(title);
    setHighlightedId(title.id);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedTitle(null);
  }, []);

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['season'] });
  }, [queryClient]);

  const showSkeleton  = isLoading && entries.length === 0;
  const isRefetching  = isLoading && !showSkeleton;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
      <LoadingBar visible={isRefetching} />
      <FilterBar entries={entries} genresLoading={isLoading} />

      {/* Main two-column layout */}
      <main
        className="flex-1 w-full px-4 py-4 flex flex-col md:flex-row gap-4"
        style={{ maxWidth: '1600px', margin: '0 auto' }}
      >
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {isError && (
            <ErrorBanner
              message={`Failed to load season data${errorDetail ? `: ${errorDetail}` : ''}. Some seasons may not have loaded.`}
              onRetry={handleRetry}
            />
          )}

          {showSkeleton ? (
            <ChartSkeleton height={300} />
          ) : (
            <Suspense fallback={<ChartSkeleton height={300} />}>
              <GenreTrendChart
                trendData={trendData}
                aggregated={aggregated}
                viewershipTrendData={viewershipTrendData}
                viewershipAggregated={viewershipAggregated}
                countTrendData={countTrendData}
                countAggregated={countAggregated}
                onTitleClick={handleTitleClick}
              />
            </Suspense>
          )}

          {showSkeleton ? (
            <ChartSkeleton height={220} />
          ) : (
            <ScoreHeatmap
              aggregated={aggregated}
              viewershipAggregated={viewershipAggregated}
              countAggregated={countAggregated}
              seasonRange={seasonRange}
              selectedGenres={selectedGenres}
            />
          )}

          {showSkeleton ? (
            <ChartSkeleton height={220} />
          ) : (
            <Suspense fallback={<ChartSkeleton height={220} />}>
              <GenreMomentum
                momentumData={momentumData}
                viewershipMomentumData={viewershipMomentumData}
                countMomentumData={countMomentumData}
              />
            </Suspense>
          )}

          {showSkeleton ? (
            <ChartSkeleton height={200} />
          ) : (
            <Suspense fallback={<ChartSkeleton height={200} />}>
              <StudioMomentum studioData={studioData} studioPopularityData={studioPopularityData} />
            </Suspense>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-full md:w-80 md:flex-shrink-0 flex flex-col gap-4">
          {showSkeleton ? <StatTilesSkeleton /> : <StatTiles stats={stats} />}
          {showSkeleton ? (
            <CardSkeleton />
          ) : (
            <RankedTitlesPanel
              breakoutTitles={breakoutTitles}
              mostWatchedTitles={mostWatchedTitles}
              highlightedId={highlightedId}
              onTitleClick={handleTitleClick}
            />
          )}
        </aside>
      </main>

      <TitleDetailPanel title={selectedTitle} onClose={handleClosePanel} />

      <footer
        className="w-full text-center py-3 text-xs"
        style={{ color: 'var(--text-muted)', borderTop: '0.5px solid var(--border)' }}
      >
        Data sourced from{' '}
        <a
          href="https://anilist.co"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent-violet)', textDecoration: 'none' }}
        >
          AniList
        </a>
      </footer>
    </div>
  );
}
