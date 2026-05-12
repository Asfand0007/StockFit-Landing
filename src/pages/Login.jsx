import { useState } from 'react';
import { ArrowUpRight, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { getTokenFromCookie, login as loginRequest } from '../services/auth';

const FORGOT_STEPS = {
  requestCode: 'requestCode',
  verifyCode: 'verifyCode',
  resetPassword: 'resetPassword',
};

function getAuthErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.detail || error?.message || fallback;
}

function getForgotPasswordMessage(error, fallback) {
  const apiMessage = error?.response?.data?.message || error?.response?.data?.detail;

  if (apiMessage) {
    return apiMessage;
  }

  if (error?.response?.status === 400) {
    return fallback;
  }

  if (error?.response?.status >= 500) {
    return 'Something went wrong on our side. Please try again.';
  }

  return error?.message || fallback;
}

export default function Login() {
  const token = getTokenFromCookie();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetCode, setShowResetCode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [view, setView] = useState('signIn');
  const [forgotStep, setForgotStep] = useState(FORGOT_STEPS.requestCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

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

  const openForgotPassword = () => {
    setView('forgotPassword');
    setForgotStep(FORGOT_STEPS.requestCode);
    setResetCode('');
    setNewPassword('');
    setShowResetPassword(false);
    setShowResetCode(false);
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const backToSignIn = ({ clearFeedback = true } = {}) => {
    setView('signIn');
    setForgotStep(FORGOT_STEPS.requestCode);
    setResetCode('');
    setNewPassword('');
    setShowResetPassword(false);
    setShowResetCode(false);
    setConfirmPassword('');
    if (clearFeedback) {
      setError(null);
      setSuccess(null);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await loginRequest({ email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(getAuthErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (forgotStep === FORGOT_STEPS.requestCode) {
        await api.post('/auth/forgot-password', { email: email.trim() });
        setForgotStep(FORGOT_STEPS.verifyCode);
        setSuccess('Reset code sent. Check your email.');
        return;
      }

      if (forgotStep === FORGOT_STEPS.verifyCode) {
        await api.post('/auth/verify-reset-code', {
          email: email.trim(),
          code: resetCode.trim(),
        });
        setForgotStep(FORGOT_STEPS.resetPassword);
        setSuccess('Code verified. You can now set a new password.');
        return;
      }

      // Ensure password confirmation matches before calling reset endpoint
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      await api.post('/auth/reset-password', {
        email: email.trim(),
        code: resetCode.trim(),
        new_password: newPassword,
      });

      setSuccess('Password reset successfully. You can now sign in.');
      backToSignIn({ clearFeedback: false });
    } catch (err) {
      console.error(err);
      if (forgotStep === FORGOT_STEPS.requestCode) {
        setError(getForgotPasswordMessage(err, 'Unable to send reset code.'));
      } else if (forgotStep === FORGOT_STEPS.verifyCode) {
        setError(getForgotPasswordMessage(err, 'Invalid code.'));
      } else {
        setError(getForgotPasswordMessage(err, 'Unable to reset password.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-dvh w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden flex items-center justify-center px-4">
      <div className="absolute -right-[15%] -top-[15%] h-125 w-125 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
      <div className="absolute -left-[10%] bottom-[10%] h-100 w-100 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

      <motion.div className="z-10 w-full max-w-md" variants={containerVariants} initial="hidden" animate="show">
        <motion.div variants={itemVariants} className="absolute left-4 top-4 z-20">
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-primary/30 bg-secondary/30 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-primary/50 hover:bg-secondary/50 hover:text-white"
          >
            <ArrowLeft size={18} className="mr-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            Go Back
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="flex justify-center mb-6">
            <img src="assests/Stockfit-logo.png" alt="StockFit" className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {view === 'signIn' ? 'Welcome Back' : 'Reset Password'}
          </h1>
          <p className="text-white/60">
            {view === 'signIn' ? 'Sign in to your StockFit account' : 'Recover access to your account'}
          </p>
        </motion.div>

        {view === 'signIn' ? (
          <motion.form variants={itemVariants} className="space-y-3 mb-6" onSubmit={handleLoginSubmit}>
            <div className="relative">
              <label className="text-sm font-semibold text-white/80 mb-2 block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Lock className="text-primary/60" size={20} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-secondary/50 border border-primary/30 accent-primary" />
                <span className="text-white/70">Remember me</span>
              </label>
              <button type="button" onClick={openForgotPassword} className="text-primary hover:text-primary/80 transition-colors cursor-pointer">
                Forgot password?
              </button>
            </div>

            {error && <div className="text-sm text-red-400">{error}</div>}
            {success && <div className="text-sm text-green-400">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.form>
        ) : (
          <motion.form variants={itemVariants} className="space-y-4 mb-6" onSubmit={handleForgotPasswordSubmit}>

            <div className="relative">
              <label className="text-sm font-semibold text-white/80 mb-2 block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                  <Mail className="text-primary/60" size={20} />
                </div>
              </div>
            </div>

            {forgotStep === FORGOT_STEPS.verifyCode && (
              <div className="relative">
                <label className="text-sm font-semibold text-white/80 mb-2 block">Reset Code</label>
                <div className="relative">
                  <input
                    type={showResetCode ? 'text' : 'password'}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="••••••••"
                    className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <Lock className="text-primary/60" size={20} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetCode((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                    aria-label={showResetCode ? 'Hide reset code' : 'Show reset code'}
                  >
                    {showResetCode ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                  </button>
                </div>
              </div>
            )}

            {forgotStep === FORGOT_STEPS.resetPassword && (
              <>
                <div className="relative">
                  <label className="text-sm font-semibold text-white/80 mb-2 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Lock className="text-primary/60" size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                    >
                      {showResetPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold text-white/80 mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Lock className="text-primary/60" size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                    >
                      {showResetPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>
              </>
            )}



            {error && <div className="text-sm text-red-400">{error}</div>}
            {success && <div className="text-sm text-green-400">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading
                ? 'Please wait...'
                : forgotStep === FORGOT_STEPS.requestCode
                  ? 'Send Code'
                  : forgotStep === FORGOT_STEPS.verifyCode
                    ? 'Verify Code'
                    : 'Reset Password'}
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <button type="button" onClick={backToSignIn} className="w-full text-sm text-white/70 hover:text-white transition-colors">
              Back to sign in
            </button>
          </motion.form>
        )}

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
