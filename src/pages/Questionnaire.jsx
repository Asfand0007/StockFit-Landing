import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, LayoutDashboard, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/global/Navbar';
import LoadingTemplate from '../components/questionnaire/Loading-template';
import api from '../api/axios';

const stageDefinitions = [
  {
    id: 'investment-profile',
    title: 'Investment Profile',
    questionIds: [
      'annual_net_cash_flow',
      'current_portfolio_value',
      'investment_experience_level',
      'investment_time_horizon_years',
    ],
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    questionIds: [
      'expects_high_withdrawal_rate',
      'financial_knowledge_level',
      'has_stable_external_income',
      'market_risk_perception',
    ],
  },
  {
    id: 'preferences',
    title: 'Preferences',
    questionIds: [
      'reaction_to_losses_score',
      'safety_vs_return_preference',
      'target_future_value',
      'willingness_to_take_risk',
    ],
  },
];

// --- Helper Components ---

function QuestionnaireLayout({ children }) {
  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />
      <div className="relative pt-28 px-6 pb-16 max-w-5xl mx-auto">
        <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />
        {children}
      </div>
    </div>
  );
}

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

function StageIndicator({ stages, currentStageIndex, completedStages }) {
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

// --- Helper Functions ---

function normalizeQuestionsPayload(payload) {
  const items = Array.isArray(payload) ? payload : [];

  return items
    .map((item) => ({
      id: item.question_id_cfa,
      question: item.question_string,
      type: item.question_type,
      options: item.question_options ?? [], // Modern null-coalescing
    }))
    .filter((item) => item.id && item.question);
}

function buildStageData(questionsData) {
  const availableIds = new Set(questionsData.map((question) => question.id));

  return stageDefinitions.map((stage) => ({
    ...stage,
    questionIds: stage.questionIds.filter((questionId) => availableIds.has(questionId)),
  }));
}

function formatAnswerValue(question, value) {
  if (value === undefined || value === null || value === '') {
    return 'Not selected';
  }

  if (question?.type === 'number_input') {
    return value;
  }

  const option = question?.options?.find((choice) => choice.value === value);
  return option?.label || value;
}

// --- Main Component ---

export default function Questionnaire() {
  const navigate = useNavigate();
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentQuestionIndexInStage, setCurrentQuestionIndexInStage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 1. Initialize AbortController to fix React 18 double-fetch
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        // Pass the signal to axios
        const response = await api.get('/assessment/questions', {
          signal: controller.signal,
        });
        setQuestionsData(normalizeQuestionsPayload(response.data));
        setError(null);
      } catch (err) {
        // 2. Ignore errors if they were caused by our deliberate abort
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questionnaire. Please try again later.');
        setQuestionsData([]);
      } finally {
        // Only turn off loading if the request wasn't aborted
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    // 3. Cleanup function to abort on unmount/re-render
    return () => {
      controller.abort();
    };
  }, []);

  const stages = useMemo(() => buildStageData(questionsData), [questionsData]);
  const activeStage = stages[currentStageIndex] || stages[0];
  const currentStageQuestionIds = activeStage?.questionIds || [];
  const currentQuestionId = currentStageQuestionIds[currentQuestionIndexInStage];
  const currentQuestionData = questionsData.find((question) => question.id === currentQuestionId);
  const selectedValue = answers[currentQuestionId] || '';

  const completedStages = useMemo(() => {
    return stages
      .map((stage, index) => ({
        index,
        isComplete: stage.questionIds.length > 0 && stage.questionIds.every((questionId) => Boolean(answers[questionId])),
      }))
      .filter((stage) => stage.isComplete)
      .map((stage) => stage.index);
  }, [answers, stages]);

  const stageProgress = useMemo(() => {
    if (!currentStageQuestionIds.length) {
      return 0;
    }

    const answered = currentStageQuestionIds.filter((questionId) => Boolean(answers[questionId])).length;
    return Math.round((answered / currentStageQuestionIds.length) * 100);
  }, [answers, currentStageQuestionIds]);

  const handleSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndexInStage < currentStageQuestionIds.length - 1) {
      setCurrentQuestionIndexInStage((prev) => prev + 1);
      return;
    }

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      setCurrentQuestionIndexInStage(0);
      return;
    }

    setSubmitted(true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndexInStage > 0) {
      setCurrentQuestionIndexInStage((prev) => prev - 1);
      return;
    }

    if (currentStageIndex > 0) {
      const previousStageIndex = currentStageIndex - 1;
      setCurrentStageIndex(previousStageIndex);
      setCurrentQuestionIndexInStage(Math.max((stages[previousStageIndex]?.questionIds.length || 1) - 1, 0));
    }
  };

  const isLastQuestion = currentQuestionIndexInStage === currentStageQuestionIds.length - 1;
  const isLastStage = currentStageIndex === stages.length - 1;

  // --- Render Cycle ---

  if (loading) {
    return <LoadingTemplate />;
  }

  // 4. Use the new Wrapper to eliminate duplicate code
  if (error) {
    return (
      <QuestionnaireLayout>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-3xl rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/20"
        >
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90"
            >
              Back to dashboard
            </button>
          </div>
        </motion.div>
      </QuestionnaireLayout>
    );
  }

  if (submitted) {
    return (
      <QuestionnaireLayout>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-3xl rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/20"
        >
          <div className="flex items-center gap-3 text-primary mb-5">
            <CheckCircle2 size={22} />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Completed</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your questionnaire is complete.</h1>
          <p className="mt-3 max-w-2xl text-white/68">
            We have captured your answers and investment profile. You can now continue to your dashboard to review the next steps.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#111816]/70 p-5">
              <div className="flex items-center gap-2 text-primary mb-3">
                <CheckCircle2 size={18} />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Profile summary</p>
              </div>
              <div className="space-y-1 text-sm text-white/80">
                <p>{Object.keys(answers).length} of {currentStageQuestionIds.length * stages.length} questions answered</p>
                <p>All 3 stages completed successfully</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111816]/70 p-5">
              <div className="flex items-center gap-2 text-primary mb-3">
                <TrendingUp size={18} />
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Next step</p>
              </div>
              <div className="space-y-1 text-sm text-white/80">
                <p>Use the dashboard to continue the portfolio flow.</p>
                <p>We can later connect these answers to API-driven recommendations.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            {questionsData.map((question) => (
              <SummaryRow
                key={question.id}
                label={question.question}
                value={formatAnswerValue(question, answers[question.id])}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
            >
              Review answers
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90"
            >
              Continue to dashboard
              <LayoutDashboard size={18} />
            </button>
          </div>
        </motion.div>
      </QuestionnaireLayout>
    );
  }

  const totalStages = stages.length;
  const currentStageTitle = activeStage?.title || 'Questionnaire';

  return (
    <QuestionnaireLayout>
      <div className="relative z-10 mb-12">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">Stage {currentStageIndex + 1} of {totalStages}</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">{currentStageTitle}</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Question {currentQuestionIndexInStage + 1} of {currentStageQuestionIds.length}
        </p>
      </div>

      <div className="relative z-10 mb-12">
        <StageIndicator stages={stages} currentStageIndex={currentStageIndex} completedStages={completedStages} />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-black/20 mb-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6">{currentQuestionData.question}</h2>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-white/55 mb-2">
            <span>Stage Progress</span>
            <span>{stageProgress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${stageProgress}%` }} />
          </div>
        </div>

        {currentQuestionData.type === 'number_input' ? (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70" htmlFor={currentQuestionId}>
              Enter your answer
            </label>
            <input
              id={currentQuestionId}
              type="number"
              inputMode="decimal"
              value={selectedValue}
              onChange={(event) => handleSelect(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/15 px-4 py-4 text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/60"
              placeholder="Type a number"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {currentQuestionData.options.map((option) => {
              const isActive = selectedValue === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
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
            })}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStageIndex === 0 && currentQuestionIndexInStage === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedValue}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLastQuestion && isLastStage ? 'Finish questionnaire' : 'Next'}
            <ChevronRight size={18} />
          </button>
        </div>
      </motion.section>
    </QuestionnaireLayout>
  );
}