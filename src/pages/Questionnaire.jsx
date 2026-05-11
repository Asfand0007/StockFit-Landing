import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/global/Navbar';
import LoadingTemplate from '../components/questionnaire/Loading-template';
import api, { getCookie } from '../api/axios';

const stageDefinitions = [
  {
    id: 'risk-need',
    title: 'Risk Need',
    questionIds: [
      'target_future_value',
      'current_portfolio_value',
      'annual_net_cash_flow',
      'investment_time_horizon_years',
    ],
  },
  {
    id: 'risk-tolerance',
    title: 'Risk Tolerance',
    questionIds: [
      'expects_high_withdrawal_rate',
      'has_stable_external_income',
    ],
  },
  {
    id: 'behavioral-loss-tolerance',
    title: 'Behavioral Loss Tolerance',
    questionIds: [
      'willingness_to_take_risk',
      'safety_vs_return_preference',
      'financial_knowledge_level',
      'investment_experience_level',
      'market_risk_perception',
      'reaction_to_losses_score'
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
      questionIdCfa: item.question_id_cfa,
      id: item.question_id,
      question: item.question_string,
      type: item.question_type,
      options: item.question_options ?? [], // Modern null-coalescing
    }))
    .filter((item) => item.questionIdCfa && item.question);
}

function buildStageData(questionsData) {
  const availableIds = new Set(questionsData.map((question) => question.questionIdCfa));

  return stageDefinitions.map((stage) => ({
    ...stage,
    questionIds: stage.questionIds.filter((questionId) => availableIds.has(questionId)),
  }));
}

function formatAnswerValue(answerObj) {
  // If the answer for this question doesn't exist yet
  if (!answerObj || !answerObj.selected_option) {
    return 'Not selected';
  }

  // Since we are now storing the label directly in the state 
  // during handleSelect, we can just return it.
  return answerObj.selected_option.label;
}

// --- Main Component ---

export default function Questionnaire() {
  const navigate = useNavigate();
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMode, setLoadingMode] = useState('fetch');
  const [error, setError] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentQuestionIndexInStage, setCurrentQuestionIndexInStage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [riskResult, setRiskResult] = useState(null);

  useEffect(() => {
    if (!getCookie('auth_token')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    // 1. Initialize AbortController to fix React 18 double-fetch
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setLoadingMode('fetch');
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
  const currentQuestionData = questionsData.find((question) => question.questionIdCfa === currentQuestionId);
  const selectedValue = answers[currentQuestionId]?.selected_option?.value || '';

  const completedStages = useMemo(() => {
    return stages
      .map((stage, index) => ({
        index,
        isComplete: stage.questionIds.length > 0 && 
                    stage.questionIds.every((id) => Boolean(answers[id])), 
      }))
      .filter((stage) => stage.isComplete)
      .map((stage) => stage.index);
  }, [answers, stages]);

  const stageProgress = useMemo(() => {
    if (!currentStageQuestionIds.length) return 0;
    const answered = currentStageQuestionIds.filter((id) => Boolean(answers[id])).length;
    return Math.round((answered / currentStageQuestionIds.length) * 100);
  }, [answers, currentStageQuestionIds]);

  const handleSelect = (value) => {
    // 1. Find the full option object from the current question's metadata
    const selectedOption = currentQuestionData.options?.find(opt => opt.value === value);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: {
        question_id: currentQuestionData.id,
        question_string: currentQuestionData.question,
        question_type: currentQuestionData.type,
        question_id_cfa: currentQuestionId,
        selected_option: currentQuestionData.type === 'number_input' 
          ? { 
              label: value.toString(), 
              value: value.toString(), 
              weight: 0 
            }
          : {
              label: selectedOption?.label || '',
              value: selectedOption?.value || '',
              weight: selectedOption?.weight || 0
            }
      },
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

    submitAssessment();
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

  const submitAssessment = async () => {
    try {
      setLoadingMode('submit');
      setLoading(true);

      // Transform the answers object into the 'responses' array
      const payload = {
        responses: Object.values(answers).map(ans => ({
          question_id: ans.question_id,
          question_string: ans.question_string,
          question_type: ans.question_type,
          question_id_cfa: ans.question_id_cfa,
          selected_option: ans.selected_option
        }))
      };

      const response = await api.post('/assessment/risk', payload);
      const result = response.data || null;

      setRiskResult(result);
      if (result) {
        sessionStorage.setItem('latestRiskAssessment', JSON.stringify(result));
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const isLastQuestion = currentQuestionIndexInStage === currentStageQuestionIds.length - 1;
  const isLastStage = currentStageIndex === stages.length - 1;

  // --- Render Cycle ---

  if (loading) {
    return <LoadingTemplate mode={loadingMode} />;
  }

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
            We have captured your answers and risk profile inputs. You can now optimize your portfolio and view your results.
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
                <p>Proceed to your results page to view your computed risk tier.</p>
                <p>Use this tier to continue portfolio optimization.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            {questionsData.map((question) => (
              <SummaryRow
                key={question.questionIdCfa}
                label={question.question}
                value={formatAnswerValue(answers[question.questionIdCfa])}
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
              onClick={() =>
                navigate('/questionnaire/results', {
                  state: { riskResult },
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90"
            >
              Optimize my portfolio
              <TrendingUp size={18} />
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