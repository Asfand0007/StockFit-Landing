import Hero from "../components/home/Hero";
import Navbar from "../components/global/Navbar";
import WorksSection from "../components/home/WorksSection";
import WhySection from "../components/home/WhySection";
import { motion } from "framer-motion";

const sectionReveal = {
    hidden: { opacity: 0, y: 36 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function Home({ heroReady = false }) {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <Navbar />
            <Hero animateIn={heroReady} />

            <motion.div
                variants={sectionReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <WorksSection />
            </motion.div>

            <motion.div
                variants={sectionReveal}
                initial="shidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                <WhySection />
            </motion.div>
        </motion.main>
    );
}