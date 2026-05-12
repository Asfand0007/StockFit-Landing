export const moneyFormatter = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 2,
});

export function formatTooltipValue(value) {
  return moneyFormatter.format(Number(value || 0));
}

export function formatChange(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function createXAxisTickFormatter(timeHorizon, candles) {
  return (dateStr) => {
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    if (timeHorizon === '5y') {
      const shortYear = String(year).slice(-2);
      return `${month}/${shortYear}`;
    }

    if (timeHorizon === '3d' || timeHorizon === '1y') {
      return `${day}/${month}`;
    }

    if (timeHorizon === '30d' || timeHorizon === '3m') {
      const needsYear =
        candles.length > 1 &&
        new Date(candles[0].date).getFullYear() !== new Date(candles[candles.length - 1].date).getFullYear();

      return needsYear ? `${day}/${month}/${year}` : `${day}/${month}`;
    }

    return dateStr;
  };
}