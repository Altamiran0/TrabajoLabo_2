export interface EnvironmentalData {
  timestamp: number;
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface DataPoint {
  timestamp: number;
  value: number;
}

export type MetricType = 'temperature' | 'humidity' | 'pressure';

export interface ConnectionStatus {
  isConnected: boolean;
  lastUpdated: number;
}