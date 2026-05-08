import { useState } from 'react';
import { ArrowUpRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signup as signupRequest } from '../services/auth';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  const passwordStrength =
    formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden flex items-center justify-center px-4 py-12">
      <div className="absolute -right-[15%] -top-[15%] h-[500px] w-[500px] rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
      <div className="absolute -left-[10%] -bottom-[10%] h-[400px] w-[400px] rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

      <motion.div className="relative z-10 w-full max-w-md" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="assests/Stockfit-logo.png" alt="StockFit" className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Get Started</h1>
          <p className="text-white/60">Create your Stock Fit account today</p>
        </motion.div>

        <motion.form
          variants={itemVariants}
          className="space-y-4 mb-8"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            if (formData.password !== formData.confirmPassword) {
              setError('Passwords do not match');
              return;
            }
            if (!agreedToTerms) {
              setError('You must agree to the terms');
              return;
            }
            setLoading(true);
            try {
              await signupRequest(formData);
              navigate('/login');
            } catch (err) {
              console.error(err);
              setError(err?.response?.data?.message || err.message || 'Sign up failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="relative">
            <label className="text-sm font-semibold text-white/80 mb-2 block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <User className="text-primary/60" size={20} />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-white/80 mb-2 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Mail className="text-primary/60" size={20} />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-white/80 mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Lock className="text-primary/60" size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2 flex gap-1">
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordStrength === 'weak'
                      ? 'bg-red-500'
                      : passwordStrength === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordStrength === 'weak'
                      ? 'bg-secondary/40'
                      : passwordStrength === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                  }`}
                />
                <div
                  className={`h-1 flex-1 rounded-full ${
                    passwordStrength === 'strong' ? 'bg-primary' : 'bg-secondary/40'
                  }`}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-white/80 mb-2 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Lock className="text-primary/60" size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 rounded bg-secondary/50 border border-primary/30 accent-primary mt-0.5"
            />
            <span className="text-sm text-white/70">
              I agree to the{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Privacy Policy
              </a>
            </span>
          </label>

          {error && <div className="text-sm text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={!agreedToTerms || loading}
            className="w-full mt-6 bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group"
          >
            {loading ? 'Creating...' : 'Create Account'}
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
