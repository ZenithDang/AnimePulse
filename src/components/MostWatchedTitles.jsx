import { memo } from 'react';
import { getGenreColour } from '../utils/colours';
import { seasonLabel } from '../utils/transforms';

function formatMembers(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function MembersBadge({ members }) {
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: 'rgba(244,114,182,0.12)',
        border: '0.5px solid rgba(244,114,182,0.4)',
        color: '#f472b6',
      }}
    >
      {formatMembers(members)}
    </span>
  );
}

function MostWatchedTitles({ titles, highlightedId, onTitleClick }) {
  if (!titles?.length) return null;

  return (
    <div
      className="p-4"
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)', margin: 0 }}
        >
          Most Watched Titles
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          By AniList popularity
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {titles.map((title, idx) => {
          const isHighlighted = highlightedId === title.id;
          const genreColour   = getGenreColour(title.genres?.[0] || '');

          return (
            <button
              key={title.id}
              onClick={() => onTitleClick(title)}
              className="w-full text-left p-2.5 transition-all"
              style={{
                background: isHighlighted ? 'rgba(244,114,182,0.08)' : 'rgba(255,255,255,0.02)',
                border: `0.5px solid ${isHighlighted ? 'rgba(244,114,182,0.35)' : 'var(--border)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-start gap-2.5">
                {/* Rank + colour block */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    #{idx + 1}
                  </span>
                  <div
                    className="w-1.5 h-8 rounded-full"
                    style={{ background: genreColour, opacity: 0.7 }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span
                      className="text-xs font-medium leading-tight line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {title.title}
                    </span>
                    <MembersBadge members={title.members} />
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    <span>{title.studio}</span>
                    <span>·</span>
                    <span>{seasonLabel(title.season, title.year)}</span>
                    {title.episodes && (
                      <>
                        <span>·</span>
                        <span>{title.episodes} ep{title.episodes !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {(title.genres || []).slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        className="text-[10px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: `color-mix(in srgb, ${getGenreColour(genre)} 12%, transparent)`,
                          color: getGenreColour(genre),
                          border: `0.5px solid color-mix(in srgb, ${getGenreColour(genre)} 30%, transparent)`,
                        }}
                      >
                        {genre}
                      </span>
                    ))}
                    {title.score && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
                        style={{
                          color: 'var(--accent-amber)',
                          background: 'rgba(251,191,36,0.1)',
                          border: '0.5px solid rgba(251,191,36,0.3)',
                        }}
                      >
                        ★ {title.score.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(MostWatchedTitles);
