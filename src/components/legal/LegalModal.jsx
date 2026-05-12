import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import LegalDocument from './LegalDocument';
import { PRIVACY_SECTIONS, TERMS_SECTIONS } from '../../constants/legalContent';

const LEGAL_TABS = {
  terms: 'terms',
  privacy: 'privacy',
};

export default function LegalModal({ open, onClose, defaultTab = LEGAL_TABS.terms }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  const currentDoc = useMemo(() => {
    if (activeTab === LEGAL_TABS.privacy) {
      return {
        title: 'Privacy Policy',
        sections: PRIVACY_SECTIONS,
        route: '/privacy-policy',
      };
    }

    return {
      title: 'Terms & Conditions',
      sections: TERMS_SECTIONS,
      route: '/terms-conditions',
    };
  }, [activeTab]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative z-10 w-full max-w-4xl rounded-3xl border border-primary/30 bg-[#0d1311] p-4 md:p-6 shadow-2xl shadow-black/40"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-full border border-white/15 bg-black/20 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab(LEGAL_TABS.terms)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === LEGAL_TABS.terms
                      ? 'bg-primary text-black'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  Terms
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(LEGAL_TABS.privacy)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === LEGAL_TABS.privacy
                      ? 'bg-primary text-black'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  Privacy
                </button>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={currentDoc.route}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Open full page
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10"
                  aria-label="Close legal modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[72vh] overflow-y-auto pr-1">
              <LegalDocument title={currentDoc.title} sections={currentDoc.sections} compact />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
