import { TIME_HORIZONS } from '../../constants/stockConstants';

export default function TimeHorizonSelector({ selectedHorizon, onSelect }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {TIME_HORIZONS.map((horizon) => (
        <button
          key={horizon}
          type="button"
          onClick={() => onSelect(horizon)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            selectedHorizon === horizon
              ? 'border-primary/50 bg-primary/15 text-primary'
              : 'border-white/10 bg-white/5 text-white/70 hover:border-primary/30 hover:bg-primary/10'
          }`}
        >
          {horizon}
        </button>
      ))}
    </div>
  );
}