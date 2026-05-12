import Navbar from '../components/global/Navbar';
import LegalDocument from '../components/legal/LegalDocument';
import { PRIVACY_SECTIONS, SHORT_FINANCIAL_DISCLAIMER } from '../constants/legalContent';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />

      <div className="relative pt-28 px-6 pb-16 max-w-5xl mx-auto">
        <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-black/20">
          <LegalDocument
            title="Privacy Policy"
            subtitle="This policy explains what we collect, how we use it, and your rights."
            sections={PRIVACY_SECTIONS}
          />

          <div className="mt-8 rounded-2xl border border-yellow-300/30 bg-yellow-500/10 p-4 md:p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-200">Financial Disclaimer</p>
            <p className="mt-2 text-sm md:text-base text-yellow-100/85">{SHORT_FINANCIAL_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
