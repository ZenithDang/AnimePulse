import { useState, useCallback, lazy, Suspense } from 'react';

import ScoreHeatmap      from '../components/ScoreHeatmap';
import StatTiles         from '../components/StatTiles';
import GenreChordDiagram from '../components/GenreChordDiagram';
import RankedTitlesPanel from '../components/RankedTitlesPanel';
import {
  ChartSkeleton,
  StatTilesSkeleton,
  CardSkeleton,
} from '../components/SkeletonLoader';

import { useSeasonData }  from '../hooks/useSeasonData';
import { useGenreTrends } from '../hooks/useGenreTrends';
import useFilterStore     from '../store/filterStore';

const GenreTrendChart = lazy(() => import('../components/GenreTrendChart'));
const GenreMomentum   = lazy(() => import('../components/GenreMomentum'));

export default function TrendsPage({ onTitleClick }) {
  const { entries, isLoading, seasonRange } = useSeasonData();
  const { selectedGenres } = useFilterStore();

  const {
    aggregated,
    trendData,
    momentumData,
    viewershipMomentumData,
    countMomentumData,
    breakoutTitles,
    mostWatchedTitles,
    viewershipAggregated,
    viewershipTrendData,
    countAggregated,
    countTrendData,
    cooccurrence,
    stats,
  } = useGenreTrends(entries, seasonRange);

  const [highlightedId, setHighlightedId] = useState(null);

  const handleTitleClick = useCallback((title) => {
    setHighlightedId(title.id);
    onTitleClick(title);
  }, [onTitleClick]);

  const showSkeleton = isLoading && entries.length === 0;

  return (
    <main className="flex-1 w-full px-4 py-4 flex flex-col gap-4" style={{ maxWidth: '1600px', margin: '0 auto' }}>

      {/* Stat tiles — full-width summary row */}
      {showSkeleton ? <StatTilesSkeleton /> : <StatTiles stats={stats} />}

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* Left column — charts */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
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
            <ChartSkeleton height={220} />
          ) : (
            <GenreChordDiagram cooccurrence={cooccurrence} />
          )}
        </div>

        {/* Right sidebar — ranked titles */}
        <aside className="w-full md:w-80 md:flex-shrink-0">
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
      </div>
    </main>
  );
}
