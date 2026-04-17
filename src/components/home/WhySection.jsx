import { useEffect, useRef, useState } from "react";
import { steps } from "./whySection/data.jsx";
import SidePanel from "./whySection/SidePanel";
import CenterColumn from "./whySection/CenterColumn";
import MobileWhySection from "./whySection/MobileWhySection";

export default function WhySection() {
    const [activeStep, setActiveStep] = useState(0);
    const panelRefs = useRef([]);

    // ── Desktop scroll tracking ────────────────────────────────────────
    useEffect(() => {
        const observers = panelRefs.current.map((ref, i) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
                { threshold: 0.5 }
            );
            observer.observe(ref);
            return observer;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    return (
        <div className="relative font-montserrat" style={{ background: "#0a0c0b" }}>

            {/* ══════════════════════════════════════════
                DESKTOP — three-column sticky layout
            ══════════════════════════════════════════ */}
            <div className="hidden md:block" style={{ minHeight: `${steps.length * 100}vh` }}>
                <CenterColumn steps={steps} activeStep={activeStep} />
                <div className="relative" style={{ zIndex: 10 }}>
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            ref={(el) => (panelRefs.current[i] = el)}
                            className="grid h-screen"
                            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
                        >
                            <SidePanel item={step.left} side="left" />
                            <div />
                            <SidePanel item={step.right} side="right" />
                        </div>
                    ))}
                </div>
            </div>

            {/* ════════════════════════════════════════
    MOBILE — heading + horizontal scroll
════════════════════════════════════════ */}
            <MobileWhySection steps={steps} />
        </div>
    );
}