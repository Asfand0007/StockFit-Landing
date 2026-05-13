import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const TIMELINE_QUESTION_ID = 'investment_time_horizon_years';
const MONETARY_QUESTION_IDS = ['target_future_value', 'current_portfolio_value', 'annual_net_cash_flow'];

function OptionButton({ option, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      // rounded-lg border border-white/10 bg-black/15 px-4 py-4 text-white outline-none transition-colors placeholder:text-white/35
      className={`w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
        isActive
          ? 'border-[#69b39d73] bg-[#69b39d0d] '
          : 'border-white/10 bg-black/15 hover:bg-white/5 hover:border-white/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`mt-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
            isActive ? 'border-primary bg-primary' : 'border-white/30'
          }`}
        >
          {isActive ? <CheckCircle2 size={14} className="text-black" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-sm text-white">{option.label}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function QuestionRenderer({ questionData, selectedValue, onSelect, inputId }) {
  if (!questionData) return null;

  if (questionData.type === 'number_input') {
    const isTimelineQuestion = inputId === TIMELINE_QUESTION_ID;
    const isMonetaryQuestion = MONETARY_QUESTION_IDS.includes(inputId);

    return (
      <div className="space-y-3">
        <label className="block text-base text-white" htmlFor={inputId}>
          {isTimelineQuestion ? 'Enter your timeline in months' : 'Enter your answer'}
        </label>
        {isMonetaryQuestion ? (
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/70 pointer-events-none text-sm font-medium">Rs.</span>
            <input
              id={inputId}
              type="number"
              inputMode="decimal"
              value={selectedValue}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-black/15 pl-12 pr-4 py-4 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#69b39d73] focus:bg-[#69b39d0d] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Enter amount"
            />
          </div>
        ) : (
          <input
            id={inputId}
            type="number"
            inputMode="decimal"
            value={selectedValue}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/15 px-4 py-4 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#69b39d73] focus:bg-[#69b39d0d] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder={isTimelineQuestion ? 'Type months, e.g. 24' : 'Type a number'}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {questionData.options.map((option) => (
        <OptionButton
          key={option.value}
          option={option}
          className="w-full border border-white/10 bg-black/15 px-4 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#69b39d73] focus:bg-[#69b39d0d]"
          isActive={selectedValue === option.value}
          onClick={() => onSelect(option.value)}
        />
      ))}
    </div>
  );
}
