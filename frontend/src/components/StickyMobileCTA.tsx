import { motion } from 'framer-motion';
import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { stickyCTA } from '@/config/animations';

type StickyCTAProps = {
  phoneNumber?: string;
  whatsappNumber?: string;
  onSiteVisit?: () => void;
};

export function StickyMobileCTA({ phoneNumber = '+917659926345', whatsappNumber = '+917659926345', onSiteVisit }: StickyCTAProps) {
  return (
    <motion.div
      variants={stickyCTA}
      initial="initial"
      animate="animate"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_20px_-4px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden"
    >
      <div className="flex items-center gap-2">
        <a
          href={`tel:${phoneNumber}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-[#0a2540] transition-colors hover:bg-slate-50"
        >
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </a>
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={onSiteVisit}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] py-3 text-sm font-bold text-[#020617] shadow-md transition-all hover:shadow-lg"
        >
          <Calendar className="h-4 w-4" />
          <span>Visit</span>
        </button>
      </div>
    </motion.div>
  );
}
