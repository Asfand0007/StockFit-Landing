import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown, Plus, Sparkles } from "lucide-react";
import Navbar from "../components/global/Navbar";
import { getCurrentUser } from "../services/auth";
import api from "../api/axios";

function formatPortfolioDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function PortfolioRow({ portfolio, index, isOpen, onToggle }) {
  const allocations = Array.isArray(portfolio.allocations) ? portfolio.allocations : [];
  const totalWeight = allocations.reduce((acc, item) => acc + (item.allocation_percentage || 0), 0);

  return (
    <div className="border-t border-white/10">
      {/* Header row — always visible */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 py-4 text-left cursor-pointer group"
      >
        <div>
          <p className="text-base font-semibold text-white group-hover:text-primary transition-colors">
            Portfolio {index + 1}
          </p>
          <p className="mt-0.5 text-sm text-white/50">
            {formatPortfolioDate(portfolio.created_at)}
            {portfolio.assessed_risk && (
              <span className="ml-3 text-primary/70">{portfolio.assessed_risk}</span>
            )}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <p className="text-xs text-white/40">{allocations.length} holdings</p>
          <ChevronDown
            size={16}
            className={`text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expandable detail */}
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-5">
            {/* Meta */}
            <div className="divide-y divide-white/10 mb-5">
              {portfolio.assessed_risk && (
                <div className="flex items-start justify-between gap-6 py-2.5">
                  <p className="text-sm text-white/55">Assessed risk</p>
                  <p className="text-right text-sm font-medium text-white/90">{portfolio.assessed_risk}</p>
                </div>
              )}
              <div className="flex items-start justify-between gap-6 py-2.5">
                <p className="text-sm text-white/55">Created at</p>
                <p className="text-right text-sm font-medium text-white/90">
                  {portfolio.created_at ? new Date(portfolio.created_at).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            {/* Allocations */}
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-primary" />
              <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">Allocations</p>
            </div>
            <div className="divide-y divide-white/10">
              {allocations.length > 0 ? (
                allocations.map((item, i) => (
                  <div
                    key={`${item.symbol || "alloc"}-${i}`}
                    className="flex items-center justify-between gap-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-white/90">{item.stock_name || "Unknown stock"}</p>
                      <p className="text-xs text-primary/80">{item.symbol || "N/A"}</p>
                    </div>
                    <p className="text-sm font-semibold text-white shrink-0">
                      {item.allocation_percentage ?? 0}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/55 py-2.5">No allocations available.</p>
              )}
            </div>
            {allocations.length > 0 && (
              <p className="mt-2 text-xs text-white/40">Total allocation: {totalWeight}%</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const greetingName = useMemo(() => {
    const firstName = user?.first_name || user?.firstName || "";
    const lastName = user?.last_name || user?.lastName || "";
    const fullName = `${firstName}${firstName && lastName ? " " : ""}${lastName}`.trim();
    return fullName || user?.name || user?.fullName || user?.email || "";
  }, [user]);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentUser());
    const handleStorageChange = (e) => { if (!e.key || e.key === "user") syncUser(); };
    window.addEventListener("stockfit-user-updated", syncUser);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("stockfit-user-updated", syncUser);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setPortfolioLoading(true);
        const response = await api.get("/portfolio");
        const items = Array.isArray(response.data) ? response.data : [];
        const sorted = [...items].sort((a, b) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        );
        setPortfolios(sorted);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
        setPortfolios([]);
      } finally {
        setPortfolioLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  const visiblePortfolios = showAll ? portfolios : portfolios.slice(0, 3);
  const hasMore = portfolios.length > 3;

  function handleToggle(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative pt-28 px-4 md:px-6 pb-16 max-w-5xl mx-auto overflow-hidden"
      >
        {/* <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" /> */}

        {/* Header */}
        <div className="relative z-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.24em] mb-1">Dashboard</p>
          <h1 className="text-3xl md:text-4xl leading-tight">
            Welcome{greetingName ? `, ${greetingName}` : ""}.
          </h1>
          <p className="mt-2 text-gray-400">
            Manage your portfolios and refine your investment strategy.
          </p>
        </div>

        {/* New questionnaire CTA */}
        <div className="relative z-10 mt-8">
          <button
            type="button"
            onClick={() => navigate("/questionnaire")}
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full cursor-pointer hover:bg-gray-100 transition-colors text-sm font-semibold"
          >
            <Plus size={16} />
            Start new questionnaire
          </button>
          <p className="mt-2 text-base text-white/80">
            Complete a new questionnaire to update your investment profile.
          </p>
        </div>

        {/* Portfolios */}
        <div className="relative z-10 mt-10">
          <p className="text-primary text-lg font-semibold uppercase tracking-[0.24em] mb-1">Your Portfolios</p>

          {portfolioLoading ? (
            <p className="mt-4 text-sm text-white/55">Loading your portfolios...</p>
          ) : portfolios.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">
              No portfolios yet. Complete a questionnaire to get started.
            </p>
          ) : (
            <>
              <p className="text-xs text-white/40 mb-4">
                {portfolios.length} {portfolios.length === 1 ? "portfolio" : "portfolios"} total
              </p>

              <div>
                {visiblePortfolios.map((portfolio, index) => {
                  const id = portfolio.portfolio_id || `${portfolio.created_at}-${index}`;
                  return (
                    <PortfolioRow
                      key={id}
                      portfolio={portfolio}
                      index={index}
                      isOpen={expandedId === id}
                      onToggle={() => handleToggle(id)}
                    />
                  );
                })}
                {/* bottom border after last row */}
                <div className="border-t border-white/10" />
              </div>

              {hasMore && (
                <button
                  type="button"
                  onClick={() => setShowAll((s) => !s)}
                  className="mt-4 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                  />
                  {showAll
                    ? "Show fewer"
                    : `Show ${portfolios.length - 3} more portfolio${portfolios.length - 3 > 1 ? "s" : ""}`}
                </button>
              )}
            </>
          )}
        </div>
        {/* Disclaimer */}
        <p className="relative z-10 mt-12 text-xs text-white/30 leading-relaxed">
          StockFit provides AI-generated insights for informational purposes only. Please review the{" "}
          <span className="underline underline-offset-2">Terms &amp; Conditions</span> and{" "}
          <span className="underline underline-offset-2">Privacy Policy</span> before making investment decisions.
        </p>
      </motion.div>
    </div>
  );
}
