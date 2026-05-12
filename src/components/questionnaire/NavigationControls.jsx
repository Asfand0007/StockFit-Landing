import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function NavigationControls({ onPrev, onNext, canPrev, canNext, isLast }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="inline-flex items-center w-30 justify-center gap-2 text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className='-ml-2' size={18} />
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        // className="mt-3 pointer-events-auto w-4/5 sm:w-auto text-white px-5 py-2.5 rounded-full bg-primary hover:bg-secondary cursor-pointer flex items-center justify-center gap-1">
            
        className="inline-flex items-center min-w-30 justify-center gap-2 text-white px-6 py-2 rounded-full bg-primary hover:bg-secondary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLast ? 'Finish questionnaire' : 'Next'}
        <ChevronRight className='-mr-2' size={18} />
      </button>
    </div>
  );
}
