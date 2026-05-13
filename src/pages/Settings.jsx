import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Settings2, User } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, changePassword, updateProfile } from "../services/auth";
import Navbar from "../components/global/Navbar";

function getAuthErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.detail || error?.message || fallback;
}

function PasswordInput({ label, name, value, onChange, show, onToggle, placeholder }) {
  return (
    <div>
      <label className="text-sm text-white/55 mb-2 block">{label}</label>
      <div className="relative">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "••••••••"}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileFormData, setProfileFormData] = useState({ firstName: "", lastName: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setProfileFormData({ firstName: user.first_name || "", lastName: user.last_name || "" });
    }
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
    setProfileError(null);
    setProfileSuccess(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const validateProfileForm = () => {
    if (!profileFormData.firstName.trim()) { setProfileError("First name is required"); return false; }
    if (!profileFormData.lastName.trim()) { setProfileError("Last name is required"); return false; }
    return true;
  };

  const validatePasswordForm = () => {
    if (!passwordFormData.currentPassword.trim()) { setPasswordError("Current password is required"); return false; }
    if (!passwordFormData.newPassword.trim()) { setPasswordError("New password is required"); return false; }
    if (passwordFormData.newPassword.length < 6) { setPasswordError("New password must be at least 6 characters"); return false; }
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) { setPasswordError("Passwords do not match"); return false; }
    return true;
  };

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
        setProfileFormData({ firstName: updatedUser.first_name || "", lastName: updatedUser.last_name || "" });
      }
      setProfileSuccess("Profile updated successfully.");
      setTimeout(() => setProfileSuccess(null), 5000);
    } catch (error) {
      setProfileError(getAuthErrorMessage(error, "Failed to update profile"));
    } finally {
      setProfileLoading(false);
    }
  };

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
      setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSuccess("Password changed successfully.");
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (error) {
      setPasswordError(getAuthErrorMessage(error, "Failed to change password"));
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0a0c0b] text-white">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-28 px-4 md:px-6 pb-16 max-w-2xl mx-auto overflow-hidden"
      >
        {/* <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" /> */}

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Settings2 size={16} className="text-primary" />
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em]">Settings</p>
          </div>
          <h1 className="text-3xl md:text-4xl leading-tight">Account settings.</h1>
          <p className="mt-2 text-gray-400">Manage your profile and security preferences.</p>
        </div>

        {/* Tabs */}
        <div className="relative z-10 mt-8 flex gap-6 border-b border-white/10">
          {["profile", "password"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
                activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab === "profile" ? "Update Profile" : "Change Password"}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t"
                />
              )}
            </button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="relative z-10 mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-white/55 mb-2 block">First Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    name="firstName"
                    value={profileFormData.firstName}
                    onChange={handleProfileChange}
                    placeholder="John"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/55 mb-2 block">Last Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    name="lastName"
                    value={profileFormData.lastName}
                    onChange={handleProfileChange}
                    placeholder="Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-white/35">{currentUser.email}</p>

            {profileError && <p className="text-sm text-red-400">{profileError}</p>}
            {profileSuccess && <p className="text-sm text-green-400">{profileSuccess}</p>}

            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-sm font-semibold disabled:cursor-not-allowed disabled:bg-white/40"
            >
              {profileLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}

        {/* Password tab */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="relative z-10 mt-6 space-y-4">
            <PasswordInput
              label="Current Password"
              name="currentPassword"
              value={passwordFormData.currentPassword}
              onChange={handlePasswordChange}
              show={showCurrentPassword}
              onToggle={() => setShowCurrentPassword((v) => !v)}
            />
            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwordFormData.newPassword}
              onChange={handlePasswordChange}
              show={showNewPassword}
              onToggle={() => setShowNewPassword((v) => !v)}
            />
            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              value={passwordFormData.confirmPassword}
              onChange={handlePasswordChange}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((v) => !v)}
            />

            {passwordError && <p className="text-sm text-red-400">{passwordError}</p>}
            {passwordSuccess && <p className="text-sm text-green-400">{passwordSuccess}</p>}

            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-sm font-semibold disabled:cursor-not-allowed disabled:bg-white/40"
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        )}

        {/* Back */}
        <div className="relative z-10 mt-10">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
