import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Zap } from 'lucide-react';
import Navbar from '../components/global/Navbar';
import { getCurrentUser } from '../services/auth';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const greetingName = user?.name || user?.fullName || user?.email || '';
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState(null);
  const [showAllPortfolios, setShowAllPortfolios] = useState(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setPortfolioLoading(true);
        const response = await api.get('/portfolio');
        const items = Array.isArray(response.data) ? response.data : [];

        const sorted = [...items].sort((left, right) => {
          const leftTime = new Date(left.created_at || 0).getTime();
          const rightTime = new Date(right.created_at || 0).getTime();
          return rightTime - leftTime;
        });

        setPortfolios(sorted);
        setPortfolioError(null);
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
        setPortfolios([]);
        setPortfolioError(null);
      } finally {
        setPortfolioLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const latestPortfolios = useMemo(() => portfolios.slice(0, 3), [portfolios]);
  const remainingPortfolios = useMemo(() => portfolios.slice(3), [portfolios]);

  const hasPortfolios = portfolios.length > 0;

  function formatPortfolioDate(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function PortfolioCard({ portfolio, index }) {
    const holdingsCount = Array.isArray(portfolio.allocations) ? portfolio.allocations.length : 0;

    return (
      <motion.button
        type="button"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ x: 8, transition: { duration: 0.2 } }}
        onClick={() => navigate('/portfolio', { state: { portfolio } })}
        className="w-full group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 text-left hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                <CheckCircle2 size={16} className="text-primary" />
              </div>
              <p className="text-base font-bold text-white">Portfolio {index + 1}</p>
            </div>
            <p className="text-sm text-white/60">Created on {formatPortfolioDate(portfolio.created_at)}</p>
            {portfolio.assessed_risk && (
              <p className="text-sm text-primary/90 mt-2 font-medium">Risk Profile: {portfolio.assessed_risk}</p>
            )}
          </div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="rounded-lg border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-bold text-primary whitespace-nowrap"
          >
            {holdingsCount} holdings
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-xs text-white/50">Click to view detailed breakdown</p>
          <motion.span 
            whileHover={{ x: 4 }}
            className="text-sm font-semibold text-primary group-hover:text-white transition-colors"
          >
            View details →
          </motion.span>
        </div>
      </motion.button>
    );
  }

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <div className="relative pt-28 px-6 pb-16 max-w-5xl mx-auto">
        <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-white/70 mt-3 text-lg">Welcome{greetingName ? `, ${greetingName}` : ''}. Manage your portfolios and refine your investment strategy.</p>
        </motion.div>

        {/* New Questionnaire CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 mb-12"
        >
          <motion.button
            onClick={() => navigate('/questionnaire')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full overflow-hidden rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent p-8 hover:border-primary/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 group"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent group-hover:via-primary/20 transition-all duration-500" />
            
            <div className="relative flex items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 rounded-lg bg-primary/30 group-hover:bg-primary/40 transition-colors"
                  >
                    <Zap size={24} className="text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white">Refine Your Strategy</h2>
                </div>
                <p className="text-white/70 text-left max-w-md">
                  Complete a new questionnaire to update your investment profile and get personalized portfolio recommendations.
                </p>
              </div>
              <motion.div 
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-4 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors flex-shrink-0"
              >
                <Plus size={28} className="text-primary" />
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        {/* Portfolios Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 space-y-6"
        >
          {portfolioLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-secondary/30 to-transparent backdrop-blur-xl p-8 shadow-2xl shadow-black/30"
            >
              <div className="flex justify-center items-center gap-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="h-6 w-6 border-3 border-primary/30 border-t-primary rounded-full" 
                />
                <p className="text-white/70 font-medium">Loading your portfolios...</p>
              </div>
            </motion.div>
          ) : hasPortfolios ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-secondary/30 to-transparent backdrop-blur-xl p-8 shadow-2xl shadow-black/30">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold">Your Portfolios</h2>
                    <p className="mt-2 text-sm text-white/60 font-medium">
                      {portfolios.length} total {portfolios.length === 1 ? 'portfolio' : 'portfolios'} • Showing {latestPortfolios.length} most recent
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {latestPortfolios.map((portfolio, index) => (
                    <PortfolioCard
                      key={portfolio.portfolio_id || `${portfolio.created_at || 'portfolio'}-${index}`}
                      portfolio={portfolio}
                      index={index}
                    />
                  ))}

                  {remainingPortfolios.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 mt-4"
                    >
                      <motion.button
                        type="button"
                        onClick={() => setShowAllPortfolios((prev) => !prev)}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                        className="flex w-full items-center justify-between gap-4 text-left transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-white/90">
                            {showAllPortfolios ? '−' : '+'} {showAllPortfolios ? 'Hide older portfolios' : `Show ${remainingPortfolios.length} older portfolio${remainingPortfolios.length > 1 ? 's' : ''}`}
                          </p>
                          <p className="mt-1 text-xs text-white/50">View your complete portfolio history</p>
                        </div>
                        <motion.div
                          animate={{ rotate: showAllPortfolios ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowDown size={18} className="text-primary" />
                        </motion.div>
                      </motion.button>

                      <motion.div
                        initial={false}
                        animate={{ height: showAllPortfolios ? 'auto' : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                          {remainingPortfolios.map((portfolio, index) => (
                            <PortfolioCard
                              key={portfolio.portfolio_id || `${portfolio.created_at || 'portfolio'}-old-${index}`}
                              portfolio={portfolio}
                              index={index + 3}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-secondary/30 to-transparent backdrop-blur-xl p-8 shadow-2xl shadow-black/30"
            >
              <p className="text-white/70 text-center font-medium">No portfolios yet. Complete a questionnaire to get started!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
