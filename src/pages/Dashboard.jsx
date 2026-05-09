import { useNavigate } from 'react-router-dom';
import Navbar from '../components/global/Navbar';
import { getCurrentUser, getTokenFromCookie } from '../services/auth';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const token = getTokenFromCookie();
  const greetingName = user?.name || user?.fullName || user?.email || '';

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <div className="pt-28 px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-white/70">Welcome{greetingName ? `, ${greetingName}` : ''}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/dashboard/questionnaire')}
            className="w-full text-left bg-secondary/40 border border-primary/20 rounded-2xl p-6 hover:bg-secondary/60 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Fill Questionnaire</h3>
            <p className="text-white/70">Answer a quick survey to personalize your portfolios.</p>
          </button>

          <button
            onClick={() => navigate('/dashboard/portfolios')}
            className="w-full text-left bg-secondary/40 border border-primary/20 rounded-2xl p-6 hover:bg-secondary/60 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">View my portfolios</h3>
            <p className="text-white/70">See and manage your investment portfolios.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
