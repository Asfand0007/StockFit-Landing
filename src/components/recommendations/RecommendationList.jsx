import RecommendationRow from './RecommendationRow';
import EmptyState from './states/EmptyState';

export default function RecommendationList({ stocks, selectedSymbols, expandedSymbol, onToggleExpand, onToggleSelect }) {
  if (!stocks.length) {
    return <EmptyState message="No recommendations returned for this tier." />;
  }

  return (
    <div className="divide-y divide-white/10">
      {stocks.map((stock, index) => (
        <RecommendationRow
          key={`${stock.symbol || 'stock'}-${index}`}
          stock={stock}
          isSelected={selectedSymbols.includes(stock.symbol)}
          isExpanded={expandedSymbol === stock.symbol}
          onToggleExpand={() => onToggleExpand(stock.symbol)}
          onToggleSelect={() => onToggleSelect(stock.symbol)}
        />
      ))}
    </div>
  );
}
