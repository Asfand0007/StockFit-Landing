import { useMemo, useState } from 'react';
import useStockChart from '../../hooks/useStockChart';
import { createXAxisTickFormatter } from '../../utils/chartFormatters';
import LoadingState from './states/LoadingState';
import ErrorState from './states/ErrorState';
import EmptyState from './states/EmptyState';
import StockChart from './StockChart';
import StockStats from './StockStats';
import TimeHorizonSelector from './TimeHorizonSelector';

export default function StockChartPanel({ stock }) {
  const symbol = stock.symbol || '';
  const [timeHorizon, setTimeHorizon] = useState('3m');
  const { data: candles, loading, error } = useStockChart(symbol, timeHorizon);

  const stats = useMemo(() => {
    const firstCandle = candles[0];
    const lastCandle = candles[candles.length - 1];

    return {
      latestClose: lastCandle?.close || 0,
      sessionHigh: candles.length > 0 ? candles.reduce((max, candle) => Math.max(max, candle.high), Number.NEGATIVE_INFINITY) : 0,
      sessionLow: candles.length > 0 ? candles.reduce((min, candle) => Math.min(min, candle.low), Number.POSITIVE_INFINITY) : 0,
      changePercent:
        firstCandle && lastCandle ? ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100 : 0,
    };
  }, [candles]);

  const tickFormatter = useMemo(() => createXAxisTickFormatter(timeHorizon, candles), [timeHorizon, candles]);

  return (
    <div className="mt-4 rounded-2xl border border-primary/15 bg-black/25 p-4 sm:p-5">
      {!loading && !error && candles.length > 0 && <StockStats {...stats} />}

      <TimeHorizonSelector selectedHorizon={timeHorizon} onSelect={setTimeHorizon} />

      {loading ? (
        <div className="mt-5">
          <LoadingState text="Loading chart data..." />
        </div>
      ) : error ? (
        <div className="mt-5">
          <ErrorState message={error} />
        </div>
      ) : candles.length > 0 ? (
        <div className="mt-5 h-72 rounded-2xl border border-white/10 bg-[#070a09] p-3">
          <StockChart data={candles} tickFormatter={tickFormatter} />
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState message={`No candle data returned for the ${timeHorizon} horizon.`} />
        </div>
      )}
    </div>
  );
}