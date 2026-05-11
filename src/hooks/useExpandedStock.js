import { useState } from 'react';

export default function useExpandedStock() {
  const [expandedSymbol, setExpandedSymbol] = useState(null);

  const toggleExpandedStock = (symbol) => {
    if (!symbol) return;

    setExpandedSymbol((prev) => (prev === symbol ? null : symbol));
  };

  return {
    expandedSymbol,
    toggleExpandedStock,
  };
}