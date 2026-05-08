import { Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact({ member, footerItem }) {
  return (
    <motion.div variants={footerItem} className="border-l-2 border-primary pl-4">
      <h5 className="text-white font-semibold mb-1">{member.name}</h5>
      <p className="text-gray-400 text-xs mb-3">{member.title}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-primary flex-shrink-0" />
          <a href={`mailto:${member.email}`} className="text-gray-300 text-sm hover:text-primary transition-colors">
            {member.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-primary flex-shrink-0" />
          <a href={`tel:${member.phone}`} className="text-gray-300 text-sm hover:text-primary transition-colors">
            {member.phone}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
