import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DataPoint, MetricType, ConnectionStatus } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DataChartProps {
  data: DataPoint[];
  metric: MetricType;
  connectionStatus: ConnectionStatus;
}

const metricConfig = {
  temperature: {
    label: 'Temperature',
    unit: '°C',
    color: '#262626'
  },
  humidity: {
    label: 'Humidity',
    unit: '%',
    color: '#262626'
  },
  pressure: {
    label: 'Pressure',
    unit: 'hPa',
    color: '#262626'
  }
};

export function DataChart({
  data,
  metric,
  connectionStatus
}: DataChartProps) {
  const config = metricConfig[metric];

  return (
    <article className="w-full">
      <header className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-neutral-900">
          {config.label} History
        </h3>
        {!connectionStatus.isConnected && (
          <div className="flex items-center gap-2 text-neutral-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Connection lost</span>
          </div>
        )}
      </header>

      <section className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d4" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => format(timestamp * 1000, 'HH:mm:ss')}
              tick={{ fill: '#525252' }}
              stroke="#737373"
            />
            <YAxis
              tick={{ fill: '#525252' }}
              stroke="#737373"
              label={{
                value: config.unit,
                angle: -90,
                position: 'insideLeft',
                fill: '#525252'
              }}
            />
            <Tooltip
              labelFormatter={(timestamp) => format(timestamp * 1000, 'HH:mm:ss')}
              formatter={(value: number) => [`${value.toFixed(1)} ${config.unit}`, config.label]}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d4d4d4',
                borderRadius: '4px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </article>
  );
}