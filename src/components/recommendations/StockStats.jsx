import { formatChange, formatTooltipValue } from '../../utils/chartFormatters';

export default function StockStats({ latestClose, sessionHigh, sessionLow, changePercent }) {
  return (
    <>
      <div className={`text-sm font-semibold ${changePercent >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
        {formatChange(changePercent)} over the sample window
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Latest close</p>
          <p className="mt-2 text-lg font-semibold text-white">{formatTooltipValue(latestClose)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Session high</p>
          <p className="mt-2 text-lg font-semibold text-white">{formatTooltipValue(sessionHigh)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Session low</p>
          <p className="mt-2 text-lg font-semibold text-white">{formatTooltipValue(sessionLow)}</p>
        </div>
      </div>
    </>
  );
}