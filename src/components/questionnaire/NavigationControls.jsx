import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationControls({ onPrev, onNext, canPrev, canNext, isLast }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={18} />
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLast ? 'Finish questionnaire' : 'Next'}
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
