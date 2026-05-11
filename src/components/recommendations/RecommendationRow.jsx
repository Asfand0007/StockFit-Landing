import { CheckCircle2, ChevronDown } from 'lucide-react';
import StockChartPanel from './StockChartPanel';

export default function RecommendationRow({ stock, isSelected, isExpanded, onToggleExpand, onToggleSelect }) {
  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        isSelected || isExpanded
          ? 'border-primary/70 bg-primary/10'
          : 'border-white/10 bg-black/20 hover:border-primary/40'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          className="flex flex-1 items-center justify-between gap-4 text-left"
        >
          <div>
            <p className="text-lg font-semibold text-white">{stock.stock_name || 'Unknown stock'}</p>
            <p className="mt-1 text-sm text-primary/80">{stock.symbol || 'N/A'}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/80">
            <span className="hidden sm:inline">{isExpanded ? 'Hide chart' : 'Show chart'}</span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <button
          type="button"
          onClick={onToggleSelect}
          className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-semibold transition-colors sm:self-auto ${
            isSelected
              ? 'border-primary/40 bg-primary/15 text-primary'
              : 'border-white/10 bg-white/5 text-white/80 hover:border-primary/30 hover:bg-primary/10'
          }`}
        >
          {isSelected ? <CheckCircle2 size={16} className="text-primary" /> : <div className="h-4 w-4 rounded-full border border-white/30" />}
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>

      {isExpanded && <StockChartPanel stock={stock} />}
    </div>
  );
}