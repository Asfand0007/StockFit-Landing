// ── SidePanel ────────────────────────────────────────────────────────
// Renders one feature card (left or right) in the scrolling panels.
// Props:
//   item  — { icon, title, description }
//   side  — "left" | "right"  (controls text/icon alignment)

export default function SidePanel({ item, side }) {
    const isLeft = side === "left";

    return (
        <div
            className={`flex flex-col justify-center h-screen px-8 lg:px-12
                ${isLeft ? "items-end text-right" : "items-start text-left -mt-[50%]"}`}
        >
            {/* Icon badge — themed with site primary teal */}
            {/* <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                style={{
                    background: "rgba(105,179,157,0.12)", 
                    color: "#69b39d",                    
                }}
            >
                {item.icon}
            </div> */}

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl text-white mb-3 leading-snug max-w-xs font-montserrat">
                {item.title}
            </h3>

            {/* Description */}
            <p className={`text-gray-400 text-sm lg:text-base leading-relaxed max-w-xs font-montserrat ${isLeft ? "mr-4" : "ml-4"}`}>
                {item.description}
            </p>
        </div>
    );
}
