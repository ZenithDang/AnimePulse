import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

function MomentumTooltip({ active, payload }) {
  if (!active || !payload?.[0]) return null;
  const { genre, change, first, last } = payload[0].payload;
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
      <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{genre}</p>
      <p style={{ color: 'var(--text-secondary)' }}>
        {first?.toFixed(2)} → {last?.toFixed(2)}
      </p>
      <p style={{ color: change >= 0 ? 'var(--accent-teal)' : 'var(--accent-amber)' }}>
        {change >= 0 ? '+' : ''}{change}%
      </p>
    </div>
  );
}

function GenreMomentum({ momentumData }) {
  if (!momentumData?.length) return null;

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
          Genre Momentum
        </h2>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Score % change over period
        </span>
      </div>

      <ResponsiveContainer width="100%" height={Math.max(200, momentumData.length * 36)}>
        <BarChart
          layout="vertical"
          data={momentumData}
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
            tickLine={false}
            tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
          />
          <YAxis
            type="category"
            dataKey="genre"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<MomentumTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="change" radius={[0, 4, 4, 0]}>
            {momentumData.map((entry) => (
              <Cell
                key={entry.genre}
                fill={entry.change >= 0 ? 'var(--accent-teal)' : 'var(--accent-amber)'}
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'var(--accent-teal)' }} />
          Rising
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: 'var(--accent-amber)' }} />
          Declining
        </span>
      </div>
    </div>
  );
}

export default memo(GenreMomentum);
