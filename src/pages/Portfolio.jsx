import { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Briefcase, Sparkles, ChevronDown } from "lucide-react";
import Navbar from "../components/global/Navbar";
import { getStoredPortfolio } from "../utils/storage";
import api from "../api/axios";
import { groupQuestionnaireItems } from "../utils/questionnaireSections";

function QuestionnaireSection({ title, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-3 cursor-pointer"
        aria-expanded={open}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{title}</p>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-xs text-white/40">{items.length} questions</p>
          <ChevronDown
            size={14}
            className={`text-white/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="divide-y divide-white/10 pb-3">
            {items.map((response) => (
              <div
                key={response.question_id || response.questionIdCfa || response.question_string}
                className="py-2.5"
              >
                <p className="text-sm text-white/55 leading-snug">{response.question_string}</p>
                <p className="mt-0.5 text-sm font-medium text-white/90">
                  {response.selected_option?.label ?? response.selected_option?.value ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const navigate = useNavigate();
  const location = useLocation();

  const portfolio = useMemo(
    () => location.state?.portfolio || getStoredPortfolio() || null,
    [location.state?.portfolio]
  );
  const riskTier = useMemo(() => location.state?.riskTier || null, [location.state?.riskTier]);
  const fromRecommendations = useMemo(
    () => location.state?.fromRecommendations === true,
    [location.state?.fromRecommendations]
  );

  const allocations = Array.isArray(portfolio?.allocations) ? portfolio.allocations : [];

  const totalWeight = useMemo(() => {
    if (!allocations.length) return 0;
    return allocations.reduce((acc, item) => acc + (item.allocation_percentage || 0), 0);
  }, [allocations]);

  const [questionnaire, setQuestionnaire] = useState(null);
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState(null);
  const [qOpen, setQOpen] = useState(false);
  const groupedQuestionnaireResponses = useMemo(
    () => groupQuestionnaireItems(questionnaire?.responses || []),
    [questionnaire]
  );

  useEffect(() => {
    const id =
      portfolio?.questionnaire_id ||
      portfolio?.questionnaireId ||
      portfolio?.questionnaire?.questionnaire_id;
    if (!id) { setQuestionnaire(null); return; }

    let mounted = true;
    setQLoading(true);
    setQError(null);
    api
      .get(`/assessment/questionnaires/${id}`)
      .then((res) => { if (mounted) setQuestionnaire(res.data); })
      .catch((err) => {
        if (mounted) setQError(err?.response?.data?.message || err.message || "Failed to load questionnaire");
      })
      .finally(() => { if (mounted) setQLoading(false); });

    return () => { mounted = false; };
  }, [portfolio]);

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-28 px-4 md:px-6 pb-16 max-w-5xl mx-auto overflow-hidden"
      >
        {/* <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" /> */}

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">Portfolio Builder</p>
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight">Your portfolio is ready.</h1>
          <p className="mt-2 text-gray-400">Review the portfolio returned by the recommendations service.</p>
        </div>

        {/* No portfolio */}
        {!portfolio && (
          <div className="relative z-10 mt-6 flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 text-yellow-300 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-200">No portfolio found</p>
              <p className="mt-1 text-sm text-yellow-100/80">
                Please generate a portfolio from recommendations first.
              </p>
            </div>
          </div>
        )}

        {portfolio && (
          <>
            {/* Meta rows */}
            <div className="relative z-10 mt-2 divide-y divide-white/10">
              {portfolio.assessed_risk && (
                <div className="flex items-start justify-between gap-6 py-3">
                  <p className="text-sm text-white/55">Assessed risk</p>
                  <p className="text-right text-sm font-medium text-white/90">{portfolio.assessed_risk}</p>
                </div>
              )}
              <div className="flex items-start justify-between gap-6 py-3">
                <p className="text-sm text-white/55">Created at</p>
                <p className="text-right text-sm font-medium text-white/90">
                  {portfolio.created_at ? new Date(portfolio.created_at).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            {/* Allocations */}
            <div className="relative z-10 mt-4">
              <div className="flex items-center gap-2 mb-0">
                <Sparkles size={16} className="text-primary" />
                <p className="text-primary text-lg font-semibold uppercase tracking-[0.24em]">Portfolio Allocations</p>
              </div>

              <div className="divide-y divide-white/10">
                {allocations.length > 0 ? (
                  allocations.map((item, index) => (
                    <div
                      key={`${item.symbol || "allocation"}-${index}`}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="text-base font-medium text-white/90">{item.stock_name || "Unknown stock"}</p>
                        <p className="text-sm text-primary/80">{item.symbol || "N/A"}</p>
                      </div>
                      <p className="text-base font-semibold text-primary shrink-0">
                        {(item.allocation_percentage ?? 0).toFixed(2)}%
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/65 py-3">No allocations were returned.</p>
                )}
              </div>

              <p className="mt-3 text-sm text-white/45">Total allocation: {totalWeight.toFixed(2)}%</p>
            </div>

            {/* Questionnaire accordion */}
            <div className="relative z-10 mt-8 border-t border-white/10">
              <button
                type="button"
                onClick={() => setQOpen((s) => !s)}
                className="flex w-full items-center justify-between gap-3 py-4 cursor-pointer"
                aria-expanded={qOpen}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">Questionnaire</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-white/40 transition-transform duration-300 ${qOpen ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: qOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="pb-6">
                    {qLoading ? (
                      <p className="text-sm text-white/70">Loading questionnaire...</p>
                    ) : qError ? (
                      <p className="text-sm text-red-400">{qError}</p>
                    ) : questionnaire ? (
                      <>
                        <div className="divide-y divide-white/10">
                          {/* <div className="flex items-start justify-between gap-6 py-3">
                            <p className="text-sm text-white/55">Taken</p>
                            <p className="text-right text-sm font-medium text-white/90">
                              {questionnaire.created_at
                                ? new Date(questionnaire.created_at).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex items-start justify-between gap-6 py-3">
                            <p className="text-sm text-white/55">Assessed risk</p>
                            <p className="text-right text-sm font-medium text-white/90">
                              {questionnaire.assessed_risk || "N/A"}
                            </p>
                          </div> */}
                        </div>

                        <div className="mt-2">
                          {Array.isArray(questionnaire.responses) && questionnaire.responses.length > 0 ? (
                            groupedQuestionnaireResponses.length > 0 ? (
                              groupedQuestionnaireResponses.map((section) => (
                                <QuestionnaireSection key={section.id} title={section.title} items={section.items} />
                              ))
                            ) : (
                              <p className="text-sm text-white/65 py-3">No answers available.</p>
                            )
                          ) : (
                            <p className="text-sm text-white/65 py-3">No answers available.</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-white/65">No questionnaire linked to this portfolio.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="relative z-10 mt-8">
          {fromRecommendations && (
            <button
              type="button"
              onClick={() => navigate("/dashboard", { state: { riskTier } })}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <p className="relative z-10 mt-12 text-xs text-white/30 leading-relaxed">
          StockFit provides AI-generated insights for informational purposes only. Please review the{" "}
          <span className="underline underline-offset-2">Terms &amp; Conditions</span> and{" "}
          <span className="underline underline-offset-2">Privacy Policy</span> before making investment decisions.
        </p>
      </motion.div>
    </div>
  );
}
