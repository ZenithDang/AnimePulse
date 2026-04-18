import { memo } from 'react';
import useUiStore from '../store/uiStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function formatMembers(n) {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function StudioTooltip({ active, payload, mode }) {
  if (!active || !payload?.[0]) return null;
  const { studio, avg, avgMembers, count } = payload[0].payload;
  return (
    <div
      className="p-3 text-xs"
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{studio}</p>
      {mode === 'score'
        ? <p style={{ color: 'var(--text-secondary)' }}>Avg score: <strong>{avg}</strong></p>
        : <p style={{ color: 'var(--text-secondary)' }}>Avg popularity: <strong>{formatMembers(avgMembers)}</strong></p>
      }
      <p style={{ color: 'var(--text-muted)' }}>{count} title{count !== 1 ? 's' : ''}</p>
    </div>
  );
}

function StudioMomentum({ studioData, studioPopularityData }) {
  const { studioMode: mode, setStudioMode: setMode } = useUiStore();

  const activeData    = mode === 'score' ? studioData : studioPopularityData;
  const displayData   = activeData.slice(0, 10);

  if (!displayData?.length) return null;

  return (
    <div
      className="p-4"
      style={{
        background: 'var(--bg-card)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium" style={{ color: 'var(--text-primary)', margin: 0 }}>
          Studio Momentum
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {mode === 'score' ? 'Top 10 by avg score' : 'Top 10 by avg AniList members'}
          </span>

          <div
            className="flex gap-0.5 p-0.5"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid var(--border)',
              borderRadius: '8px',
            }}
          >
            {[
              { key: 'score',   label: 'Score'      },
              { key: 'members', label: 'Popularity' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className="text-xs px-3 py-1 rounded transition-all"
                style={{
                  background: mode === key ? 'var(--accent-violet)' : 'transparent',
                  color:      mode === key ? '#fff' : 'var(--text-muted)',
                  border:     'none',
                  cursor:     'pointer',
                  fontWeight: mode === key ? 600 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(200, displayData.length * 32)}>
        <BarChart
          layout="vertical"
          data={displayData}
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          {mode === 'score' ? (
            <XAxis
              type="number"
              domain={[6, 10]}
              ticks={[6, 7, 8, 9, 10]}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              tickLine={false}
            />
          ) : (
            <XAxis
              type="number"
              tickFormatter={formatMembers}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              tickLine={false}
            />
          )}
          <YAxis
            type="category"
            dataKey="studio"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={(props) => <StudioTooltip {...props} mode={mode} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey={mode === 'score' ? 'avg' : 'avgMembers'} radius={[0, 4, 4, 0]}>
            {displayData.map((entry, i) => (
              <Cell
                key={entry.studio}
                fill={`hsl(${260 - i * 8}, 60%, ${55 + i * 3}%)`}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(StudioMomentum);
