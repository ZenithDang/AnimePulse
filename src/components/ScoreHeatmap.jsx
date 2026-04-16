import { useState, Fragment, memo } from 'react';
import { seasonLabel } from '../utils/transforms';

/** Interpolate between two hex colours by a 0-1 factor */
function interpolateColour(t) {
  // #2d1b69 → #a78bfa
  const low  = [45, 27, 105];
  const high = [167, 139, 250];
  const r = Math.round(low[0] + (high[0] - low[0]) * t);
  const g = Math.round(low[1] + (high[1] - low[1]) * t);
  const b = Math.round(low[2] + (high[2] - low[2]) * t);
  return `rgb(${r},${g},${b})`;
}

const HeatCell = memo(function HeatCell({ genre, season, year, data }) {
  const [hover, setHover] = useState(false);

  if (!data) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '6px',
          height: '36px',
        }}
      />
    );
  }

  const { avg, count } = data;
  // Normalise score to 0-1 within 6-9 range
  const t = Math.max(0, Math.min(1, (avg - 6) / 3));
  const bg = interpolateColour(t);

  return (
    <div
      className="relative flex items-center justify-center text-xs font-medium cursor-default transition-transform"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: bg,
        borderRadius: '6px',
        height: '36px',
        color: t > 0.5 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.15s ease',
        zIndex: hover ? 2 : 1,
      }}
    >
      {avg?.toFixed(1)}

      {hover && (
        <div
          className="absolute bottom-full left-1/2 mb-2 p-2 text-xs whitespace-nowrap z-10"
          style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: '8px',
            transform: 'translateX(-50%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            color: 'var(--text-primary)',
          }}
        >
          <span style={{ color: 'var(--text-secondary)' }}>{genre}</span>
          {' · '}
          <span style={{ color: 'var(--text-secondary)' }}>{seasonLabel(season, year)}</span>
          <br />
          Avg: <strong>{avg?.toFixed(2)}</strong> · {count} title{count !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
});

function ScoreHeatmap({ aggregated, seasonRange, selectedGenres }) {
  if (!aggregated || !seasonRange?.length || !selectedGenres?.length) return null;

  return (
    <div
      className="p-4"
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        overflowX: 'auto',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)', margin: 0 }}
        >
          Score Heatmap
        </h2>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--heatmap-low)' }}>Low</span>
          <div
            className="h-2 rounded-full"
            style={{
              width: '60px',
              background: 'linear-gradient(to right, var(--heatmap-low), var(--heatmap-high))',
            }}
          />
          <span style={{ color: 'var(--heatmap-high)' }}>High</span>
        </div>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `80px repeat(${seasonRange.length}, minmax(44px, 1fr))`,
        }}
      >
        {/* Header row */}
        <div />
        {seasonRange.map(({ season, year }) => (
          <div
            key={`${season}-${year}`}
            className="text-center text-[10px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {seasonLabel(season, year)}
          </div>
        ))}

        {/* Genre rows */}
        {selectedGenres.map((genre) => (
          <Fragment key={genre}>
            <div
              className="flex items-center text-xs truncate pr-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {genre}
            </div>
            {seasonRange.map(({ season, year }) => {
              const key  = `${season}-${year}`;
              const data = aggregated[key]?.[genre] || null;
              return (
                <HeatCell
                  key={`${genre}-${key}`}
                  genre={genre}
                  season={season}
                  year={year}
                  data={data}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default memo(ScoreHeatmap);
