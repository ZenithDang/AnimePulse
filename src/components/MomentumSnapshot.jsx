import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

function GenreBar({ d, maxAbs }) {
  const navigate = useNavigate();
  const pct    = maxAbs > 0 ? (Math.abs(d.change) / maxAbs) * 100 : 0;
  const colour = d.change >= 0 ? 'var(--accent-teal)' : 'var(--accent-amber)';

  return (
    <button
      onClick={() => navigate(`/genres/${d.genre}`)}
      className="w-full flex items-center gap-2"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <span
        className="text-[10px] truncate flex-shrink-0"
        style={{ color: 'var(--text-secondary)', width: 60 }}
      >
        {d.genre}
      </span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: colour, opacity: 0.85, transition: 'width 0.4s ease' }}
        />
      </div>
      <span
        className="text-[10px] flex-shrink-0 text-right"
        style={{ color: colour, width: 38 }}
      >
        {d.change > 0 ? '+' : ''}{d.change}%
      </span>
    </button>
  );
}

function StudioRow({ s, minScore, maxScore }) {
  const navigate    = useNavigate();
  const trendIcon   = s.trend === 'up' ? '↑' : s.trend === 'down' ? '↓' : '→';
  const trendColour = s.trend === 'up' ? 'var(--accent-teal)' : s.trend === 'down' ? 'var(--accent-amber)' : 'var(--text-muted)';
  const range    = maxScore - minScore;
  const scorePct = range > 0 && s.avgScore != null
    ? ((s.avgScore - minScore) / range) * 100
    : 100;

  return (
    <button
      onClick={() => navigate(`/studios/${s.studio}`)}
      className="w-full flex items-center gap-2"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <span className="text-xs font-semibold flex-shrink-0" style={{ color: trendColour, width: 12 }}>
        {trendIcon}
      </span>
      <span
        className="text-[10px] truncate flex-shrink-0"
        style={{ color: 'var(--text-secondary)', width: 72 }}
      >
        {s.studio}
      </span>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${scorePct}%`, background: 'var(--accent-violet)', opacity: 0.75, transition: 'width 0.4s ease' }}
        />
      </div>
      <span
        className="text-[10px] flex-shrink-0 text-right"
        style={{ color: '#fbbf24', width: 34 }}
      >
        ★ {s.avgScore?.toFixed(1) ?? '—'}
      </span>
    </button>
  );
}

function MomentumSnapshot({ momentumData, studioTableData }) {
  if (!momentumData?.length && !studioTableData?.length) return null;

  const rising  = momentumData.filter((d) => d.change > 0).slice(0, 3);
  const falling = [...momentumData].reverse().filter((d) => d.change < 0).slice(0, 3);
  const displayed = [...rising, ...falling];
  const maxAbs  = Math.max(...displayed.map((d) => Math.abs(d.change)), 1);

  const topStudios  = studioTableData.slice(0, 6);
  const scoreValues = topStudios.map((s) => s.avgScore).filter((v) => v != null);
  const minScore    = scoreValues.length ? Math.min(...scoreValues) : 0;
  const maxScore    = scoreValues.length ? Math.max(...scoreValues) : 1;

  return (
    <div
      className="p-4"
      style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px' }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)', margin: 0 }}>
          What's Trending
        </h2>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Score momentum across tracked period
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Genre momentum */}
        {displayed.length > 0 && (
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold mb-2.5" style={{ color: 'var(--accent-amber)' }}>
              Genre Momentum
            </p>
            <div className="flex flex-col gap-2">
              {rising.map((d) => <GenreBar key={d.genre} d={d} maxAbs={maxAbs} />)}
              {rising.length > 0 && falling.length > 0 && (
                <div style={{ height: '0.5px', background: 'var(--border)', margin: '2px 0' }} />
              )}
              {falling.map((d) => <GenreBar key={d.genre} d={d} maxAbs={maxAbs} />)}
            </div>
          </div>
        )}

        {displayed.length > 0 && topStudios.length > 0 && (
          <div style={{ width: '0.5px', background: 'var(--border)', flexShrink: 0 }} className="hidden md:block" />
        )}

        {/* Studio trends */}
        {topStudios.length > 0 && (
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold mb-2.5" style={{ color: 'var(--accent-violet)' }}>
              Studio Trends
            </p>
            <div className="flex flex-col gap-2">
              {topStudios.map((s) => <StudioRow key={s.studio} s={s} minScore={minScore} maxScore={maxScore} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MomentumSnapshot);
