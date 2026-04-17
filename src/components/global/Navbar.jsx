import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Contact', href: '#' },
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ══════════════════════════════════════════
          FULL-SCREEN MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-[100] md:hidden flex flex-col"
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
                  <motion.a
                    key={link.label}
                    href={link.href}
                    variants={drawerItem}
                    className={`font-montserrat text-2xl font-semibold py-3 px-4 rounded-2xl transition-colors ${i === 0
                      ? 'text-primary'
                      : 'text-white/80 hover:text-white hover:bg-[#374a4645]'
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.nav>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-col gap-3 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                <button className="w-full text-white border border-white/20 px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-[#374a4645] transition-colors font-montserrat">
                  Create Account <ArrowUpRight strokeWidth={1.5} size={18} />
                </button>
                <button className="w-full bg-white text-black px-5 py-3 rounded-full cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors font-montserrat font-semibold">
                  Login <ArrowUpRight strokeWidth={1.5} size={18} />
                </button>
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
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-white ${i === 0 ? 'bg-primary p-2 px-4 rounded-full' : 'mx-3 lg:mx-4'}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right CTA — hidden on mobile */}
          <div className="hidden md:flex justify-end gap-2">
            <button className="hidden lg:flex text-white px-4 py-2 rounded-full hover:bg-secondary cursor-pointer items-center gap-1 whitespace-nowrap transition-colors">
              Create Account <ArrowUpRight strokeWidth={1} />
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-full cursor-pointer flex items-center gap-1 hover:bg-gray-100 transition-colors">
              Login <ArrowUpRight strokeWidth={1} />
            </button>
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