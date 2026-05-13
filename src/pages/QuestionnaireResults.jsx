import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, BarChart3, CheckCircle2 } from "lucide-react";
import Navbar from "../components/global/Navbar";

function getStoredRiskResult() {
  const raw = sessionStorage.getItem("latestRiskAssessment");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function tierColor(value, mode) {
  const v = value?.toString().toUpperCase();
  if (mode === "signal") {
    if (v === "GREEN") return "text-green-400";
    if (v === "YELLOW") return "text-yellow-400";
    if (v === "RED") return "text-red-400";
    return "text-white/90";
  }
  if (v === "MODERATE") return "text-yellow-400";
  if (mode === "inverse") {
    if (v === "HIGH") return "text-green-400";
    if (v === "LOW") return "text-red-400";
  } else {
    if (v === "HIGH") return "text-red-400";
    if (v === "LOW") return "text-green-400";
  }
  return "text-white/90";
}

function ResultRow({ label, value, mode }) {
  if (value === null || value === undefined) return null;
  const display = mode === "message" ? value : capitalize(value);
  const colorClass =
    mode && mode !== "message" ? tierColor(value, mode) : "text-white/90";
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/10 py-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-white/90 leading-snug">{label}</p>
      <p className={`text-right font-medium shrink-0 max-w-[55%] ${colorClass} ${label==="Message" ? "text-sm" : "uppercase text-xs"}`}>
        {display || "N/A"}
      </p>
    </div>
  );
}

export default function QuestionnaireResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [riskResult, setRiskResult] = useState(
    location.state?.riskResult || null
  );

  useEffect(() => {
    if (!riskResult) setRiskResult(getStoredRiskResult());
  }, [riskResult]);

  const primaryRiskTier = useMemo(() => {
    if (!riskResult) return null;
    return riskResult.portfolio_tier && riskResult.assessed_risk
      ? riskResult.portfolio_tier || riskResult.assessed_risk
      : riskResult.risk_need_tier ||
          riskResult.risk_capacity_tier ||
          riskResult.behavioral_risk_tier ||
          null;
  }, [riskResult]);

  const hasPrimaryFieldsNull = useMemo(() => {
    return (
      riskResult &&
      (riskResult.assessed_risk === null || riskResult.portfolio_tier === null)
    );
  }, [riskResult]);

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-28 px-4 md:px-6 pb-16 max-w-5xl mx-auto overflow-hidden"
      >
        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">
              Questionnaire Results
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight">
            Your risk profile is ready.
          </h1>
          <p className="mt-2 text-gray-400">
            Based on your questionnaire, we calculated your risk tier and portfolio signal.
          </p>
        </div>

        {/* Assessment warning */}
        {hasPrimaryFieldsNull && (
          <div className="relative z-10 mt-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="mt-0.5 text-red-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-200">Assessment Warning</p>
                <p className="mt-1 text-sm text-red-100/80">
                  {riskResult?.message || "Unable to assess risk profile. Please contact support."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/questionnaire")}
              className="mt-4 inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-sm font-semibold"
            >
              Retake assessment
            </button>
          </div>
        )}

        {/* Risk tier summary */}
        {!hasPrimaryFieldsNull && primaryRiskTier && (
          <div className="relative z-10 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 size={16} className="text-primary" />
              <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">
                Risk tier
              </p>
            </div>
            <p className="text-2xl md:text-3xl text-white">
              {capitalize(primaryRiskTier)}
            </p>
          </div>
        )}

        {/* No tier found */}
        {!hasPrimaryFieldsNull && !primaryRiskTier && (
          <div className="relative z-10 mt-6 flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 text-yellow-300 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-200">Risk tier unavailable</p>
              <p className="mt-1 text-sm text-yellow-100/80">
                We could not find a recent assessment response. Please complete the questionnaire again.
              </p>
            </div>
          </div>
        )}

        {/* Result rows */}
        <div className="relative z-10 divide-y divide-white/10">
          <ResultRow label="Portfolio tier"     value={riskResult?.portfolio_tier}     mode="standard" />
          <ResultRow label="Risk need tier"     value={riskResult?.risk_need_tier}     mode="inverse"  />
          <ResultRow label="Risk capacity tier" value={riskResult?.risk_capacity_tier} mode="inverse"  />
          <ResultRow label="Overall risk tier"  value={riskResult?.assessed_risk}      mode="standard" />
          <ResultRow label="Signal"             value={riskResult?.signal}             mode="signal"   />
          <ResultRow label="Message"            value={riskResult?.message}            mode="message"  />
        </div>

        {/* CTA */}
        <div className="relative z-10 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {!hasPrimaryFieldsNull && (
            <button
              type="button"
              disabled={!primaryRiskTier}
              onClick={() =>
                navigate("/recommendations", {
                  state: { riskTier: primaryRiskTier, riskResult },
                })
              }
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-sm font-semibold disabled:cursor-not-allowed disabled:bg-primary/40"
            >
              See recommendations
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
