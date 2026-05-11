import React from 'react';
import { CheckCircle2 } from 'lucide-react';

function OptionButton({ option, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        isActive
          ? 'border-primary/50 bg-primary/10 shadow-[0_0_0_1px_rgba(105,179,157,0.12)]'
          : 'border-white/10 bg-black/15 hover:bg-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            isActive ? 'border-primary bg-primary' : 'border-white/30'
          }`}
        >
          {isActive ? <CheckCircle2 size={14} className="text-black" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="font-semibold text-white">{option.label}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function QuestionRenderer({ questionData, selectedValue, onSelect, inputId }) {
  if (!questionData) return null;

  if (questionData.type === 'number_input') {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-white/70" htmlFor={inputId}>
          Enter your answer
        </label>
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          value={selectedValue}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/15 px-4 py-4 text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/60"
          placeholder="Type a number"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questionData.options.map((option) => (
        <OptionButton
          key={option.value}
          option={option}
          isActive={selectedValue === option.value}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </div>
  );
}
