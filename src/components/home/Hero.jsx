import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full font-montserrat overflow-hidden bg-[#0a0c0b] text-white">
      {/* Glow blob */}
      <div className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] md:h-[600px] md:w-[600px] rounded-full bg-primary opacity-20 blur-[200px]" />

      {/* ── Floating card: logos — tablet (md) + desktop (lg) only ────── */}
      <div className="hidden md:block absolute left-[4%] lg:left-[7%] top-[15%]">
        <div className="relative h-32 w-32 lg:h-56 lg:w-56">
          <div className="absolute left-0 top-0 h-3/4 w-3/4 bg-secondary-light backdrop-blur-xs overflow-hidden rounded-full shadow-lg">
            <img src="assests/hero/psx-logo.png" className="h-full w-full object-cover" alt="PSX logo" />
          </div>
          <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 h-1/2 w-1/2 bg-secondary-light backdrop-blur-xs overflow-hidden rounded-full shadow-lg">
            <img src="assests/Stockfit-logo.png" className="m-auto h-full w-full p-3 object-cover" alt="StockFit logo" />
          </div>
        </div>
      </div>

      {/* ── Floating card: portfolio value — tablet (md) + desktop (lg) ── */}
      <div className="hidden md:flex absolute right-[3%] lg:right-[2%] bottom-[18%] lg:bottom-[20%] backdrop-blur-xs w-36 h-36 lg:w-60 lg:h-60 bg-secondary-light rounded-2xl justify-center items-center flex-col gap-1 rotate-12">
        <img src="assests/hero/trading.png" alt="" className="h-10 w-10 lg:h-20 lg:w-20" />
        <h2 className="text-white text-center text-xs lg:text-xl leading-tight">
          Optimized Portfolio Value
        </h2>
        <p className="text-green-500 text-center leading-tight text-xs lg:text-base">
          +60% Expected <br /> Return
        </p>
      </div>

      {/* ── Floating card: risk level — desktop (lg) only ─────────────── */}
      <div className="hidden lg:flex absolute right-[18%] bottom-[10%] backdrop-blur-xs w-40 h-40 bg-secondary-light rounded-2xl justify-center items-center flex-col rotate-6">
        <img src="assests/hero/safe.png" alt="" className="h-10 w-10" />
        <h2 className="text-white text-center text-lg mt-2">Risk Level:</h2>
        <p className="text-green-500 text-sm">Moderate</p>
      </div>

      {/* ── Main centred content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-28 pb-28 md:h-screen md:pt-0 md:pb-0 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
          Smart Investing for the <br className="hidden sm:block" /> Pakistan Stock Market
        </h1>
        <p className="mt-6 max-w-2xl text-center text-base md:text-lg text-gray-400 px-2">
          We analyze your risk appetite and build an optimized portfolio using
          top KSE-30 stocks — data-driven investing tailored to you.
        </p>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center items-center gap-3 mt-5">
          <button className="w-4/5 sm:w-auto text-white px-5 py-2.5 rounded-full bg-primary hover:bg-secondary cursor-pointer flex items-center justify-center gap-1 transition-colors">
            How it Works
            <ArrowUpRight strokeWidth={1} />
          </button>
          <button className="w-4/5 sm:w-auto bg-white text-black px-5 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-1 hover:bg-gray-100 transition-colors">
            Get Started
            <ArrowUpRight strokeWidth={1} />
          </button>
        </div>

        {/* ── Mobile-only stat cards row (shown below CTA on small screens) */}
        <div className="md:hidden flex gap-3 mt-10 w-full max-w-xs sm:max-w-sm justify-center">

          {/* Portfolio card */}
          <div className="bg-secondary-light backdrop-blur-xs rounded-2xl p-3 flex flex-col items-center gap-1.5 flex-1 -rotate-6">
            <img src="assests/hero/trading.png" alt="" className="h-10 w-10" />
            <p className="text-white/80 text-[10px] text-center leading-tight font-medium">Optimized Portfolio</p>
            <p className="text-green-500 text-[11px] font-bold">+60% Return</p>
          </div>

          {/* Logo card */}
          <div className="p-3 flex flex-col items-center justify-center gap-2 flex-1">
            <div className="relative w-15 h-15 ">
              <div className="absolute left-0 top-0 h-full w-full bg-secondary-light overflow-hidden rounded-full border border-white/10">
                <img src="assests/hero/psx-logo.png" className="h-full w-full object-cover" alt="PSX" />
              </div>
              <div className="absolute top-3/5 left-3/5 h-[70%] w-[70%] bg-secondary-light overflow-hidden rounded-full border border-white/10">
                <img src="assests/Stockfit-logo.png" className="h-full w-full p-1 object-cover" alt="SF" />
              </div>
            </div>
          </div>

          {/* Risk card */}
          <div className="bg-secondary-light backdrop-blur-xs rounded-2xl p-3 flex flex-col items-center gap-1.5 flex-1 rotate-2">
            <img src="assests/hero/safe.png" alt="" className="h-10 w-10" />
            <p className="text-white/80 text-[10px] text-center leading-tight font-medium">Risk Level</p>
            <p className="text-green-500 text-[11px] font-bold">Moderate</p>
          </div>
        </div>
      </div>

      {/* ── Decorative bottom wave ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 absolute bottom-0 w-full items-baseline">
        <div className="bg-[#fafafa] h-20 rounded-tr-2xl" />
        <div className="relative bg-[#fafafa] h-10 rounded-tr-2xl">
          <div className="absolute bottom-full bg-[#fafafa] h-5 w-5" />
          <div className="absolute bottom-full bg-[#0a0c0b] h-5 w-5 rounded-bl-2xl" />
        </div>
        <div className="relative bg-[#fafafa] h-0">
          <div className="absolute bottom-full bg-[#fafafa] h-5 w-5" />
          <div className="absolute bottom-full bg-[#0d1110] h-5 w-5 rounded-bl-2xl" />
        </div>
      </div>
    </div>
  );
}


{/* AVATARS USERS */ }
{/* <div className="absolute left-[5%] top-[10%]">
        <div className="flex items-center px-4 py-2 w-fit">
        <div className="flex -space-x-3">
        <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user" className="w-10 h-10 rounded-full border-2 border-white object-cover"/>
        <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user" className="w-10 h-10 rounded-full border-2 border-white object-cover"/>
        <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user" className="w-10 h-10 rounded-full border-2 border-white object-cover"/>
        <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user" className="w-10 h-10 rounded-full border-2 border-white object-cover"/>
        </div>

          <span className="ml-4 text-gray-600 text-lg font-medium">
            2k+ active users
          </span>
        </div>
        </div> */}