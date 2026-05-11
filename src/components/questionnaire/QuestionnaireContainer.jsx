import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/global/Navbar';
import LoadingTemplate from './Loading-template';
import useQuestionnaire from './useQuestionnaire';
import StageIndicator from './StageIndicator';
import QuestionRenderer from './QuestionRenderer';
import NavigationControls from './NavigationControls';
import SummaryView from './SummaryView';
import { useNavigate } from 'react-router-dom';

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

export default function QuestionnaireContainer() {
  const navigate = useNavigate();
  const q = useQuestionnaire(navigate);

  const {
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
  } = q;

  if (loading && loadingMode === 'fetch') return <LoadingTemplate mode={loadingMode} />;

  if (submitted)
    return (
      <QuestionnaireLayout>
        <SummaryView
          answers={answers}
          questionsData={questionsData}
          riskResult={riskResult}
          isSubmitting={isSubmitting}
          submitError={error}
          onRetrySubmit={submitAssessment}
          onReview={() => setSubmitted(false)}
        />
      </QuestionnaireLayout>
    );

  if (error)
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

  const totalStages = stages.length;
  const currentStageTitle = activeStage?.title || 'Questionnaire';
  const isLastQuestion = currentQuestionIndexInStage === currentStageQuestionIds.length - 1;
  const isLastStage = currentStageIndex === stages.length - 1;

  return (
    <QuestionnaireLayout>
      <div className="relative z-10 mb-12">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">Stage {currentStageIndex + 1} of {totalStages}</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold leading-tight">{currentStageTitle}</h1>
        <p className="mt-3 max-w-2xl text-white/65">Question {currentQuestionIndexInStage + 1} of {currentStageQuestionIds.length}</p>
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
          <h2 className="text-2xl font-semibold text-white mb-6">{currentQuestionData?.question}</h2>
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

        <QuestionRenderer
          questionData={currentQuestionData}
          selectedValue={selectedValue}
          onSelect={handleSelect}
          inputId={currentQuestionId}
        />

        <NavigationControls
          onPrev={handlePrevious}
          onNext={handleNext}
          canPrev={!(currentStageIndex === 0 && currentQuestionIndexInStage === 0)}
          canNext={Boolean(selectedValue)}
          isLast={isLastQuestion && isLastStage}
        />
      </motion.section>
    </QuestionnaireLayout>
  );
}
