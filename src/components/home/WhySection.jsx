import { useEffect, useRef, useState } from "react";
import { reasons } from "./whySection/data.jsx";
import SidePanel from "./whySection/SidePanel";
import CenterColumn from "./whySection/CenterColumn";
import MobileWhySection from "./whySection/MobileWhySection";

export default function WhySection() {
    const [activeReason, setActiveReason] = useState(0);
    const panelRefs = useRef([]);

    // ── Desktop scroll tracking ────────────────────────────────────────
    useEffect(() => {
        const observers = panelRefs.current.map((ref, i) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveReason(i); },
                { threshold: 0.5 }
            );
            observer.observe(ref);
            return observer;
        });
        return () => observers.forEach((o) => o?.disconnect());
    }, []);

    return (
        <section className="relative font-montserrat" style={{ background: "#0a0c0b" }}>

            {/* ══════════════════════════════════════════
                DESKTOP — three-column sticky layout
            ══════════════════════════════════════════ */}
            <div className="hidden md:block" style={{ minHeight: `${reasons.length * 100}vh` }}>
                <CenterColumn reasons={reasons} activeReason={activeReason} />
                <div className="relative" style={{ zIndex: 10 }}>
                    {reasons.map((reason, i) => (
                        <div
                            key={i}
                            ref={(el) => (panelRefs.current[i] = el)}
                            className="grid h-screen"
                            style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
                        >
                            <div>
                                <SidePanel item={reason.left} side="left" />
                            </div>
                            <div />
                            <div>
                                <SidePanel item={reason.right} side="right" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ════════════════════════════════════════
    MOBILE — heading + horizontal scroll
════════════════════════════════════════ */}
            <div>
                <MobileWhySection reasons={reasons} />
            </div>
        </section>
    );
}