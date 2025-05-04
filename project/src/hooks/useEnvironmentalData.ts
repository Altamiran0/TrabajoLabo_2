import { useState, useEffect } from 'react';
import { EnvironmentalData, ConnectionStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const useEnvironmentalData = () => {
  // const [environmentDataList, setEnvironmentDataList] = useState< EnvironmentalData[] >([]);
  const [ environmentData, setEnvironmentData ] = useState< EnvironmentalData >();
  const [ error, setError ] = useState< string | null >( "" );
  const [connectionStatus, setConnectionStatus] = useState< ConnectionStatus >({
    isConnected: true,
    lastUpdated: 0,
  });

  const fetchLatestEnvironmentData = async (): Promise< EnvironmentalData | null > => {
    try {
      const res = await fetch(`${ API_URL }`);
      const data = await res.json();

      const environmentObject: EnvironmentalData = {
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        timestamp: data.timestamp
      };

      return environmentObject;
    } catch (err) {
      const errorMessage = `Error al conectar con el servidor u obtener datos: ${err}`;
      setError(errorMessage);
      setConnectionStatus(prev => ({ ...prev, isConnected: false }));
      return null;
    }
  };

  const saveInLocalstorage = ( newData: EnvironmentalData ) => {
    const storedDataList = localStorage.getItem("storedDataList");

    let environmentDataList: EnvironmentalData[] = [];
    if ( storedDataList ) environmentDataList = JSON.parse( storedDataList );
    
    const trimmed = environmentDataList.slice(-19); // Copia los ultimos 19 elementos del Array.
    environmentDataList = [...trimmed, newData]; // Retorna un Array con los anteriores 19 elementos mas el nuevo. De haber menos de 19 elementos no pasa nada, solo se agrega el ultimo.

    localStorage.setItem( "storedDataList", JSON.stringify( environmentDataList ));
  }
  
  const setearEstatusDeConexion = ( lastUpdate: number ) => {
    setConnectionStatus({
      isConnected: true,
      lastUpdated: lastUpdate
    });
  }

  // Obtengo la lista de datos
  const updateEnvironmentDataList = async () => {
    const newData = await fetchLatestEnvironmentData();
    if ( !newData ) return;

    setEnvironmentData( newData );
    setearEstatusDeConexion( newData.timestamp );
    saveInLocalstorage( newData );
  };

  // Cada cuanto obtengo una actualizacion
  useEffect(() => {
    updateEnvironmentDataList();
    const minutesInMilliseconds = ( time: number ) => time * 60 * 1000;

    const interval = setInterval( updateEnvironmentDataList, minutesInMilliseconds( 1 ));

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    

  return { environmentData, connectionStatus, error };
};