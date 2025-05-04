import { useState } from 'preact/hooks';
import { MetricCard } from './components/MetricCard';
import { useEnvironmentalData } from './hooks/useEnvironmentalData';
import { EnvironmentalData, MetricType } from './types';
import { DataChart } from './components/DataChart';
import './app.css';

export default function App() {
  const { environmentData, connectionStatus, error } = useEnvironmentalData();
  const [selectedMetric, setSelectedMetric] = useState< MetricType >('temperature');

  const getDataPoints = ( metric: MetricType ) => {
    const storedDataList = localStorage.getItem( "storedDataList" );
    if ( !storedDataList ) return 0;
    const environmentDataList = JSON.parse( storedDataList );

    return (
      environmentDataList.map(( environmentData: EnvironmentalData ) => ({
        timestamp: environmentData.timestamp,
        value: environmentData[metric],
      }))
    );
  }

  const getCurrentValue = ( metric: MetricType ) => {    
    const lastValue = environmentData?.[ metric ] ?? 0;
    return ( typeof lastValue === "number" ? lastValue : 0)
  }  

  return (
    <>
    <header className="EnvironmentVariables">
      <section className="flex flex-wrap justify-center gap-6">
        {(['temperature', 'humidity', 'pressure'] as MetricType[]).map((metric) => (
          <div className="w-[350px]">
            <MetricCard
              key={ metric }
              type={ metric }
              currentValue={ getCurrentValue( metric ) }
              connectionStatus={ connectionStatus }
              isSelected={ selectedMetric === metric }
              onSelect={() => setSelectedMetric( metric )}
            />
          </div>
        ))}
      </section>
    </header>

    { error 
        ? <span>{ error }</span>
        : <section className="max-w-7xl mx-auto p-6">
            <article className="bg-white rounded shadow p-6">
              <DataChart
                data={ getDataPoints( selectedMetric ) }
                metric={ selectedMetric }
                connectionStatus={ connectionStatus }
              />
            </article>
          </section>
    }
    </>
  );
}