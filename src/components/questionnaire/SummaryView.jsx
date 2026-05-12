import React from 'react';
import { CheckCircle2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { groupQuestionnaireItems } from '../../utils/questionnaireSections';

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/10 py-3 last:border-b-0 last:pb-0">
      <div>
        <p className="text-sm text-white/55">{label}</p>
      </div>
      <p className="text-right font-medium text-white/90">{value}</p>
    </div>
  );
}

function SummarySection({ title, items, answers }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{title}</p>
        <p className="text-xs text-white/45">{items.length} questions</p>
      </div>
      <div>
        {items.map((question) => (
          <SummaryRow
            key={question.questionIdCfa}
            label={question.question}
            value={(answers[question.questionIdCfa] && answers[question.questionIdCfa].selected_option?.label) || 'Not selected'}
          />
        ))}
      </div>
    </div>
  );
}

export default function SummaryView({ answers, questionsData, riskResult, isSubmitting, submitError, onRetrySubmit, onReview }) {
  const navigate = useNavigate();
  const canProceedToResults = Boolean(riskResult) && !isSubmitting;
  const groupedQuestions = groupQuestionnaireItems(questionsData);

  return (
    <div className="relative z-10 mx-auto max-w-3xl rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/20">
      <div className="flex items-center gap-3 text-primary mb-5">
        <CheckCircle2 size={22} />
        <span className="text-sm font-semibold uppercase tracking-[0.24em]">Completed</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your questionnaire is complete.</h1>
      <p className="mt-3 max-w-2xl text-white/68">We have captured your answers and risk profile inputs. You can now optimize your portfolio and view your results.</p>

      {isSubmitting && (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-primary/90">Calculating your risk result. You can review your answers while we process your submission.</p>
        </div>
      )}

      {submitError && (
        <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
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

      {/* <div className="mt-8 grid gap-4 md:grid-cols-2"> */}
        {/* <div className="rounded-2xl border border-white/10 bg-[#111816]/70 p-5">
          <div className="flex items-center gap-2 text-primary mb-3">
            <CheckCircle2 size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Profile summary</p>
          </div>
          <div className="space-y-1 text-sm text-white/80">
            <p>{Object.keys(answers).length} of {questionsData.length} questions answered</p>
            <p>All 3 stages completed successfully</p>
          </div>
        </div> */}

        <div className="rounded-2xl border border-white/10 bg-[#111816]/70 p-5 mt-8">
          <div className="flex items-center gap-2 text-primary mb-3">
            <TrendingUp size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Next step</p>
          </div>
          <div className="space-y-1 text-sm text-white/80">
            <p>Proceed to your results page to view your computed risk tier.</p>
            <p>Use this tier to continue portfolio optimization.</p>
          </div>
        </div>
      {/* </div> */}

      <div className="mt-8 space-y-4">
        {groupedQuestions.map((section) => (
          <SummarySection key={section.id} title={section.title} items={section.items} answers={answers} />
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {/* <button
          type="button"
          onClick={onReview}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
        >
          Review answers
        </button> */}

        <button
          type="button"
          onClick={() => navigate('/questionnaire/results', { state: { riskResult } })}
          disabled={!canProceedToResults}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold cursor-pointer ml-auto text-black transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
        >
          {isSubmitting ? 'Calculating result...' : 'Optimize my portfolio'}
          <TrendingUp size={18} />
        </button>
      </div>
    </div>
  );
}
