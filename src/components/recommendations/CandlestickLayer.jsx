export default function CandlestickLayer({ data, xAxisMap, yAxisMap, offset }) {
  const xAxis = xAxisMap?.[Object.keys(xAxisMap || {})[0]];
  const yAxis = yAxisMap?.[Object.keys(yAxisMap || {})[0]];

  if (!xAxis?.scale || !yAxis?.scale || !data?.length) {
    return null;
  }

  const xScale = xAxis.scale;
  const yScale = yAxis.scale;
  const candleWidth = Math.max(8, Math.min(18, ((offset?.width || 0) / data.length) * 0.42));

  return (
    <g>
      {data.map((entry, index) => {
        const x = xScale(entry.date);
        const highY = yScale(entry.high);
        const lowY = yScale(entry.low);
        const openY = yScale(entry.open);
        const closeY = yScale(entry.close);
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
        const isUp = entry.close >= entry.open;
        const bodyColor = isUp ? '#7CFF7A' : '#FF8A7A';

        return (
          <g key={`${entry.date}-${index}`}>
            <line
              x1={x}
              x2={x}
              y1={highY}
              y2={lowY}
              stroke={bodyColor}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity="0.85"
            />
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              rx={2}
              fill={bodyColor}
              fillOpacity="0.78"
              stroke={bodyColor}
              strokeWidth={1}
            />
          </g>
        );
      })}
    </g>
  );
}