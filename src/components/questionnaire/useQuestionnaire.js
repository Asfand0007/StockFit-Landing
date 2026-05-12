import { useEffect, useMemo, useState } from 'react';
import api, { getCookie } from '../../api/axios';

const TIMELINE_QUESTION_ID = 'investment_time_horizon_years';

export default function useQuestionnaire(navigate) {
  const [questionsData, setQuestionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMode, setLoadingMode] = useState('fetch');
  const [error, setError] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentQuestionIndexInStage, setCurrentQuestionIndexInStage] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskResult, setRiskResult] = useState(null);

  useEffect(() => {
    if (!getCookie('auth_token')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setLoadingMode('fetch');
        const response = await api.get('/assessment/questions', { signal: controller.signal });
        const items = Array.isArray(response.data) ? response.data : [];
        const normalized = items
          .map((item) => ({
            questionIdCfa: item.question_id_cfa,
            id: item.question_id,
            question: item.question_string,
            type: item.question_type,
            options: item.question_options ?? [],
          }))
          .filter((item) => item.questionIdCfa && item.question);

        setQuestionsData(normalized);
        setError(null);
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questionnaire. Please try again later.');
        setQuestionsData([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchQuestions();

    return () => controller.abort();
  }, []);

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
      questionIds: ['expects_high_withdrawal_rate', 'has_stable_external_income'],
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
        'reaction_to_losses_score',
      ],
    },
  ];

  const stages = useMemo(() => {
    const availableIds = new Set(questionsData.map((q) => q.questionIdCfa));
    return stageDefinitions.map((stage) => ({
      ...stage,
      questionIds: stage.questionIds.filter((id) => availableIds.has(id)),
    }));
  }, [questionsData]);

  const activeStage = stages[currentStageIndex] || stages[0];
  const currentStageQuestionIds = activeStage?.questionIds || [];
  const currentQuestionId = currentStageQuestionIds[currentQuestionIndexInStage];
  const currentQuestionData = questionsData.find((q) => q.questionIdCfa === currentQuestionId);
  const selectedValue = answers[currentQuestionId]?.selected_option?.value || '';

  const completedStages = useMemo(() => {
    return stages
      .map((stage, index) => ({
        index,
        isComplete: stage.questionIds.length > 0 && stage.questionIds.every((id) => Boolean(answers[id])),
      }))
      .filter((s) => s.isComplete)
      .map((s) => s.index);
  }, [answers, stages]);

  const stageProgress = useMemo(() => {
    if (!currentStageQuestionIds.length) return 0;
    const answered = currentStageQuestionIds.filter((id) => Boolean(answers[id])).length;
    return Math.round((answered / currentStageQuestionIds.length) * 100);
  }, [answers, currentStageQuestionIds]);

  const handleSelect = (value) => {
    const selectedOption = currentQuestionData?.options?.find((opt) => opt.value === value);

    setAnswers((prev) => ({
      ...prev,
      [currentQuestionId]: {
        question_id: currentQuestionData?.id,
        question_string: currentQuestionData?.question,
        question_type: currentQuestionData?.type,
        question_id_cfa: currentQuestionId,
        selected_option:
          currentQuestionData?.type === 'number_input'
            ? { label: value?.toString() || '', value: value?.toString() || '', weight: 0 }
            : { label: selectedOption?.label || '', value: selectedOption?.value || '', weight: selectedOption?.weight || 0 },
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndexInStage < currentStageQuestionIds.length - 1) {
      setCurrentQuestionIndexInStage((p) => p + 1);
      return;
    }

    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex((p) => p + 1);
      setCurrentQuestionIndexInStage(0);
      return;
    }

    submitAssessment();
  };

  const handlePrevious = () => {
    if (currentQuestionIndexInStage > 0) {
      setCurrentQuestionIndexInStage((p) => p - 1);
      return;
    }

    if (currentStageIndex > 0) {
      const prevStage = currentStageIndex - 1;
      setCurrentStageIndex(prevStage);
      setCurrentQuestionIndexInStage(Math.max((stages[prevStage]?.questionIds.length || 1) - 1, 0));
    }
  };

  const submitAssessment = async () => {
    try {
      setError(null);
      setLoadingMode('submit');
      setSubmitted(true);
      setIsSubmitting(true);

      const payload = {
        responses: Object.values(answers).map((ans) => ({
          question_id: ans.question_id,
          question_string: ans.question_string,
          question_type: ans.question_type,
          question_id_cfa: ans.question_id_cfa,
          selected_option: ans.selected_option,
        })),
      };

      const response = await api.post('/assessment/risk', payload);
      const result = response.data || null;

      setRiskResult(result);
      if (result) sessionStorage.setItem('latestRiskAssessment', JSON.stringify(result));
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    questionsData,
    loading,
    loadingMode,
    error,
    currentStageIndex,
    currentQuestionIndexInStage,
    answers,
    submitted,
    isSubmitting,
    riskResult,
    stages,
    activeStage,
    currentStageQuestionIds,
    currentQuestionId,
    currentQuestionData,
    selectedValue,
    completedStages,
    stageProgress,
    handleSelect,
    handleNext,
    handlePrevious,
    submitAssessment,
    setSubmitted,
    setError,
    setLoading,
  };
}
