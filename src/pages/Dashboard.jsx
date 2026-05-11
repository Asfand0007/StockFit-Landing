import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, CheckCircle2, Plus } from 'lucide-react';
import Navbar from '../components/global/Navbar';
import { getCurrentUser } from '../services/auth';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const greetingName = user?.name || user?.fullName || user?.email || '';
  const [questionnaires, setQuestionnaires] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [portfolioError, setPortfolioError] = useState(null);
  const [showAllPortfolios, setShowAllPortfolios] = useState(false);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        setLoading(true);
        const response = await api.get('/assessment/history');
        setQuestionnaires(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questionnaires:', err);
        setQuestionnaires([]);
        setError(null); // Don't show error to user, just treat as no questionnaires
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

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

  const hasQuestionnaires = questionnaires.length > 0;
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
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.08 }}
        onClick={() => navigate('/portfolio', { state: { portfolio } })}
        className="w-full rounded-xl border border-white/10 bg-black/20 p-5 text-left hover:border-primary/30 transition-colors"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
              <p className="text-sm font-semibold text-white/90">Portfolio {index + 1}</p>
            </div>
            <p className="text-sm text-white/60">Created on {formatPortfolioDate(portfolio.created_at)}</p>
            <p className="text-sm text-primary/80 mt-1">Risk Profile: {portfolio.assessed_risk || 'N/A'}</p>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary whitespace-nowrap">
            {holdingsCount} holdings
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
          <p className="text-sm text-white/65">Tap to view the full portfolio breakdown.</p>
          <span className="text-sm font-semibold text-primary">View details</span>
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

        <div className="relative z-10 mb-12">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-white/70 mt-2">Welcome{greetingName ? `, ${greetingName}` : ''}.</p>
        </div>

        {/* No Questionnaires State */}
        {!loading && !hasQuestionnaires && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <button
              onClick={() => navigate('/questionnaire')}
              className="w-full text-left bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/40 rounded-2xl p-8 hover:border-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Get Started</h2>
                  <p className="text-white/70">
                    Fill out your first questionnaire to help us personalize your investment experience.
                  </p>
                </div>
                <Plus size={32} className="text-primary flex-shrink-0 ml-4" />
              </div>
            </button>
          </motion.div>
        )}

        {/* Questionnaires List */}
        {!loading && hasQuestionnaires && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 space-y-6"
          >
            {/* Previous Questionnaires Section */}
            <div className="rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
              <h2 className="text-2xl font-bold mb-6">Your Questionnaires</h2>
              <div className="space-y-4">
                {questionnaires.map((questionnaire, index) => {
                  const submittedDate = new Date(questionnaire.submitted_at || questionnaire.created_at);
                  const formattedDate = submittedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  });

                  return (
                    <motion.div
                      key={questionnaire.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="rounded-xl border border-white/10 bg-black/20 p-5 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                            <p className="text-sm font-semibold text-white/90">Assessment {index + 1}</p>
                          </div>
                          <p className="text-sm text-white/60">Completed on {formattedDate}</p>
                          {questionnaire.risk_profile && (
                            <p className="text-sm text-primary/80 mt-1">Risk Profile: {questionnaire.risk_profile}</p>
                          )}
                        </div>
                        <button
                          onClick={() => navigate(`/assessment/${questionnaire.id}`)}
                          className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors flex-shrink-0"
                        >
                          View
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Fill New Questionnaire Button */}
            <button
              onClick={() => navigate('/questionnaire')}
              className="w-full rounded-[28px] border border-primary/40 bg-primary/5 hover:bg-primary/10 p-6 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Plus size={20} className="text-primary" />
              <span className="font-semibold text-primary">Fill New Questionnaire</span>
            </button>
          </motion.div>
        )}

        {/* Past Portfolios Section */}
        {!portfolioLoading && hasPortfolios && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative z-10 mt-8 space-y-6"
          >
            <div className="rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Past Portfolios</h2>
                  <p className="mt-1 text-sm text-white/70">The 3 most recent portfolios are shown first.</p>
                </div>
                <p className="text-sm text-white/60">{portfolios.length} total portfolios</p>
              </div>

              <div className="space-y-4">
                {latestPortfolios.map((portfolio, index) => (
                  <PortfolioCard
                    key={portfolio.portfolio_id || `${portfolio.created_at || 'portfolio'}-${index}`}
                    portfolio={portfolio}
                    index={index}
                  />
                ))}

                {remainingPortfolios.length > 0 && (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <button
                      type="button"
                      onClick={() => setShowAllPortfolios((prev) => !prev)}
                      className="flex w-full items-center justify-between gap-4 text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white/90">
                          {showAllPortfolios ? 'Hide older portfolios' : `Show ${remainingPortfolios.length} older portfolio${remainingPortfolios.length > 1 ? 's' : ''}`}
                        </p>
                        <p className="mt-1 text-sm text-white/60">Open the expandable list to view earlier portfolios.</p>
                      </div>
                      {showAllPortfolios ? <ArrowUp size={18} className="text-primary flex-shrink-0" /> : <ArrowDown size={18} className="text-primary flex-shrink-0" />}
                    </button>

                    {showAllPortfolios && (
                      <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                        {remainingPortfolios.map((portfolio, index) => (
                          <PortfolioCard
                            key={portfolio.portfolio_id || `${portfolio.created_at || 'portfolio'}-old-${index}`}
                            portfolio={portfolio}
                            index={index + 3}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!portfolioLoading && !hasPortfolios && !portfolioError && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative z-10 mt-8 rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20"
          >
            <p className="text-white/70">No past portfolios found yet.</p>
          </motion.div>
        )}

        {portfolioLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 mt-8 rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20"
          >
            <div className="flex justify-center items-center gap-3">
              <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-white/70">Loading portfolios...</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 shadow-2xl shadow-black/20"
          >
            <div className="flex justify-center items-center gap-3">
              <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-white/70">Loading questionnaires...</p>
            </div>
          </motion.div>
        )}

        {/* View Portfolios Button */}
      </div>
    </div>
  );
}
