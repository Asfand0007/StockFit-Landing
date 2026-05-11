import { CartesianGrid, Customized, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import CandlestickLayer from './CandlestickLayer';
import StockTooltip from './StockTooltip';

export default function StockChart({ data, tickFormatter }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} tickFormatter={tickFormatter} />
        <YAxis
          domain={['dataMin - 3', 'dataMax + 3']}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
          tickFormatter={(value) => `$${Number(value).toFixed(0)}`}
          width={48}
        />
        <Tooltip content={<StockTooltip />} cursor={{ stroke: 'rgba(124,255,122,0.14)' }} />
        <Line type="monotone" dataKey="close" stroke="#7CFF7A" strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
        <Customized component={CandlestickLayer} />
      </LineChart>
    </ResponsiveContainer>
  );
}