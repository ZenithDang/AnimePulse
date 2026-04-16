import { memo } from 'react';

function StatTiles({ stats }) {
  if (!stats) return null;

  const tiles = [
    {
      label: 'Titles Tracked',
      value: stats.totalTitles.toLocaleString(),
      icon: '◈',
      colour: 'var(--accent-violet)',
    },
    {
      label: 'Seasons Covered',
      value: stats.seasonsCount,
      icon: '◷',
      colour: 'var(--accent-teal)',
    },
    {
      label: 'Top Genre',
      value: stats.topGenre,
      icon: '▲',
      colour: 'var(--accent-amber)',
    },
    {
      label: 'Avg Score',
      value: stats.avgScore ? stats.avgScore.toFixed(2) : '—',
      icon: '★',
      colour: '#fbbf24',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {tiles.map(({ label, value, icon, colour }) => (
        <div
          key={label}
          className="p-3"
          style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm" style={{ color: colour }}>{icon}</span>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
          <p
            className="text-lg font-semibold leading-none truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

export default memo(StatTiles);
