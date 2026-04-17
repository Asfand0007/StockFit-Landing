import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const steps = [
    {
        id: "setup",
        number: "01",
        title: "Quick Setup",
        description:
            "Create your account in seconds and get started with a seamless onboarding experience tailored for modern investors.",
        imageSrc: "assests/steps/setup.png",
        imageAlt: "Account setup",
    },
    {
        id: "questionnaire",
        number: "02",
        title: "Smart Questionnaire",
        description:
            "Answer a series of structured questions to capture your financial goals, investment horizon, and tolerance for risk.",
        imageSrc: "assests/steps/questionnaire.png",
        imageAlt: "Questionnaire",
    },
    {
        id: "risk",
        number: "03",
        title: "Risk Profiling",
        description:
            "Your responses are analyzed using a scoring model to classify you as a conservative, balanced, or aggressive investor.",
        imageSrc: "assests/steps/profiling.png",
        imageAlt: "Risk analysis",
    },
    {
        id: "portfolio",
        number: "04",
        title: "Optimized Portfolio",
        description:
            "Using your risk profile, StockFit applies Genetic Algorithms to construct an optimal portfolio from KSE-30 stocks within the Pakistan Stock Exchange.",
        imageSrc: "assests/steps/portfolio.png",
        imageAlt: "Portfolio optimization",
    },
];

export default function Steps() {
    const [hovered, setHovered] = useState(null);   // desktop hover
    const [active, setActive] = useState("setup");  // mobile tap — first open by default
    const prefersReducedMotion = useReducedMotion();

    const getReveal = (index = 0) => ({
        initial: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: {
            duration: prefersReducedMotion ? 0.24 : 0.45,
            delay: prefersReducedMotion ? 0 : Math.min(index * 0.04, 0.2),
            ease: [0.22, 1, 0.36, 1],
        },
    });

    return (
        <>
            {/* ════════════════════════════════
                MOBILE — Vertical Tap-to-Expand
                (hidden on md and above)
            ════════════════════════════════ */}
            <div className="flex flex-col md:hidden gap-0 mb-8">
                {steps.map((step, index) => {
                    const isOpen = active === step.id;
                    return (
                        <motion.div key={step.id} className="relative flex gap-4" {...getReveal(index)}>

                            {/* Left column: number badge + connector line */}
                            <div className="flex flex-col items-center shrink-0">
                                <button
                                    onClick={() => setActive(isOpen ? null : step.id)}
                                    className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold font-montserrat transition-colors duration-300 cursor-pointer ${isOpen
                                        ? "bg-secondary text-white border-secondary"
                                        : "text-secondary-dark border-[#374a4693]"
                                        }`}
                                >
                                    {step.number}
                                </button>
                                {index < steps.length - 1 && (
                                    <div className="w-px flex-1 bg-[#374a4693] my-1 min-h-[1rem]" />
                                )}
                            </div>

                            {/* Right column: always-visible title + expandable body */}
                            <div className={`flex-1 ${index < steps.length - 1 ? "pb-8" : "pb-2"}`}>
                                {/* Tappable title row */}
                                <button
                                    onClick={() => setActive(isOpen ? null : step.id)}
                                    className="w-full flex items-center justify-between text-left mb-1 cursor-pointer group"
                                >
                                    <h3 className={`text-base font-semibold leading-tight transition-colors duration-300 ${isOpen ? "text-secondary" : "text-secondary-dark"
                                        }`}>
                                        {step.title}
                                    </h3>
                                    {/* Chevron */}
                                    <div className="flex justify-center items-center">

                                        <img
                                            src={step.imageSrc}
                                            alt={step.imageAlt}
                                            className="h-8 sm:hidden object-cover mx-auto"
                                        />
                                        <span
                                            className="text-gray-400 text-sm ml-2 transition-transform duration-300 flex-shrink-0"
                                            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                        >
                                            ▾
                                        </span>
                                    </div>
                                </button>

                                {/* Expandable: description + image */}
                                <div
                                    className="overflow-hidden"
                                    style={{
                                        maxHeight: isOpen ? "300px" : "0px",
                                        opacity: isOpen ? 1 : 0,
                                        transition: "max-height 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                                    }}
                                >
                                    {/* <div className="rounded-xl overflow-hidden py-3">
                                        <img
                                            src={step.imageSrc}
                                            alt={step.imageAlt}
                                            className="h-30 sm:h-40 object-cover mx-auto sm:mb-auto rounded-xl opacity-80"
                                        />
                                    </div> */}
                                    <p className="text-sm text-gray-500 leading-relaxed ">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ════════════════════════════════
                DESKTOP — Horizontal Expand
                (hidden below md)
            ════════════════════════════════ */}
            <div className="hidden md:flex h-80 mb-4 divide-x divide-[#374a4693]">
                {steps.map((step, index) => {
                    const isHovered = hovered === step.id;
                    return (
                        <motion.div
                            key={step.id}
                            onMouseEnter={() => setHovered(step.id)}
                            onMouseLeave={() => setHovered(null)}
                            className="relative overflow-hidden flex flex-col justify-between p-6 cursor-pointer"
                            {...getReveal(index)}
                            style={{
                                flex: isHovered ? "2" : "1",
                                transition: "flex 1s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        >
                            {/* Visual area */}
                            <div className="flex-1 flex items-center justify-center">
                                <img
                                    src={step.imageSrc}
                                    alt={step.imageAlt}
                                    className="h-30 sm:h-40 object-cover mx-auto sm:mb-auto rounded-xl opacity-80"
                                />
                            </div>

                            {/* Text */}
                            <div className="mt-4">
                                <div
                                    className="overflow-hidden text-gray-700 text-sm mb-1 max-w-sm"
                                    style={{
                                        maxHeight: isHovered ? "80px" : "0px",
                                        opacity: isHovered ? 1 : 0,
                                        transition:
                                            "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
                                    }}
                                >
                                    {step.description}
                                </div>
                                <h3 className="text-base font-semibold text-secondary-dark flex items-center gap-2">
                                    <span className="text-xs font-normal text-gray-400">{step.number}</span>
                                    {step.title}
                                </h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}