import React, { useState } from 'react';
import { CheckCircle2, TrendingUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { groupQuestionnaireItems } from '../../utils/questionnaireSections';

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/10 py-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-white/55 leading-snug">{label}</p>
      <p className="text-right text-sm font-medium text-white/90 shrink-0 max-w-[45%]">{value}</p>
    </div>
  );
}

function SummarySection({ title, items, answers, isOpen, onToggle }) {
  return (
    <div className={`${isOpen ? 'pb-6' : 'pb-0'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between  cursor-pointer gap-4 py-4"
        aria-expanded={isOpen}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">{title}</p>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-xs text-white/45">{items.length} questions</p>
          <ChevronDown
            size={16}
            className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          {items.map((question) => (
            <SummaryRow
              key={question.questionIdCfa}
              label={question.question}
              value={
                (answers[question.questionIdCfa] &&
                  answers[question.questionIdCfa].selected_option?.label) ||
                'Not selected'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SummaryView({
  answers,
  questionsData,
  riskResult,
  isSubmitting,
  submitError,
  onRetrySubmit,
  onReview,
}) {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const canProceedToResults = Boolean(riskResult) && !isSubmitting;
  const groupedQuestions = groupQuestionnaireItems(questionsData);
  const answeredCount = Object.keys(answers).length;

  function handleToggle(id) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  return (
    <div className="relative z-10 mx-auto p-4 md:p-6 overflow-hidden">
      {/* <div className="absolute -left-[15%] bottom-[5%] h-60 w-60 rounded-full bg-secondary opacity-10 blur-[100px] pointer-events-none" /> */}

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 size={16} className="text-primary" />
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">Completed</p>
        </div>
        <h1 className="text-3xl md:text-4xl leading-tight">Your Questionnaire is complete.</h1>
        <p className="mt-2 text-gray-400">
          We have captured your answers and risk profile inputs. You can now generate your risk profile and optimized portfolio for your investment needs.
        </p>
      </div>

      {isSubmitting && (
        <div className="relative z-10 mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-primary/90">
            Calculating your risk result. You can review your answers while we process your submission.
          </p>
        </div>
      )}

      {submitError && (
        <div className="relative z-10 mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
          <p className="text-sm text-red-200">{submitError}</p>
          <button
            type="button"
            onClick={onRetrySubmit}
            className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/40 px-4 py-2 text-xs font-semibold text-red-100 transition-colors hover:bg-red-500/20"
          >
            Retry submission
          </button>
        </div>
      )}

      <div className="relative z-10 mt-4 mb-2">
        <div className="flex items-center justify-between text-sm text-primary mb-2">
          <div className="flex items-center gap-2 text-primary">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">All Questions Answered</p>
          </div>
          <span>{answeredCount} / {questionsData.length}</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${questionsData.length ? (answeredCount / questionsData.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <div className="space-y-1 text-sm text-white/65">
          <p>Proceed to your results page to view your computed risk tier.</p>
        </div>
      </div>

      <div className="relative z-10 mt-6 divide-y divide-white">
        {groupedQuestions.map((section) => (
          <SummarySection
            key={section.id}
            title={section.title}
            items={section.items}
            answers={answers}
            isOpen={openSection === section.id}
            onToggle={() => handleToggle(section.id)}
          />
        ))}
      </div>

      <div className="relative z-10 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate('/questionnaire/results', { state: { riskResult } })}
          disabled={!canProceedToResults}
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors disabled:cursor-not-allowed disabled:bg-primary/40"
        >
          {isSubmitting ? 'Calculating result…' : 'View Risk Profile'}
          <TrendingUp size={16} />
        </button>
      </div>
    </div>
  );
}
