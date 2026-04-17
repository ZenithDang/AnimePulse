import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import FilterBar          from './components/FilterBar';
import GenreTrendChart    from './components/GenreTrendChart';
import GenreMomentum      from './components/GenreMomentum';
import ScoreHeatmap       from './components/ScoreHeatmap';
import TitleDetailPanel   from './components/TitleDetailPanel';
import StudioMomentum     from './components/StudioMomentum';
import StatTiles          from './components/StatTiles';
import RankedTitlesPanel  from './components/RankedTitlesPanel';
import {
  ChartSkeleton,
  StatTilesSkeleton,
  CardSkeleton,
  ErrorBanner,
  LoadingBar,
} from './components/SkeletonLoader';

import { useSeasonData }      from './hooks/useSeasonData';
import { useGenreTrends }     from './hooks/useGenreTrends';
import useFilterStore         from './store/filterStore';

export default function App() {
  const queryClient = useQueryClient();
  const { entries, isLoading, isError, seasonRange } = useSeasonData();
  const { selectedGenres } = useFilterStore();

  const {
    aggregated,
    trendData,
    momentumData,
    breakoutTitles,
    studioData,
    stats,
    viewershipAggregated,
    viewershipTrendData,
    mostWatchedTitles,
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
      <FilterBar />

      {/* Main two-column layout */}
      <main
        className="flex-1 w-full px-4 py-4 flex flex-col md:flex-row gap-4"
        style={{ maxWidth: '1600px', margin: '0 auto' }}
      >
        {/* Left column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {isError && (
            <ErrorBanner
              message="Jikan API returned an error. Some seasons may not have loaded."
              onRetry={handleRetry}
            />
          )}

          {showSkeleton ? (
            <ChartSkeleton height={300} />
          ) : (
            <GenreTrendChart
              trendData={trendData}
              aggregated={aggregated}
              viewershipTrendData={viewershipTrendData}
              viewershipAggregated={viewershipAggregated}
              onTitleClick={handleTitleClick}
            />
          )}

          {showSkeleton ? (
            <ChartSkeleton height={220} />
          ) : (
            <ScoreHeatmap
              aggregated={aggregated}
              viewershipAggregated={viewershipAggregated}
              seasonRange={seasonRange}
              selectedGenres={selectedGenres}
            />
          )}

          {showSkeleton ? (
            <ChartSkeleton height={220} />
          ) : (
            <GenreMomentum momentumData={momentumData} />
          )}

          {showSkeleton ? (
            <ChartSkeleton height={200} />
          ) : (
            <StudioMomentum studioData={studioData} />
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
    </div>
  );
}
