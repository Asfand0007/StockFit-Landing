import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import { changePassword, updateProfile } from '../services/auth';
import Navbar from '../components/global/Navbar';

function getAuthErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.detail || error?.message || fallback;
}

export default function Settings() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  // Password form state
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  // Load user data on mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setProfileFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
      });
    }
  }, []);

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
    setProfileError(null);
    setProfileSuccess(null);
  };

  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  // Validate profile form
  const validateProfileForm = () => {
    if (!profileFormData.firstName.trim()) {
      setProfileError('First name is required');
      return false;
    }
    if (!profileFormData.lastName.trim()) {
      setProfileError('Last name is required');
      return false;
    }
    return true;
  };

  // Validate password form
  const validatePasswordForm = () => {
    if (!passwordFormData.currentPassword.trim()) {
      setPasswordError('Current password is required');
      return false;
    }
    if (!passwordFormData.newPassword.trim()) {
      setPasswordError('New password is required');
      return false;
    }
    if (passwordFormData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return false;
    }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle profile submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const response = await updateProfile({
        email: currentUser.email,
        first_name: profileFormData.firstName,
        last_name: profileFormData.lastName,
      });

      const updatedUser = response?.user || response;
      if (updatedUser) {
        setCurrentUser(updatedUser);
        setProfileFormData({
          firstName: updatedUser.first_name || '',
          lastName: updatedUser.last_name || '',
        });
      }

      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(null), 5000);
    } catch (error) {
      setProfileError(getAuthErrorMessage(error, 'Failed to update profile'));
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      await changePassword({
        current_password: passwordFormData.currentPassword,
        new_password: passwordFormData.newPassword,
      });

      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setPasswordSuccess('Password changed successfully!');
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (error) {
      setPasswordError(getAuthErrorMessage(error, 'Failed to change password'));
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-dvh bg-[#0a0c0b] text-white">
        <Navbar />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.45 } },
  };

  return (
    <div className="relative min-h-dvh w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden px-4 py-10">
      <div className="absolute -right-[15%] -top-[15%] h-125 w-125 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
      <div className="absolute -left-[10%] -bottom-[10%] h-100 w-100 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-5rem)] w-full max-w-md items-center pt-16">
        <motion.div className="w-full" variants={containerVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} className="mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center rounded-full border border-primary/30 bg-secondary/30 px-4 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-primary/50 hover:bg-secondary/50 hover:text-white"
            >
              <ArrowLeft size={18} className="mr-2 transition-transform" />
              Go Back
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-6">
            <div className="flex justify-center mb-6">
              <img src="/assests/Stockfit-logo.png" alt="StockFit" className="h-12 w-12" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-white/60">Manage your account and security preferences</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-primary/20 bg-secondary/30 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm"
          >
            <div className="flex gap-4 mb-8 border-b border-white/10">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'profile' ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
              >
                Update Profile
                {activeTab === 'profile' && <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t" layoutId="activeTab" />}
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`pb-4 px-2 font-semibold transition-colors relative ${
                  activeTab === 'password' ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
              >
                Change Password
                {activeTab === 'password' && <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t" layoutId="activeTab" />}
              </button>
            </div>

            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <label className="text-sm font-semibold text-white/80 mb-2 block">First Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        value={profileFormData.firstName}
                        onChange={handleProfileChange}
                        placeholder="John"
                        className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <User className="text-primary/60" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-semibold text-white/80 mb-2 block">Last Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={profileFormData.lastName}
                        onChange={handleProfileChange}
                        placeholder="Doe"
                        className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <User className="text-primary/60" size={20} />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/50">Email: {currentUser.email}</p>

                {profileError && <div className="text-sm text-red-400">{profileError}</div>}
                {profileSuccess && <div className="text-sm text-green-400">{profileSuccess}</div>}

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full mt-4 bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {profileLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div className="relative">
                  <label className="text-sm font-semibold text-white/80 mb-2 block">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordFormData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Lock className="text-primary/60" size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                    >
                      {showCurrentPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold text-white/80 mb-2 block">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordFormData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Lock className="text-primary/60" size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                    >
                      {showNewPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm font-semibold text-white/80 mb-2 block">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordFormData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="auth-input w-full bg-secondary/40 backdrop-blur-sm border border-primary/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-secondary/60 transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <Lock className="text-primary/60" size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/60 hover:text-primary transition-colors z-10"
                    >
                      {showConfirmPassword ? <EyeOff size={20} className="cursor-pointer" /> : <Eye size={20} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>

                {passwordError && <div className="text-sm text-red-400">{passwordError}</div>}
                {passwordSuccess && <div className="text-sm text-green-400">{passwordSuccess}</div>}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full mt-4 bg-primary text-black font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
