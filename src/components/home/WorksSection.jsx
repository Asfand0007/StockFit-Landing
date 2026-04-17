import Steps from "./workSection/Steps"
import Ticker from "./workSection/Ticker";
import { motion } from "framer-motion";

const revealItem = {
    hidden: { opacity: 0, y: 24 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function WorksSection() {

    return (
        <motion.section
            className="relative w-full min-h-screen bg-background font-montserrat px-4 sm:px-8 py-12 sm:py-16"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1 }}
        >
            {/* Header */}
            <motion.div variants={revealItem} className="flex flex-col justify-center items-center mb-8 sm:mb-10">
                <span className="inline-block text-xs sm:text-sm rounded-full px-3 py-1 mb-4 text-secondary-dark bg-secondary-light">
                    How It Works
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight text-secondary-dark text-center">
                    Build Your Perfect
                    <br />
                    Portfolio in 4 Steps
                </h1>
            </motion.div>

            {/* <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-16 text-black">
                <div>
                    <span className="inline-block text-xs border rounded-full px-3 py-1 mb-4 text-secondary-light text-secondary-dark bg-secondary-light">
                        How It Works
                    </span>
                    <h1 className="text-5xl leading-tight">
                        Build Your Perfect
                        <br />
                        Portfolio in 3 Steps
                    </h1>
                    <p className="mt-4 text-gray-400 max-w-lg text-sm">
                        StockFit simplifies investing in the Pakistan Stock Exchange by combining risk profiling with intelligent optimization. From understanding your preferences to generating a personalized portfolio — everything is tailored for you.
                    </p>
                </div>
                <button className="w-4/5 sm:w-auto bg-secondary-dark text-white px-5 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-1 hover:bg-secondary transition-colors">
                    Get Started
                </button>
            </div> */}

            {/* 3-Column Cards */}
            <motion.div variants={revealItem}>
                <Steps />
            </motion.div>

            <motion.div variants={revealItem} className="flex flex-col items-center justify-end gap-4 mb-10 sm:mb-16 px-2">
                <p className="mt-4 text-gray-500 max-w-xl text-sm text-center leading-relaxed">
                    StockFit simplifies investing in the Pakistan Stock Exchange by combining risk profiling with intelligent optimization — everything tailored for you.
                </p>
                <button className="w-auto bg-secondary-dark text-white px-6 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-1 hover:bg-secondary transition-colors text-sm">
                    Get Your Profile Started
                </button>
            </motion.div>

            <motion.div variants={revealItem}>
                <Ticker />
            </motion.div>
            {/* ── Decorative bottom wave ───────────────────────────────────────── */}
            <div className="grid grid-cols-3 absolute bottom-0 right-0 w-full items-baseline">
                <div className="bg-[#0a0c0b] h-20 rounded-tr-2xl" />
                <div className="relative bg-[#0a0c0b] h-10 rounded-tr-2xl">
                    <div className="absolute bottom-full bg-[#0a0c0b] h-5 w-5" />
                    <div className="absolute bottom-full bg-[#fafafa] h-5 w-5 rounded-bl-2xl" />
                </div>
                <div className="relative bg-[#0a0c0b] h-0">
                    <div className="absolute bottom-full bg-[#0a0c0b] h-5 w-5" />
                    <div className="absolute bottom-full bg-[#fafafa] h-5 w-5 rounded-bl-2xl" />
                </div>
            </div>
        </motion.section>
    );
}