import { useEffect } from 'react';
import { getGenreColour } from '../utils/colours';
import { seasonLabel } from '../utils/transforms';

export default function TitleDetailPanel({ title, onClose }) {
  // Close on Escape
  useEffect(() => {
    if (!title) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [title, onClose]);

  if (!title) return null;

  const synopsis = title.synopsis
    ? title.synopsis.slice(0, 300) + (title.synopsis.length > 300 ? '…' : '')
    : 'No synopsis available.';

  return (
    <>
      {/* Dimmed overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 'min(400px, 100vw)',
          background: 'var(--bg-card)',
          borderLeft: '0.5px solid var(--border)',
          animation: 'slideIn 0.2s ease-out',
          overflowY: 'auto',
        }}
      >
        {/* Header image area */}
        <div
          className="relative flex-shrink-0"
          style={{
            height: '180px',
            background: title.image
              ? `url(${title.image}) center/cover no-repeat`
              : `linear-gradient(135deg, ${getGenreColour(title.genres?.[0] || '')}33, var(--bg-base))`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, var(--bg-card))' }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full transition-colors"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: '0.5px solid var(--border)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Title */}
          <h2
            className="text-base font-semibold leading-snug"
            style={{ color: 'var(--text-primary)', margin: 0 }}
          >
            {title.title}
          </h2>

          {/* Meta row */}
          <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            {title.studio && <span>{title.studio}</span>}
            {title.season && title.year && (
              <>
                <span>·</span>
                <span>{seasonLabel(title.season, title.year)}</span>
              </>
            )}
            {title.type && (
              <>
                <span>·</span>
                <span>{title.type}</span>
              </>
            )}
            {title.episodes && (
              <>
                <span>·</span>
                <span>{title.episodes} ep{title.episodes !== 1 ? 's' : ''}</span>
              </>
            )}
          </div>

          {/* Score + Members */}
          <div className="flex gap-3">
            {title.score && (
              <div
                className="flex-1 p-3 text-center rounded-lg"
                style={{ background: 'rgba(167,139,250,0.08)', border: '0.5px solid rgba(167,139,250,0.2)' }}
              >
                <p className="text-xl font-bold" style={{ color: 'var(--accent-violet)' }}>
                  {title.score.toFixed(2)}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>MAL Score</p>
              </div>
            )}
            {title.members > 0 && (
              <div
                className="flex-1 p-3 text-center rounded-lg"
                style={{ background: 'rgba(52,211,153,0.08)', border: '0.5px solid rgba(52,211,153,0.2)' }}
              >
                <p className="text-xl font-bold" style={{ color: 'var(--accent-teal)' }}>
                  {title.members >= 1000000
                    ? `${(title.members / 1000000).toFixed(1)}M`
                    : title.members >= 1000
                    ? `${(title.members / 1000).toFixed(0)}K`
                    : title.members}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Members</p>
              </div>
            )}
          </div>

          {/* Genres */}
          {title.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {title.genres.map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: `color-mix(in srgb, ${getGenreColour(genre)} 12%, transparent)`,
                    color: getGenreColour(genre),
                    border: `0.5px solid color-mix(in srgb, ${getGenreColour(genre)} 30%, transparent)`,
                  }}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis */}
          <div>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Synopsis</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {synopsis}
            </p>
          </div>

          {/* MAL Link */}
          {title.malUrl && (
            <a
              href={title.malUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 text-xs font-medium transition-colors mt-auto"
              style={{
                background: 'rgba(167,139,250,0.1)',
                border: '0.5px solid rgba(167,139,250,0.3)',
                borderRadius: '8px',
                color: 'var(--accent-violet)',
                textDecoration: 'none',
              }}
            >
              View on MyAnimeList ↗
            </a>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
