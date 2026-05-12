import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, BarChart3, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/global/Navbar';

function getStoredRiskResult() {
  const raw = sessionStorage.getItem('latestRiskAssessment');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function ResultRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/10 py-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-white/60">{label}</p>
      <p className="text-right font-medium text-white/90">{value || 'N/A'}</p>
    </div>
  );
}

export default function QuestionnaireResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [riskResult, setRiskResult] = useState(location.state?.riskResult || null);

  useEffect(() => {
    if (!riskResult) {
      setRiskResult(getStoredRiskResult());
    }
  }, [riskResult]);

  const primaryRiskTier = useMemo(() => {
    if (!riskResult) {
      return null;
    }

    return (
      riskResult.portfolio_tier ||
      riskResult.assessed_risk ||
      riskResult.risk_need_tier ||
      riskResult.risk_capacity_tier ||
      riskResult.behavioral_risk_tier ||
      null
    );
  }, [riskResult]);

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <div className="relative pt-28 px-6 pb-16 max-w-5xl mx-auto">
        <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/20"
        >
          <div className="flex items-center gap-3 text-primary mb-5">
            <BarChart3 size={22} />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Questionnaire Results</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your risk profile is ready.</h1>
          <p className="mt-3 max-w-2xl text-white/68">
            Based on your questionnaire, we calculated your risk tier and portfolio signal.
          </p>

          {primaryRiskTier ? (
            <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/10 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-primary/80">Risk tier</p>
              <div className="mt-3 flex items-center gap-3">
                <CheckCircle2 size={20} className="text-primary" />
                <p className="text-2xl md:text-3xl font-semibold text-white">{primaryRiskTier}</p>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 text-yellow-300" />
                <div>
                  <p className="font-semibold text-yellow-200">Risk tier unavailable</p>
                  <p className="mt-1 text-sm text-yellow-100/80">
                    We could not find a recent assessment response. Please complete the questionnaire again.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <ResultRow label="Assessed risk" value={riskResult?.assessed_risk} />
            <ResultRow label="Portfolio tier" value={riskResult?.portfolio_tier} />
            <ResultRow label="Risk need tier" value={riskResult?.risk_need_tier} />
            <ResultRow label="Risk capacity tier" value={riskResult?.risk_capacity_tier} />
            <ResultRow label="Behavioral risk tier" value={riskResult?.behavioral_risk_tier} />
            <ResultRow label="Signal" value={riskResult?.signal} />
            <ResultRow label="Message" value={riskResult?.message} />
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {/* <button
              type="button"
              onClick={() => navigate('/questionnaire')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
            >
              Back to questionnaire
            </button> */}

            <button
              type="button"
              disabled={!primaryRiskTier}
              onClick={() => navigate('/recommendations', { state: { riskTier: primaryRiskTier, riskResult } })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
            >
              See recommendations
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
