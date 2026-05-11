import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/global/Navbar';
import RecommendationList from '../components/recommendations/RecommendationList';
import LoadingState from '../components/recommendations/states/LoadingState';
import ErrorState from '../components/recommendations/states/ErrorState';
import useExpandedStock from '../hooks/useExpandedStock';
import useRecommendations from '../hooks/useRecommendations';
import useStockSelection from '../hooks/useStockSelection';
import { getStoredQuestionnaireId, getStoredRiskTier, setStoredPortfolio } from '../utils/storage';

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();

  const riskTier = useMemo(() => location.state?.riskTier || getStoredRiskTier(), [location.state?.riskTier]);
  const { recommendations, loading, error } = useRecommendations(riskTier);
  const { selectedSymbols, toggleStock } = useStockSelection();
  const { expandedSymbol, toggleExpandedStock } = useExpandedStock();
  const [isSubmittingPortfolio, setIsSubmittingPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);

  const stocks = useMemo(() => {
    return Array.isArray(recommendations?.stocks) ? recommendations.stocks : [];
  }, [recommendations]);

  const selectedStocks = useMemo(() => {
    return stocks.filter((stock) => selectedSymbols.includes(stock.symbol));
  }, [selectedSymbols, stocks]);

  const questionnaireId = useMemo(() => {
    return location.state?.riskResult?.questionnaire_id || location.state?.riskResult?.questionnaireId || getStoredQuestionnaireId();
  }, [location.state?.riskResult]);

  const handleViewPortfolio = async () => {
    if (!questionnaireId) {
      setPortfolioError('Questionnaire ID is unavailable. Please complete the questionnaire again.');
      return;
    }

    try {
      setIsSubmittingPortfolio(true);
      setPortfolioError(null);

      const response = await api.post('/portfolio', {
        questionnaire_id: questionnaireId,
        symbols: selectedSymbols,
      });

      const portfolio = response.data || null;

      if (portfolio) {
        setStoredPortfolio(portfolio);
      }

      navigate('/portfolio', { state: { portfolio, riskTier, fromRecommendations: true } });
    } catch (err) {
      console.error('Failed to create portfolio:', err);
      setPortfolioError('Failed to create portfolio. Please try again.');
    } finally {
      setIsSubmittingPortfolio(false);
    }
  };

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
            <TrendingUp size={22} />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Stock Recommendations</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Recommendations for your risk profile.</h1>
          <p className="mt-3 max-w-2xl text-white/68">
            Showing recommendations for tier: <span className="text-primary font-semibold">{riskTier || 'Unavailable'}</span>
          </p>

          {!riskTier && (
            <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 text-yellow-300" />
                <div>
                  <p className="font-semibold text-yellow-200">Risk tier unavailable</p>
                  <p className="mt-1 text-sm text-yellow-100/80">
                    Please complete the questionnaire first so we can generate recommendations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-black/20 p-6">
              <LoadingState text="Loading recommendations..." />
            </div>
          )}

          {!loading && error && (
            <div className="mt-8">
              <ErrorState message={error} actionLabel="Try again" onAction={() => window.location.reload()} />
            </div>
          )}

          {!loading && !error && riskTier && (
            <div className="mt-8 space-y-4">
              <RecommendationList
                stocks={stocks}
                selectedSymbols={selectedSymbols}
                expandedSymbol={expandedSymbol}
                onToggleExpand={toggleExpandedStock}
                onToggleSelect={toggleStock}
              />
            </div>
          )}

          {portfolioError && (
            <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
              {portfolioError}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate('/questionnaire/results')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
            >
              <ArrowLeft size={18} />
              Back to results
            </button>

            <button
              type="button"
              disabled={selectedStocks.length === 0 || isSubmittingPortfolio}
              onClick={handleViewPortfolio}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/40"
            >
              {isSubmittingPortfolio ? 'Creating portfolio...' : 'View my portfolio'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}