import { useState } from "react";

const steps = [
    {
        id: "setup",
        number: "01",
        title: "Quick Setup",
        description:
            "Create your account in seconds and get started with a seamless onboarding experience tailored for modern investors.",
        visual: (
            <img
                src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b"
                alt="Account setup"
                className="w-full md:w-1/2 h-full object-cover rounded-xl opacity-80"
            />
        ),
    },
    {
        id: "questionnaire",
        number: "02",
        title: "Smart Questionnaire",
        description:
            "Answer a series of structured questions to capture your financial goals, investment horizon, and tolerance for risk.",
        visual: (
            <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
                alt="Questionnaire"
                className="w-full md:w-1/2 h-full object-cover rounded-xl opacity-80"
            />
        ),
    },
    {
        id: "risk",
        number: "03",
        title: "Risk Profiling",
        description:
            "Your responses are analyzed using a scoring model to classify you as a conservative, balanced, or aggressive investor.",
        visual: (
            <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43"
                alt="Risk analysis"
                className="w-full md:w-1/2 h-full object-cover rounded-xl opacity-80"
            />
        ),
    },
    {
        id: "portfolio",
        number: "04",
        title: "Optimized Portfolio",
        description:
            "Using your risk profile, StockFit applies Genetic Algorithms to construct an optimal portfolio from KSE-30 stocks within the Pakistan Stock Exchange.",
        visual: (
            <img
                src="https://images.unsplash.com/photo-1640161704729-cbe966a08476"
                alt="Portfolio optimization"
                className="w-full md:w-1/2 h-full object-cover rounded-xl opacity-80"
            />
        ),
    },
];

export default function Steps() {
    const [hovered, setHovered] = useState(null);   // desktop hover
    const [active, setActive] = useState("setup");  // mobile tap — first open by default

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
                        <div key={step.id} className="relative flex gap-4">

                            {/* Left column: number badge + connector line */}
                            <div className="flex flex-col items-center flex-shrink-0">
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
                                    <span
                                        className="text-gray-400 text-xs ml-2 transition-transform duration-300 flex-shrink-0"
                                        style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                                    >
                                        ▾
                                    </span>
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
                                    <p className="text-sm text-gray-500 mb-3 leading-relaxed pt-1">
                                        {step.description}
                                    </p>
                                    <div className="w-full h-36 rounded-xl overflow-hidden">
                                        {step.visual}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ════════════════════════════════
                DESKTOP — Horizontal Expand
                (hidden below md)
            ════════════════════════════════ */}
            <div className="hidden md:flex h-80 mb-4 divide-x divide-[#374a4693]">
                {steps.map((step) => {
                    const isHovered = hovered === step.id;
                    return (
                        <div
                            key={step.id}
                            onMouseEnter={() => setHovered(step.id)}
                            onMouseLeave={() => setHovered(null)}
                            className="relative overflow-hidden flex flex-col justify-between p-6 cursor-pointer"
                            style={{
                                flex: isHovered ? "2" : "1",
                                transition: "flex 1s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        >
                            {/* Visual area */}
                            <div className="flex-1 flex items-center justify-center">
                                {step.visual}
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
                                <h3 className="text-base font-semibold text-black flex items-center gap-2">
                                    <span className="text-xs font-normal text-gray-400">{step.number}</span>
                                    {step.title}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}