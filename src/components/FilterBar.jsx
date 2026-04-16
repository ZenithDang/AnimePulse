import { useState, useCallback } from 'react';
import useFilterStore, { SEASONS } from '../store/filterStore';

const SEASON_LABELS = { winter: 'Winter', spring: 'Spring', summer: 'Summer', fall: 'Fall' };
const FORMAT_OPTIONS = ['TV', 'Movie', 'OVA', 'ONA'];

const POPULAR_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Mystery',
  'Supernatural', 'Psychological', 'Mecha', 'Isekai', 'Horror',
  'Thriller', 'Historical', 'Military', 'Music', 'School',
];

const YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 2010 + 1 },
  (_, i) => 2010 + i
).reverse();

export default function FilterBar() {
  const {
    startSeason, startYear, endSeason, endYear,
    selectedGenres, format,
    setStartSeason, setStartYear, setEndSeason, setEndYear,
    setFormat, toggleGenre,
  } = useFilterStore();

  const [genreOpen, setGenreOpen] = useState(false);

  const handleToggleGenre = useCallback((genre) => {
    toggleGenre(genre);
  }, [toggleGenre]);

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{ background: 'var(--bg-base)', borderBottom: '0.5px solid var(--border)' }}
    >
      <div className="max-w-[1600px] mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-2">
          <span
            className="font-semibold text-sm tracking-wide"
            style={{ color: 'var(--accent-violet)' }}
          >
            AnimePulse
          </span>
        </div>

        {/* Season Range */}
        <div className="flex items-center gap-2 text-xs">
          <span style={{ color: 'var(--text-muted)' }}>From</span>
          <SeasonSelect
            season={startSeason}
            year={startYear}
            onSeasonChange={setStartSeason}
            onYearChange={setStartYear}
          />
          <span style={{ color: 'var(--text-muted)' }}>to</span>
          <SeasonSelect
            season={endSeason}
            year={endYear}
            onSeasonChange={setEndSeason}
            onYearChange={setEndYear}
          />
        </div>

        {/* Format Filter */}
        <div className="flex items-center gap-1">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className="px-3 py-1 text-xs transition-colors"
              style={{
                borderRadius: '20px',
                border: `0.5px solid ${format === f ? 'var(--accent-violet)' : 'var(--border)'}`,
                background: format === f ? 'rgba(167,139,250,0.15)' : 'transparent',
                color: format === f ? 'var(--accent-violet)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Genre Multi-Select */}
        <div className="relative">
          <button
            onClick={() => setGenreOpen((o) => !o)}
            className="flex items-center gap-1 px-3 py-1 text-xs transition-colors"
            style={{
              borderRadius: '20px',
              border: '0.5px solid var(--border)',
              background: genreOpen ? 'rgba(167,139,250,0.1)' : 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Genres
            <span
              className="inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full"
              style={{ background: 'var(--accent-violet)', color: '#fff' }}
            >
              {selectedGenres.length}
            </span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.5 }}>
              <path d={genreOpen ? 'M1 5L5 1L9 5' : 'M1 1L5 5L9 1'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {genreOpen && (
            <div
              className="absolute top-full left-0 mt-1 p-3 z-50"
              style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                width: '320px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_GENRES.map((genre) => {
                  const active = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => handleToggleGenre(genre)}
                      className="px-2.5 py-1 text-xs transition-all"
                      style={{
                        borderRadius: '20px',
                        border: `0.5px solid ${active ? 'var(--accent-violet)' : 'var(--border)'}`,
                        background: active ? 'rgba(167,139,250,0.2)' : 'transparent',
                        color: active ? 'var(--accent-violet)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Selected genre pills */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {selectedGenres.map((genre) => (
            <span
              key={genre}
              className="flex items-center gap-1 px-2 py-0.5 text-xs"
              style={{
                borderRadius: '20px',
                background: 'rgba(167,139,250,0.1)',
                border: '0.5px solid rgba(167,139,250,0.3)',
                color: 'var(--accent-violet)',
              }}
            >
              {genre}
              <button
                onClick={() => toggleGenre(genre)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit' }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Backdrop for genre dropdown */}
      {genreOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setGenreOpen(false)}
        />
      )}
    </header>
  );
}

function SeasonSelect({ season, year, onSeasonChange, onYearChange }) {
  return (
    <div className="flex items-center gap-1">
      <select
        value={season}
        onChange={(e) => onSeasonChange(e.target.value)}
        className="text-xs px-2 py-1"
        style={{
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border)',
          borderRadius: '6px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {SEASONS.map((s) => (
          <option key={s} value={s}>{SEASON_LABELS[s]}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="text-xs px-2 py-1"
        style={{
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border)',
          borderRadius: '6px',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
