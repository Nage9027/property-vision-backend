import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const PHONE = '+917659926345';
const WHATSAPP_URL = `https://wa.me/${PHONE.replace(/[^0-9]/g, '')}?text=Hi%20I%27m%20interested%20in%20your%20property.%20Please%20share%20more%20details.`;

export function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-lg shadow-[#25D366]/30"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 40px rgba(37,211,102,0.5)' }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </motion.div>
    </motion.a>
  );
}
