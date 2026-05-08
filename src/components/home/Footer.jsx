import { motion } from 'framer-motion';
import Contact from './footer/Contact';
import { teamMembers, supervisor } from './footer/data';

export default function Footer({ animateIn = true }) {
  const footerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const footerItem = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.58,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.footer
      className="w-full bg-secondary-dark text-white py-16 md:py-20 font-montserrat"
      id="contact-us"
      data-section="contact-us"
      variants={footerContainer}
      initial="hidden"
      animate={animateIn ? "show" : "hidden"}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div variants={footerItem} className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <img src="assests/Stockfit-logo.png" alt="StockFit Logo" className="h-8 w-8" />
            <h3 className="text-2xl md:text-3xl font-bold text-primary">Stock Fit</h3>
          </div>
          <p className="text-gray-300 text-sm md:text-base max-w-md">
            Empowering investors with intelligent portfolio management and market insights.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12 md:mb-16">
          {/* Team Header */}
          <div id="contact-us" className="col-span-1 md:col-span-3 scroll-mt-28">
            <h4 className="text-lg font-semibold text-primary mb-8">Team</h4>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex-1">
                  <Contact member={member} footerItem={footerItem} />
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 md:w-1/3">
                <Contact member={supervisor} footerItem={footerItem} />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-secondary mb-8"></div>

        {/* Bottom */}
        <motion.div
          variants={footerItem}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400"
        >
          <p>&copy; 2024 Stock Fit. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
