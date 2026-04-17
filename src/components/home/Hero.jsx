import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero({ animateIn = true }) {
  const prefersReducedMotion = useReducedMotion();
  const offsetY = prefersReducedMotion ? 0 : 20;

  const heroContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0.04 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const heroItem = {
    hidden: { opacity: 0, y: offsetY },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.58,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const floatingCard = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28, scale: prefersReducedMotion ? 1 : 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.3 : 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.section
      className="relative min-h-screen w-full font-montserrat overflow-hidden bg-[#0a0c0b] text-white"
      variants={heroContainer}
      initial="hidden"
      animate={animateIn ? "show" : "hidden"}
    >
      {/* Glow blob */}
      <div className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] md:h-[600px] md:w-[600px] rounded-full bg-primary opacity-20 blur-[200px]" />

      {/* ── Floating card: logos — tablet (md) + desktop (lg) only ────── */}
      <motion.div
        className="hidden md:block absolute left-[4%] lg:left-[7%] top-[15%]"
        variants={floatingCard}
      >
        <div className="relative h-32 w-32 lg:h-56 lg:w-56">
          <div className="absolute left-0 top-0 h-3/4 w-3/4 bg-secondary-light backdrop-blur-xs overflow-hidden rounded-full shadow-lg">
            <img src="assests/hero/psx-logo.png" className="h-full w-full object-cover" alt="PSX logo" />
          </div>
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:left-[55%] h-1/2 w-1/2 bg-secondary-light backdrop-blur-xs overflow-hidden rounded-full shadow-lg">
            <img src="assests/Stockfit-logo.png" className="m-auto h-full w-full p-3 object-cover" alt="StockFit logo" />
          </div>
        </div>
      </motion.div>

      {/* ── Floating card: portfolio value — tablet (md) + desktop (lg) ── */}
      <motion.div
        className="hidden md:flex absolute right-[3%] lg:right-[2%] bottom-[18%] lg:bottom-[20%] backdrop-blur-xs w-36 h-36 lg:w-60 lg:h-60 bg-secondary-light rounded-2xl justify-center items-center flex-col gap-1 rotate-12"
        variants={floatingCard}
      >
        <img src="assests/hero/trading.png" alt="" className="h-10 w-10 lg:h-20 lg:w-20" />
        <h2 className="text-white text-center text-xs lg:text-xl leading-tight">
          Optimized Portfolio Value
        </h2>
        <p className="text-green-500 text-center leading-tight text-xs lg:text-base">
          +60% Expected <br /> Return
        </p>
      </motion.div>

      {/* ── Floating card: risk level — desktop (lg) only ─────────────── */}
      <motion.div
        className="hidden lg:flex absolute right-[18%] bottom-[10%] backdrop-blur-xs w-40 h-40 bg-secondary-light rounded-2xl justify-center items-center flex-col rotate-6"
        variants={floatingCard}
      >
        <img src="assests/hero/safe.png" alt="" className="h-10 w-10" />
        <h2 className="text-white text-center text-lg mt-2">Risk Level:</h2>
        <p className="text-green-500 text-sm">Moderate</p>
      </motion.div>

      {/* ── Main centred content ─────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-28 pb-28 md:h-screen md:pt-0 md:pb-0 text-center"
        variants={heroContainer}
      >
        <motion.h1 variants={heroItem} className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl leading-none">
          Smart Investing for the <br className="hidden sm:block" /> Pakistan Stock Market
        </motion.h1>
        <motion.p variants={heroItem} className="mt-4 max-w-xl text-center text-sm md:text-base text-gray-400 px-2">
          We analyze your risk appetite and build an optimized portfolio using
          top KSE-30 stocks — data-driven investing tailored to you.
        </motion.p>
        <motion.div variants={heroItem} className="flex flex-col sm:flex-row w-full sm:w-auto justify-center items-center gap-3 mt-5">
          <button className="w-4/5 sm:w-auto text-white px-5 py-2.5 rounded-full bg-primary hover:bg-secondary cursor-pointer flex items-center justify-center gap-1 transition-colors">
            How it Works
            <ArrowUpRight strokeWidth={1} />
          </button>
          <button className="w-4/5 sm:w-auto bg-white text-black px-5 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors">
            Get Started
            <ArrowUpRight strokeWidth={1} />
          </button>
        </motion.div>

        {/* ── Mobile-only stat cards row (shown below CTA on small screens) */}
        <motion.div
          className="md:hidden flex gap-3 mt-10 w-full max-w-xs sm:max-w-sm justify-center"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: prefersReducedMotion ? 0.02 : 0.08,
                delayChildren: prefersReducedMotion ? 0 : 0.05,
              },
            },
          }}
        >

          {/* Portfolio card */}
          <motion.div variants={heroItem} className="bg-secondary-light backdrop-blur-xs rounded-2xl p-3 flex flex-col justify-center items-center flex-1 -rotate-6">
            <img src="assests/hero/trading.png" alt="" className="h-10 w-10" />
            <p className="text-white/80 text-[10px] text-center mt-2 leading-tight font-medium">Optimized Portfolio</p>
            <p className="text-green-500 text-[11px] font-bold">+60% Return</p>
          </motion.div>

          {/* Logo card */}
          <motion.div variants={heroItem} className="p-3 flex flex-col items-center justify-center gap-2 flex-1">
            <div className="relative w-15 h-15 ">
              <div className="absolute left-0 top-0 h-full w-full bg-secondary-light overflow-hidden rounded-full border border-white/10">
                <img src="assests/hero/psx-logo.png" className="h-full w-full object-cover" alt="PSX" />
              </div>
              <div className="absolute top-3/5 left-3/5 h-[70%] w-[70%] bg-secondary-light overflow-hidden rounded-full border border-white/10">
                <img src="assests/Stockfit-logo.png" className="h-full w-full p-1 object-cover" alt="SF" />
              </div>
            </div>
          </motion.div>

          {/* Risk card */}
          <motion.div variants={heroItem} className="bg-secondary-light backdrop-blur-xs rounded-2xl p-3 flex flex-col justify-center items-center flex-1 rotate-3">
            <img src="assests/hero/safe.png" alt="" className="h-10 w-10" />
            <p className="text-white/80 mt-2 text-[10px] text-center leading-tight font-medium">Risk Level</p>
            <p className="text-green-500 text-[11px] font-bold">Moderate</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Decorative bottom wave ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 absolute bottom-0 w-full items-baseline">
        <div className="bg-background h-20 rounded-tr-2xl" />
        <div className="relative bg-background h-10 rounded-tr-2xl">
          <div className="absolute bottom-full bg-background h-5 w-5" />
          <div className="absolute bottom-full bg-[#0a0c0b] h-5 w-5 rounded-bl-2xl" />
        </div>
        <div className="relative bg-background h-0">
          <div className="absolute bottom-full bg-background h-5 w-5" />
          <div className="absolute bottom-full bg-[#0d1110] h-5 w-5 rounded-bl-2xl" />
        </div>
      </div>
    </motion.section>
  );
}