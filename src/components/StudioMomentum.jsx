import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function StudioTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const { studio, avg, count } = payload[0].payload;
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
      <p style={{ color: 'var(--text-secondary)' }}>Avg score: <strong>{avg}</strong></p>
      <p style={{ color: 'var(--text-muted)' }}>{count} title{count !== 1 ? 's' : ''}</p>
    </div>
  );
}

function StudioMomentum({ studioData }) {
  if (!studioData?.length) return null;

  const displayData = studioData.slice(0, 10);

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
        <h2
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)', margin: 0 }}
        >
          Studio Momentum
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Top 10 by avg score
        </span>
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
          <XAxis
            type="number"
            domain={[6, 10]}
            ticks={[6, 7, 8, 9, 10]}
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="studio"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<StudioTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="avg" radius={[0, 4, 4, 0]}>
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
