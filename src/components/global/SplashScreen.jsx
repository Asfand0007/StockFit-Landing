import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState('show'); // 'show' | 'exit'

  useEffect(() => {
    // After 2.4s start the exit animation, then call onFinish
    const exitTimer = setTimeout(() => setPhase('exit'), 2400);
    const finishTimer = setTimeout(() => onFinish?.(), 3200);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  // 12 orbiting particles
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <AnimatePresence>
      {phase === 'show' && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0c0b] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* ── Ambient glow blobs ── */}
          <motion.div
            className="absolute h-[500px] w-[500px] rounded-full bg-primary opacity-15 blur-[140px]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.18 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute h-[300px] w-[300px] rounded-full bg-[#374a46] opacity-20 blur-[100px] -translate-x-40 translate-y-20"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.25 }}
            transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
          />

          {/* ── Orbiting ring of dots ── */}
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
          >
            {particles.map((i) => {
              const angle = (i / particles.length) * 360;
              const rad = (angle * Math.PI) / 180;
              const r = 110;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <motion.div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-primary"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%,-50%)' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: i % 3 === 0 ? 1 : 0.35, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                />
              );
            })}
          </motion.div>

          {/* ── Pulsing outer ring ── */}
          <motion.div
            className="absolute h-48 w-48 rounded-full border border-primary/30"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute h-36 w-36 rounded-full border border-primary/20"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />

          {/* ── Logo circle ── */}
          <motion.div
            className="relative flex flex-col items-center justify-center gap-5 z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              className="h-24 w-24 rounded-full bg-[#374a4652] backdrop-blur-xl border border-primary/20 flex items-center justify-center shadow-2xl"
              animate={{ boxShadow: ['0 0 0px 0px #69b39d30', '0 0 40px 12px #69b39d40', '0 0 0px 0px #69b39d30'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src="assests/Stockfit-logo.png" alt="StockFit" className="h-14 w-14 object-contain" />
            </motion.div>

            {/* Brand name */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-montserrat text-3xl font-bold text-white tracking-widest"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6, ease: 'easeOut' }}
              >
                STOCK<span className="text-primary">FIT</span>
              </motion.h1>
            </div>

            {/* Tagline */}
            <motion.p
              className="font-montserrat text-xs text-gray-500 tracking-[0.25em] uppercase text-center px-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.7 }}
            >
              Smart Investing · Pakistan Stock Market
            </motion.p>

            {/* Loading bar */}
            <motion.div className="w-36 h-0.5 bg-white/10 rounded-full overflow-hidden mt-2">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.3, duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
