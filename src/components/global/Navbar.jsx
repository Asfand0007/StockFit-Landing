import { ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getTokenFromCookie, getCurrentUser, logout } from '../../services/auth';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#', scrollTarget: 'features' },
  { label: 'Contact', href: '/#contact-us', scrollTarget: 'contact-us' },
];

// Stagger children for drawer links
const drawerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const drawerItem = {
  hidden: { x: -32, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.45 } },
};

export default function Navbar({ animateIn = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const [displayName, setDisplayName] = useState('User');

  useEffect(() => {
    // Check if user is logged in
    const token = getTokenFromCookie();
    setIsLoggedIn(!!token);

    if (token) {
      const currentUser = getCurrentUser();
      setUser(currentUser);

      const firstName = currentUser?.first_name || '';
      const lastName = currentUser?.last_name || '';
      const name = `${firstName}${firstName && lastName ? ' ' : ''}${lastName}`.trim();
      setDisplayName(name || 'User');
    } else {
      setUser(null);
      setDisplayName('User');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Only run intersection observer on home page
    if (location.pathname !== '/') {
      setActiveSection('home');
      return;
    }

    // Use Intersection Observer to detect which section is in view
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);

  const isActive = (href, scrollTarget) => {
    if (location.pathname !== '/') {
      return location.pathname === href;
    }
    
    // On home page, check if this is the active section
    if (scrollTarget) {
      return activeSection === scrollTarget;
    }
    
    // Home link is active if no other section is active or if at top
    return activeSection === 'home' || activeSection === '';
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-us');

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleDashboard = () => {
    setDropdownOpen(false);
    navigate('/dashboard');
  };

  const handleQuestionnaire = () => {
    setDropdownOpen(false);
    navigate('/questionnaire');
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          FULL-SCREEN MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-100 md:hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-secondary backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Glow blob inside drawer */}
            <motion.div
              className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary opacity-10 blur-[120px] pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.12 }}
              transition={{ duration: 0.6 }}
              style={{ willChange: "opacity" }}
            />

            {/* Drawer content */}
            <div className="relative z-10 flex flex-col h-full px-8 pt-20 pb-12">

              {/* Close button */}
              <motion.button
                className="absolute top-5 right-6 text-white p-2 rounded-full hover:bg-[#374a4660] transition-colors cursor-pointer"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                aria-label="Close menu"
              >
                <X size={26} />
              </motion.button>

              {/* Logo */}
              <motion.div
                className="flex gap-3 items-center mb-14"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4 }}
              >
                <img src="assests/Stockfit-logo.png" alt="logo" className="h-10 w-10" />
                <span className="font-montserrat text-xl font-bold text-white">Stock Fit</span>
              </motion.div>

              {/* Nav links */}
              <motion.nav
                className="flex flex-col gap-2 flex-1"
                variants={drawerContainer}
                initial="hidden"
                animate="show"
              >
                {navLinks.map((link, i) => (
                  <motion.div key={link.label} variants={drawerItem}>
                    <Link
                      to={link.href}
                      className={`font-montserrat text-2xl font-semibold py-3 px-4 rounded-2xl transition-colors block ${isActive(link.href, link.scrollTarget)
                        ? 'text-primary'
                        : 'text-white/80 hover:text-white hover:bg-[#374a4645]'
                        }`}
                      onClick={(event) => {
                        if (link.scrollTarget) {
                          event.preventDefault();
                          scrollToSection(link.scrollTarget);
                        }

                        setMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                {isLoggedIn ? (
                  <>
                    <button 
                      onClick={() => handleDashboard()}
                      className="w-full bg-white text-black px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors font-montserrat font-semibold">
                      Dashboard
                    </button>
                    <button 
                      onClick={() => handleQuestionnaire()}
                      className="w-full text-white border border-white/20 px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-[#374a4645] transition-colors font-montserrat">
                      Fill Questionnaire
                    </button>
                    <button 
                      onClick={() => handleLogout()}
                      className="w-full text-white px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-[#374a4645] transition-colors font-montserrat">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => { navigate('/signup'); setMenuOpen(false); }}
                      className="w-full text-white border border-white/20 px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-[#374a4645] transition-colors font-montserrat">
                      Create Account <ArrowUpRight strokeWidth={1.5} size={18} />
                    </button>
                    <button 
                      onClick={() => { navigate('/login'); setMenuOpen(false); }}
                      className="w-full bg-white text-black px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors font-montserrat font-semibold">
                      Login <ArrowUpRight strokeWidth={1.5} size={18} />
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          NAVBAR BAR
      ══════════════════════════════════════════ */}
      <motion.nav
        className="font-montserrat absolute top-5 left-1/2 -translate-x-1/2 z-50 w-11/12"
        initial={false}
        animate={animateIn ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-3 py-3 rounded-full grid grid-cols-4 items-center gap-2">

          {/* Logo */}
          <div className="flex gap-2 items-center justify-start">
            <img src="assests/Stockfit-logo.png" alt="logo" className="h-10 w-10" />
            <h1 className="text-lg font-bold text-white whitespace-nowrap">Stock Fit</h1>
          </div>

          {/* Nav links — hidden on mobile */}
          <div className="hidden md:flex col-span-2 justify-center">
            <div className="w-fit backdrop-blur-2xl bg-secondary px-1.5 py-2.5 rounded-full">
              {navLinks.map((link, i) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-white ${isActive(link.href, link.scrollTarget) ? 'bg-primary p-2 px-4 rounded-full' : 'mx-3 lg:mx-4'}`}
                  onClick={(event) => {
                    if (link.scrollTarget) {
                      event.preventDefault();
                      scrollToSection(link.scrollTarget);
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right CTA — hidden on mobile */}
          <div className="hidden md:flex justify-end gap-2">
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-white text-black px-4 py-2 rounded-full cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition-colors font-semibold">
                  {displayName} <ChevronDown strokeWidth={1.5} size={18} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 bg-secondary backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={handleDashboard}
                        className="w-full cursor-pointer text-left px-4 py-3 text-white hover:bg-white/10 transition-colors whitespace-nowrap">
                        Dashboard
                      </button>
                      <button
                        onClick={handleQuestionnaire}
                        className="w-full cursor-pointer text-left px-4 py-3 text-white hover:bg-white/10 transition-colors border-t border-white/10 whitespace-nowrap">
                        Fill Questionnaire
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full cursor-pointer text-left px-4 py-3 text-red-400 hover:bg-white/10 transition-colors border-t border-white/10 whitespace-nowrap">
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/signup')}
                  className="hidden lg:flex text-white px-4 py-2 rounded-full hover:bg-secondary cursor-pointer items-center gap-1 whitespace-nowrap transition-colors">
                  Create Account <ArrowUpRight strokeWidth={1} />
                </button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-white text-black px-4 py-2 rounded-full cursor-pointer flex items-center gap-1 hover:bg-gray-100 transition-colors">
                  Login <ArrowUpRight strokeWidth={1} />
                </button>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <div className="md:hidden col-span-3 flex justify-end">
            <button
              className="text-white p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}