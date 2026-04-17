import { Fragment, useEffect, useRef } from "react";

export default function MobileWhySection({ steps }) {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const scroller = scrollRef.current;
        if (!container || !scroller) return;

        const getMaxScroll = () => Math.max(0, scroller.scrollWidth - scroller.clientWidth);

        const normalizeDeltaY = (e) => {
            // deltaMode: 0=pixels, 1=lines, 2=pages
            if (e.deltaMode === 1) return e.deltaY * 16;
            if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
            return e.deltaY;
        };

        const onWheel = (e) => {
            // Only remap vertical wheel movement.
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            const deltaY = normalizeDeltaY(e);
            if (deltaY === 0) return;

            const maxScroll = getMaxScroll();
            if (maxScroll <= 0) return;

            const current = scroller.scrollLeft;
            const next = Math.min(maxScroll, Math.max(0, current + deltaY));

            const atStart = current <= 0 && deltaY < 0;
            const atEnd = current >= maxScroll && deltaY > 0;

            // Let page scroll normally when horizontal scrolling is exhausted.
            if (atStart || atEnd) return;

            e.preventDefault();
            scroller.scrollLeft = next;
        };

        container.addEventListener("wheel", onWheel, { passive: false });
        return () => container.removeEventListener("wheel", onWheel);
    }, [steps]);

    return (
        <div ref={containerRef} className="md:hidden bg-[#0a0c0b] py-10">
            <div className="flex flex-col items-center text-center mb-10">
                <span
                    className="inline-flex items-center gap-2 text-xs rounded-full px-4 py-1.5 tracking-wide font-montserrat"
                    style={{
                        border: "1px solid rgba(105,179,157,0.3)",
                        color: "#69b39d",
                        background: "rgba(105,179,157,0.08)",
                    }}
                >
                    Why StockFit
                </span>

                <h2 className="text-3xl lg:text-5xl text-white leading-tight font-montserrat">
                    Smart Investing
                    <br />
                    <span style={{ color: "#69b39d" }}>Built Around You</span>
                </h2>

                <img
                    className="w-1/3 h-auto"
                    src="assests/Stockfit-logo.png"
                    alt="Stockfit-logo"
                />
                <p className="mt-2 text-white text-center text-xs px-6 max-w-xs">
                    StockFit combines personalized risk profiling with advanced optimization,
                    ensuring every investment decision is data-driven and aligned with your goals.
                </p>
                <button className="mt-3 w-auto bg-primary text-white px-6 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-1 hover:bg-secondary transition-colors text-sm">
                    Get Your Profile Started
                </button>
            </div>

            {/* Horizontal scroll track */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-10 px-5"
                style={{
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    scrollBehavior: "smooth",
                }}
            >
                {steps.map((step, i) => (
                    <Fragment key={`pair-${i}`}>
                        {/* Left feature card */}
                        <div
                            key={`left-${i}`}
                            className="shrink-0 flex flex-col gap-3 rounded-2xl p-5"
                            style={{ width: "72vw", scrollSnapAlign: "start" }}
                        >
                            <span
                                className="text-xs font-montserrat"
                                style={{ color: "#69b39d", opacity: 0.6, letterSpacing: "0.05em" }}
                            >
                                {String(i * 2 + 1).padStart(2, "0")}
                            </span>
                            <div className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center mb-2">
                                {step.left.icon}
                            </div>
                            <h3 className="text-lg text-white font-montserrat leading-none">
                                {step.left.title}
                            </h3>
                            <p className="text-sm leading-tight font-montserrat text-gray-400">
                                {step.left.description}
                            </p>
                        </div>

                        {/* Right feature card */}
                        <div
                            key={`right-${i}`}
                            className="shrink-0 flex flex-col gap-3 rounded-2xl p-5"
                            style={{ width: "72vw", scrollSnapAlign: "start" }}
                        >
                            <span
                                className="text-xs font-montserrat"
                                style={{ color: "#69b39d", opacity: 0.6, letterSpacing: "0.05em" }}
                            >
                                {String(i * 2 + 2).padStart(2, "0")}
                            </span>
                            <div className="w-10 h-10 bg-[#69b39d] text-[#0a0c0b] rounded-full flex items-center justify-center mb-2">
                                {step.right.icon}
                            </div>
                            <h3 className="text-lg text-white font-montserrat leading-none">
                                {step.right.title}
                            </h3>
                            <p className="text-sm leading-tight font-montserrat text-gray-400">
                                {step.right.description}
                            </p>
                        </div>
                    </Fragment>
                ))}

                <div className="shrink-0 w-2" />
            </div>
        </div>
    );
}