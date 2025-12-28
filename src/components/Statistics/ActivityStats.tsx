import { useState, useMemo, memo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getDailyActivity, formatDateShort } from '../../utils';
import type { DailyActivity } from '../../utils';
import './ActivityStats.css';

type TimeRange = 7 | 30;

interface TooltipPayload {
  payload: DailyActivity & { displayDate: string };
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

// Custom Tooltip für Line Chart - memoized für bessere Performance
const CustomTooltip = memo(({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{data.displayDate}</p>
        <p className="tooltip-value">
          {data.cardsReviewed} Karte{data.cardsReviewed !== 1 ? 'n' : ''}{' '}
          wiederholt
        </p>
        <p className="tooltip-details">
          ✅ {data.correctCards} richtig · ❌ {data.incorrectCards} falsch
        </p>
      </div>
    );
  }
  return null;
});

// Custom Tooltip für Bar Chart - memoized für bessere Performance
const SuccessTooltip = memo(({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">{data.displayDate}</p>
        <p className="tooltip-value">{data.successRate}% Erfolgsquote</p>
        {data.cardsReviewed > 0 && (
          <p className="tooltip-details">
            {data.correctCards} / {data.cardsReviewed} Karten
          </p>
        )}
      </div>
    );
  }
  return null;
});

export function ActivityStats() {
  const [timeRange, setTimeRange] = useState<TimeRange>(7);

  const activityData = getDailyActivity(timeRange);

  // Formatiere Daten für Charts - memoized um Re-Berechnungen zu vermeiden
  const chartData = useMemo(
    () =>
      activityData.map(day => ({
        ...day,
        displayDate: formatDateShort(day.date),
      })),
    [activityData]
  );

  // Dynamische Farbe für Success Rate Bar - außerhalb Render
  const getBarColor = (successRate: number): string => {
    if (successRate >= 80) return '#10b981'; // Grün
    if (successRate >= 60) return '#f59e0b'; // Orange
    if (successRate >= 40) return '#f97316'; // Orange-Rot
    return '#ef4444'; // Rot
  };

  return (
    <div className="activity-stats-container">
      <div className="activity-header">
        <h2>Lernaktivität</h2>
        <div className="time-range-toggle">
          <button
            className={timeRange === 7 ? 'active' : ''}
            onClick={() => setTimeRange(7)}
          >
            7 Tage
          </button>
          <button
            className={timeRange === 30 ? 'active' : ''}
            onClick={() => setTimeRange(30)}
          >
            30 Tage
          </button>
        </div>
      </div>

      {/* Karten pro Tag - Line Chart */}
      <div className="chart-section">
        <h3>Wiederholte Karten pro Tag</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '0.875rem' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.875rem', paddingTop: '1rem' }}
            />
            <Line
              type="monotone"
              dataKey="cardsReviewed"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 7 }}
              name="Karten wiederholt"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Erfolgsquote pro Tag - Bar Chart */}
      <div className="chart-section">
        <h3>Erfolgsquote pro Tag</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              style={{ fontSize: '0.875rem' }}
            />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '0.875rem' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
            />
            <Tooltip content={<SuccessTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.875rem', paddingTop: '1rem' }}
            />
            <Bar
              dataKey="successRate"
              fill="#667eea"
              radius={[8, 8, 0, 0]}
              name="Erfolgsquote"
            >
              {chartData.map((entry, index) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey="successRate"
                  fill={getBarColor(entry.successRate)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
