import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Briefcase, Sparkles } from 'lucide-react';
import Navbar from '../components/global/Navbar';
import { getStoredPortfolio } from '../utils/storage';

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

  const portfolio = useMemo(() => {
    return location.state?.portfolio || getStoredPortfolio() || null;
  }, [location.state?.portfolio]);

  const allocations = Array.isArray(portfolio?.allocations) ? portfolio.allocations : [];

  const totalWeight = useMemo(() => {
    if (!allocations.length) {
      return 0;
    }
    return allocations.reduce((acc, item) => acc + (item.allocation_percentage || 0), 0);
  }, [allocations]);

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

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Your portfolio is ready.</h1>
          <p className="mt-3 max-w-2xl text-white/68">
            Review the portfolio returned by the recommendations service.
          </p>

          {!portfolio ? (
            <div className="mt-8 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 text-yellow-300" />
                <div>
                  <p className="font-semibold text-yellow-200">No portfolio found</p>
                  <p className="mt-1 text-sm text-yellow-100/80">
                    Please generate a portfolio from recommendations first.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">Assessed risk</p>
                  <p className="mt-2 text-sm font-medium text-white/90">{portfolio.assessed_risk || 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">Created at</p>
                  <p className="mt-2 text-sm font-medium text-white/90">
                    {portfolio.created_at ? new Date(portfolio.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-primary/20 bg-black/20 p-6">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={18} />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">Allocations</p>
                </div>

                <div className="mt-4 space-y-3">
                  {allocations.length > 0 ? (
                    allocations.map((item, index) => (
                      <div key={`${item.symbol || 'allocation'}-${index}`} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="font-medium text-white/90">{item.stock_name || 'Unknown stock'}</p>
                          <p className="text-xs text-primary/80">{item.symbol || 'N/A'}</p>
                        </div>
                        <p className="font-semibold text-white">{item.allocation_percentage ?? 0}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/65">No allocations were returned.</p>
                  )}

                  <div className="pt-2 text-sm text-white/65">
                    <p>Total allocation: {totalWeight}%</p>
                  </div>
                </div>
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
