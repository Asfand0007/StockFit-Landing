// ── CenterColumn ─────────────────────────────────────────────────────
// The sticky center column: section badge, heading, silhouette visual,
// progress dots, and CTA button.
// Props:
//   reasons      — full reasons array (for dot count + active icons)
//   activeReason — index of the currently visible scroll segment

export default function CenterColumn({ reasons, activeReason }) {
    return (
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none z-50"
            style={{ left: "33.333%", width: "33.333%" }}
        >
            {/* ── Section badge + heading ── */}
            <div className="flex flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 text-xs rounded-full px-4 py-1.5 tracking-wide font-montserrat"
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
            </div>

            {/* ── Silhouette figure visual ── */}
            <div className="relative flex items-end justify-center" style={{ width: 220, height: 250 }}>

                <img
                    className="w-11/12 h-11/12"
                    src="assests/Stockfit-logo.png"
                    alt="Stockfit-logo"
                />


                <div
                    className="absolute rounded-full flex items-center justify-center"
                    style={{
                        left: -20, top: 80,
                        background: "#374a46",
                        color: "#69b39d",
                        width: 46, height: 46,
                    }}
                >
                    {reasons[activeReason].left.icon}
                </div>

                {/* Right floating icon bubble (muted secondary) */}
                <div
                    className="absolute rounded-full flex items-center justify-center"
                    style={{
                        right: -10, top: 30,
                        width: 46, height: 46,
                        background: "#69b39d",
                        color: "#0a0c0b",

                    }}
                >
                    {reasons[activeReason].right.icon}
                </div>
            </div>

            {/* ── Progress dots ── */}
            <div className="flex gap-2 mt-4">
                {reasons.map((_, i) => (
                    <div
                        key={i}
                        className="rounded-full"
                        style={{
                            width: activeReason === i ? 28 : 8,
                            height: 8,
                            background: activeReason === i ? "#69b39d" : "#243d37",
                        }}
                    />
                ))}
            </div>

            <p className="mt-4 text-white text-center">
                StockFit combines personalized risk profiling with advanced optimization, ensuring every investment decision is data-driven and aligned with your goals.
            </p>
            {/* ── CTA ── */}
            <button className="mt-3 pointer-events-auto w-4/5 sm:w-auto text-white px-5 py-2.5 rounded-full bg-primary hover:bg-secondary cursor-pointer flex items-center justify-center gap-1">
                Start Risk Assessment
            </button>
        </div>
    );
}
