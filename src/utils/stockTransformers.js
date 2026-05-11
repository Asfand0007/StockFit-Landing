export function normalizeOhlcvResponse(responseData) {
  const candles = Array.isArray(responseData?.candles) ? responseData.candles : [];

  return candles.map((candle) => ({
    date: candle.date,
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close),
    volume: Number(candle.volume || 0),
  }));
}