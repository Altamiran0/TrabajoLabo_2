import { Thermometer, Droplets, Gauge, AlertTriangle } from 'lucide-react';
import { MetricType, ConnectionStatus } from '../types';
import { format } from 'date-fns';

interface MetricCardProps {
  type: MetricType;
  currentValue: number;
  connectionStatus: ConnectionStatus;
  isSelected: boolean;
  onSelect: () => void;
}

const metricConfig = {
  temperature: {
    icon: Thermometer,
    label: 'Temperature',
    unit: '°C',
    color: '#262626'
  },
  humidity: {
    icon: Droplets,
    label: 'Humidity',
    unit: '%',
    color: '#262626'
  },
  pressure: {
    icon: Gauge,
    label: 'Pressure',
    unit: 'hPa',
    color: '#262626'
  }
};

export function MetricCard({
  type,
  currentValue,
  connectionStatus,
  isSelected,
  onSelect
}: MetricCardProps) {
  const config = metricConfig[type];
  const Icon = config.icon;

  return (
    <article
      className={`bg-white rounded shadow transition-all cursor-pointer p-6
        ${isSelected ? 'ring-2 ring-neutral-900' : 'hover:shadow-lg'}`}
      onClick={onSelect}
    >
      <header className="flex justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" />
          <h2 className="text-xl font-semibold">{config.label}</h2>
        </div>
        {!connectionStatus.isConnected && (
          <div className="flex items-center gap-2 text-neutral-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">Connection lost</span>
          </div>
        )}
      </header>

      <section>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{
            typeof currentValue === 'number' ? currentValue.toFixed(2) : 'N/A' 
          }</span>
          <span className="text-neutral-500">{ config.unit }</span>
        </div>
        <span style={{ opacity: "60%" }}>
          { `Ultima conexion: ` + format( connectionStatus.lastUpdated * 1000, 'HH:mm:ss' )}
        </span>
      </section>
    </article>
  );
}