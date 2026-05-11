import { useState } from 'react';

export default function useStockSelection() {
  const [selectedSymbols, setSelectedSymbols] = useState([]);

  const toggleStock = (symbol) => {
    if (!symbol) return;

    setSelectedSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((item) => item !== symbol) : [...prev, symbol]
    );
  };

  return {
    selectedSymbols,
    toggleStock,
  };
}