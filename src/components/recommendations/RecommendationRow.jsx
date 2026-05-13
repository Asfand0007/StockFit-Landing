import { CheckCircle2, ChevronDown } from 'lucide-react';
import StockChartPanel from './StockChartPanel';

export default function RecommendationRow({ stock, isSelected, isExpanded, onToggleExpand, onToggleSelect }) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Expand trigger */}
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          className="flex flex-1 items-center justify-between gap-4 text-left cursor-pointer"
        >
          <div>
            <p className="text-base font-semibold text-white">{stock.stock_name || 'Unknown stock'}</p>
            <p className="mt-0.5 text-sm text-primary/80">{stock.symbol || 'N/A'}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/50">
            <span className="hidden sm:inline">{isExpanded ? 'Hide chart' : 'Show chart'}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Select button */}
        <button
          type="button"
          onClick={onToggleSelect}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
            isSelected
              ? 'border-primary/40 text-primary'
              : 'border-white/15 text-white/60 hover:border-primary/30 hover:text-primary/80'
          }`}
        >
          {isSelected
            ? <CheckCircle2 size={14} className="text-primary" />
            : <div className="h-3.5 w-3.5 rounded-full border border-white/30" />}
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>

      {/* Chart — smooth expand using grid trick */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <StockChartPanel stock={stock} />
        </div>
      </div>
    </div>
  );
}
