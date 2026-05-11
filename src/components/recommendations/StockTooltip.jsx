import { formatTooltipValue } from '../../utils/chartFormatters';

export default function StockTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101513] px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{point.date}</p>
      <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-sm text-white/80">
        <span>Open</span>
        <span className="text-right font-semibold text-white">{formatTooltipValue(point.open)}</span>
        <span>High</span>
        <span className="text-right font-semibold text-white">{formatTooltipValue(point.high)}</span>
        <span>Low</span>
        <span className="text-right font-semibold text-white">{formatTooltipValue(point.low)}</span>
        <span>Close</span>
        <span className="text-right font-semibold text-white">{formatTooltipValue(point.close)}</span>
        <span>Volume</span>
        <span className="text-right font-semibold text-white">{point.volume.toLocaleString()}</span>
      </div>
    </div>
  );
}