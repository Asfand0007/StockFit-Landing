import { useEffect, useState } from 'react';
import api from '../api/axios';
import { normalizeOhlcvResponse } from '../utils/stockTransformers';

export default function useStockChart(symbol, timeHorizon) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Guard against empty or invalid symbols
    if (!symbol || typeof symbol !== 'string' || symbol.trim() === '') {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setData([]);

        const response = await api.get(`/stocks/${encodeURIComponent(symbol)}/ohlcv`, {
          params: { time_horizon: timeHorizon },
        });

        if (!ignore) {
          const normalizedData = normalizeOhlcvResponse(response.data);
          setData(normalizedData);
          
          // Only clear error if we successfully got data
          if (normalizedData && normalizedData.length > 0) {
            setError(null);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error('Failed to fetch OHLCV data for', symbol, err);
          setData([]);
          setError('Failed to load chart data. Please try another horizon.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [symbol, timeHorizon]);

  return {
    data,
    loading,
    error,
  };
}