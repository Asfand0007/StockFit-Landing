import { useState } from 'react';
import { ArrowUpRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { login as loginRequest } from '../services/auth';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden flex items-center justify-center px-4">
      {/* Glow blobs */}
      <div className="absolute -right-[15%] -top-[15%] h-125 w-125 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
      <div className="absolute -left-[10%] bottom-[10%] h-100 w-100 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="assests/Stockfit-logo.png" alt="StockFit" className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-white/60">Sign in to your Stock Fit account</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          variants={itemVariants}
          className="space-y-4 mb-8"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              await loginRequest({ email, password });
              window.location.assign('/dashboard');
            } catch (err) {
              console.error(err);
              setError(err?.response?.data?.message || err.message || 'Login failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          {/* Email Input */}
          <div className="relative">
            <label className="text-sm font-semibold text-white/80 mb-2 block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Mail className="text-primary/60" size={20} />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="text-sm font-semibold text-white/80 mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded bg-secondary/50 border border-primary/30 accent-primary" />
              <span className="text-white/70">Remember me</span>
            </label>
            <a href="#" className="text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          {error && <div className="text-sm text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.form>

        {/* Sign Up Link */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
