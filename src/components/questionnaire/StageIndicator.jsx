import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function StageIndicator({ stages, currentStageIndex, completedStages }) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {stages.map((stage, index) => {
        const isActive = currentStageIndex === index;
        const isCompleted = completedStages.includes(index);

        return (
          <div key={stage.id} className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                isActive
                  ? 'border-2 border-primary bg-white text-black'
                  : isCompleted
                  ? 'border-2 border-primary bg-primary text-black'
                  : 'border-2 border-white/20 bg-black/30 text-white/60'
              }`}
            >
              {isCompleted ? <CheckCircle2 size={16} /> : index + 1}
            </button>
            {index < stages.length - 1 && (
              <div
                className={`hidden h-0.5 w-8 md:w-12 md:block transition-colors ${
                  isCompleted ? 'bg-primary' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
