import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Plus } from 'lucide-react';
import Navbar from '../components/global/Navbar';
import { getCurrentUser } from '../services/auth';
import api from '../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const greetingName = user?.name || user?.fullName || user?.email || '';
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const hasQuestionnaires = questionnaires.length > 0;

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
        <motion.button
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => navigate('/dashboard/portfolios')}
          className="relative z-10 mt-8 w-full text-left bg-secondary/40 border border-primary/20 rounded-2xl p-6 hover:bg-secondary/60 transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">View my portfolios</h3>
          <p className="text-white/70">See and manage your investment portfolios.</p>
        </motion.button>
      </div>
    </div>
  );
}
