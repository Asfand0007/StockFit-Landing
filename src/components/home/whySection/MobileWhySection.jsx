import { Fragment, useEffect, useRef } from "react";

export default function MobileWhySection({ reasons }) {
    const scrollRef = useRef(null);

    // duplicate for infinite loop
    const loopReasons = [...reasons, ...reasons];

    useEffect(() => {
        const scroller = scrollRef.current;
        if (!scroller) return;

        let isUserInteracting = false;

        const start = () => (isUserInteracting = true);
        const end = () => (isUserInteracting = false);

        scroller.addEventListener("touchstart", start);
        scroller.addEventListener("mousedown", start);
        scroller.addEventListener("touchend", end);
        scroller.addEventListener("mouseup", end);
        scroller.addEventListener("mouseleave", end);

        const interval = setInterval(() => {
            if (isUserInteracting) return;

            scroller.scrollLeft += 1;

            // seamless reset
            const half = scroller.scrollWidth / 2;
            if (scroller.scrollLeft >= half) {
                scroller.scrollLeft = 0;
            }
        }, 20);

        return () => {
            clearInterval(interval);
            scroller.removeEventListener("touchstart", start);
            scroller.removeEventListener("mousedown", start);
            scroller.removeEventListener("touchend", end);
            scroller.removeEventListener("mouseup", end);
            scroller.removeEventListener("mouseleave", end);
        };
    }, []);

    return (
        <div className="md:hidden bg-[#0a0c0b] py-10">
            {/* Header (unchanged) */}
            <div className="flex flex-col items-center text-center mb-10">
                <span className="inline-flex items-center gap-2 text-xs rounded-full px-4 py-1.5 tracking-wide font-montserrat border border-[#69b39d4d] text-[#69b39d] bg-[#69b39d14]">
                    Why StockFit
                </span>

                <h2 className="text-3xl lg:text-5xl text-white leading-tight font-montserrat">
                    Smart Investing <br />
                    <span className="text-[#69b39d]">Built Around You</span>
                </h2>

                <img
                    className="w-1/3 h-auto"
                    src="assests/Stockfit-logo.png"
                    alt="Stockfit-logo"
                />

                <p className="mt-2 text-white text-xs px-6 max-w-xs">
                    StockFit combines personalized risk profiling with advanced optimization,
                    ensuring every investment decision is data-driven and aligned with your goals.
                </p>

                <button className="mt-3 bg-primary text-white px-6 py-2.5 rounded-full flex items-center gap-1 hover:bg-secondary text-sm">
                    Get Your Profile Started
                </button>
            </div>

            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-10 px-5 cursor-grab active:cursor-grabbing no-scrollbar"
            >
                {loopReasons.map((reason, i) => (
                    <Fragment key={i}>
                        {/* Left */}
                        <div className="shrink-0 flex flex-col gap-3 rounded-2xl p-5 w-[72vw]">
                            <span className="text-xs text-[#69b39d] opacity-60">
                                {String((i % reasons.length) * 2 + 1).padStart(2, "0")}
                            </span>

                            <div className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center">
                                {reason.left.icon}
                            </div>

                            <h3 className="text-lg text-white">{reason.left.title}</h3>
                            <p className="text-sm text-gray-400">{reason.left.description}</p>
                        </div>

                        {/* Right */}
                        <div className="shrink-0 flex flex-col gap-3 rounded-2xl p-5 w-[72vw]">
                            <span className="text-xs text-[#69b39d] opacity-60">
                                {String((i % reasons.length) * 2 + 2).padStart(2, "0")}
                            </span>

                            <div className="w-10 h-10 bg-[#69b39d] text-[#0a0c0b] rounded-full flex items-center justify-center">
                                {reason.right.icon}
                            </div>

                            <h3 className="text-lg text-white">{reason.right.title}</h3>
                            <p className="text-sm text-gray-400">{reason.right.description}</p>
                        </div>
                    </Fragment>
                ))}

                <div className="shrink-0 w-2" />
            </div>
        </div>
    );
}