import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, TrendingUp, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/global/Navbar";
import RecommendationList from "../components/recommendations/RecommendationList";
import LoadingState from "../components/recommendations/states/LoadingState";
import ErrorState from "../components/recommendations/states/ErrorState";
import useExpandedStock from "../hooks/useExpandedStock";
import useRecommendations from "../hooks/useRecommendations";
import useStockSelection from "../hooks/useStockSelection";
import { getStoredQuestionnaireId, getStoredRiskTier, setStoredPortfolio } from "../utils/storage";

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();

  const riskTier = useMemo(
    () => location.state?.riskTier || getStoredRiskTier(),
    [location.state?.riskTier]
  );
  const riskResult = useMemo(
    () => location.state?.riskResult || null,
    [location.state?.riskResult]
  );

  const insufficientReturnRate = useMemo(() => {
    return (
      riskResult?.required_rate_of_return !== undefined &&
      riskResult?.required_rate_of_return < 0
    );
  }, [riskResult]);

  const { recommendations, loading, error } = useRecommendations(
    riskTier,
    !insufficientReturnRate
  );
  const { selectedSymbols, setSelectedSymbols, toggleStock } = useStockSelection();
  const { expandedSymbol, toggleExpandedStock } = useExpandedStock();
  const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);
  const lastAutoSelectedStocksRef = useRef("");

  const stocks = useMemo(() => {
    return Array.isArray(recommendations?.stocks) ? recommendations.stocks : [];
  }, [recommendations]);

  useEffect(() => {
    if (!stocks.length) return;
    const stockSignature = stocks
      .map((s) => s.symbol)
      .filter(Boolean)
      .join("|");
    if (!stockSignature || stockSignature === lastAutoSelectedStocksRef.current)
      return;
    lastAutoSelectedStocksRef.current = stockSignature;
    setSelectedSymbols(
      stocks
        .slice(0, 5)
        .map((s) => s.symbol)
        .filter(Boolean)
    );
  }, [setSelectedSymbols, stocks]);

  const questionnaireId = useMemo(() => {
    return (
      location.state?.riskResult?.questionnaire_id ||
      location.state?.riskResult?.questionnaireId ||
      getStoredQuestionnaireId()
    );
  }, [location.state?.riskResult]);

  const handleViewPortfolio = async () => {
    if (selectedSymbols.length < 3) {
      setPortfolioError(
        "Please select at least 3 stocks before viewing your portfolio."
      );
      return;
    }
    if (!questionnaireId) {
      setPortfolioError(
        "Questionnaire ID is unavailable. Please complete the questionnaire again."
      );
      return;
    }
    try {
      setIsSubmittingPortfolio(true);
      setPortfolioError(null);
      const response = await api.post("/portfolio", {
        questionnaire_id: questionnaireId,
        symbols: selectedSymbols,
      });
      const portfolio = response.data || null;
      if (portfolio) setStoredPortfolio(portfolio);
      navigate("/portfolio", {
        state: { portfolio, riskTier, fromRecommendations: true },
      });
    } catch (err) {
      console.error("Failed to create portfolio:", err);
      setPortfolioError("Failed to create portfolio. Please try again.");
    } finally {
      setIsSubmittingPortfolio(false);
    }
  };

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
            <TrendingUp size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">
              Stock Recommendations
            </p>
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight">
            Recommendations for your risk profile.
          </h1>
          <p className="mt-2 text-gray-400">
            Showing recommendations for tier:{" "}
            <span className="text-white font-semibold">
              {riskTier || "Unavailable"}
            </span>
          </p>
        </div>

        {/* Risk tier missing */}
        {!riskTier && (
          <div className="relative z-10 mt-6 flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 text-yellow-300 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-200">
                Risk tier unavailable
              </p>
              <p className="mt-1 text-sm text-yellow-100/80">
                Please complete the questionnaire first so we can generate
                recommendations.
              </p>
            </div>
          </div>
        )}

        {/* On track notice */}
        {insufficientReturnRate && (
          <div className="relative z-10 mt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="mt-0.5 text-green-400 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-200">
                  On track to reach your goal
                </p>
                <p className="mt-1 text-sm text-green-100/80">
                  With your current savings rate and timeline, you can save up to
                  your desired value. No additional investment returns are needed to
                  meet your financial goals.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="relative z-10 mt-8">
            <LoadingState text="Loading recommendations..." />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="relative z-10 mt-8">
            <ErrorState
              message={error}
              actionLabel="Try again"
              onAction={() => window.location.reload()}
            />
          </div>
        )}

        {/* Stock list */}
        {!loading && !error && riskTier && !insufficientReturnRate && (
          <div className="relative z-10 mt-8 space-y-4">
            <RecommendationList
              stocks={stocks}
              selectedSymbols={selectedSymbols}
              expandedSymbol={expandedSymbol}
              onToggleExpand={toggleExpandedStock}
              onToggleSelect={toggleStock}
            />
          </div>
        )}

        {/* Portfolio error */}
        {portfolioError && (
          <div className="relative z-10 mt-6 flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 text-red-400 shrink-0" />
            <p className="text-sm text-red-200">{portfolioError}</p>
          </div>
        )}

        {/* CTA */}
        <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          {!insufficientReturnRate && (
            <button
              type="button"
              onClick={() => navigate("/questionnaire/results")}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back to results
            </button>
          )}

          {!insufficientReturnRate && (
            <button
              type="button"
              disabled={isSubmittingPortfolio}
              onClick={handleViewPortfolio}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-sm font-semibold disabled:cursor-not-allowed disabled:bg-white/40"
            >
              {isSubmittingPortfolio ? "Creating portfolio..." : "View my portfolio"}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
