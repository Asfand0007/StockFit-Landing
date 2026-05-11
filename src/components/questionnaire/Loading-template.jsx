import { motion } from 'framer-motion';
import Navbar from '../global/Navbar';

// Added 'mode' prop to handle different states
export default function LoadingTemplate({ mode = 'fetch' }) {
  
  const content = {
    fetch: {
      title: "Loading questionnaire...",
      subtitle: "Preparing your experience"
    },
    submit: {
      title: "Submitting your answers...",
      subtitle: "Please don't close this window"
    }
  };

  const activeContent = content[mode] || content.fetch;

  return (
    <div className="min-h-screen w-full font-montserrat bg-[#0a0c0b] text-white overflow-hidden">
      <Navbar />
      <div className="relative pt-28 px-6 pb-16 max-w-5xl mx-auto">
        <div className="absolute -right-[14%] -top-[16%] h-105 w-105 rounded-full bg-primary opacity-15 blur-[150px] pointer-events-none" />
        <div className="absolute -left-[12%] bottom-[10%] h-90 w-90 rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-3xl rounded-[28px] border border-primary/20 bg-secondary/40 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/20"
        >
          <div className="text-center space-y-2">
            <p className="text-xl font-medium text-white">{activeContent.title}</p>
            <p className="text-white/50 text-sm font-light">{activeContent.subtitle}</p>
            
            {/* Optional: Add a simple CSS spinner for better UX */}
            <div className="mt-6 flex justify-center">
              <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}