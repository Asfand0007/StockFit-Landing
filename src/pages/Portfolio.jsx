import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Briefcase, Sparkles } from 'lucide-react';
import Navbar from '../components/global/Navbar';

function getStoredSelection() {
  const raw = sessionStorage.getItem('selectedRecommendationStocks');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function StockPill({ stock }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-sm font-semibold text-white">{stock.stock_name || 'Unknown stock'}</p>
      <p className="mt-1 text-xs text-primary/80">{stock.symbol || 'N/A'}</p>
    </div>
  );
}

export default function Portfolio() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialSelection = location.state || getStoredSelection() || {};
  const [riskTier] = useState(initialSelection.riskTier || null);
  const [selectedStocks] = useState(Array.isArray(initialSelection.selectedStocks) ? initialSelection.selectedStocks : []);
  const [loadingOptimization, setLoadingOptimization] = useState(false);
  const [optimizedPortfolio, setOptimizedPortfolio] = useState(null);

  useEffect(() => {
    if (selectedStocks.length === 0) {
      setOptimizedPortfolio(null);
      return;
    }

    const timer = setTimeout(() => {
      const mockWeights = selectedStocks.map((stock, index) => {
        const base = Math.floor(100 / selectedStocks.length);
        const bonus = index === 0 ? 100 - base * selectedStocks.length : 0;
        return {
          symbol: stock.symbol,
          stock_name: stock.stock_name,
          weight_percent: base + bonus,
        };
      });

      setOptimizedPortfolio({
        risk_tier: riskTier,
        generated_at: new Date().toISOString(),
        allocations: mockWeights,
        note: 'Placeholder optimization response. Backend optimization API integration is pending.',
      });
      setLoadingOptimization(false);
    }, 1000);

    setLoadingOptimization(true);
    return () => clearTimeout(timer);
  }, [riskTier, selectedStocks]);

  const totalWeight = useMemo(() => {
    if (!optimizedPortfolio?.allocations) {
      return 0;
    }
    return optimizedPortfolio.allocations.reduce((acc, item) => acc + (item.weight_percent || 0), 0);
  }, [optimizedPortfolio]);

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
            <Briefcase size={22} />
            <span className="text-sm font-semibold uppercase tracking-[0.24em]">Portfolio Builder</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your selected stocks.</h1>
          <p className="mt-3 max-w-2xl text-white/68">
            Risk tier: <span className="text-primary font-semibold">{riskTier || 'Unavailable'}</span>
          </p>

          {selectedStocks.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 text-yellow-300" />
                <div>
                  <p className="font-semibold text-yellow-200">No selected stocks found</p>
                  <p className="mt-1 text-sm text-yellow-100/80">
                    Please choose stocks in recommendations before viewing your portfolio.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedStocks.map((stock, index) => (
                  <StockPill key={`${stock.symbol || 'stock'}-${index}`} stock={stock} />
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-black/20 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={18} />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">Optimized Portfolio (Placeholder)</p>
                </div>

                {loadingOptimization ? (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-white/75">Generating placeholder optimized portfolio...</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {optimizedPortfolio?.allocations?.map((item, index) => (
                      <div key={`${item.symbol || 'allocation'}-${index}`} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-white/90">{item.stock_name || 'Unknown stock'}</p>
                          <p className="text-xs text-primary/80">{item.symbol || 'N/A'}</p>
                        </div>
                        <p className="font-semibold text-white">{item.weight_percent}%</p>
                      </div>
                    ))}

                    <div className="pt-2 text-sm text-white/65">
                      <p>Total allocation: {totalWeight}%</p>
                      <p className="mt-1">{optimizedPortfolio?.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={() => navigate('/recommendations', { state: { riskTier } })}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5"
            >
              <ArrowLeft size={18} />
              Back to recommendations
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
