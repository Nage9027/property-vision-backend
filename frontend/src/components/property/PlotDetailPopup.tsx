import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Compass, Ruler, MapPin, BadgeCheck, CornerDownRight, Store, TreePine } from 'lucide-react';
import type { Plot } from '@/types/property';

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  AVAILABLE: { label: 'Available', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  SOLD: { label: 'Sold', bg: 'bg-red-50', text: 'text-red-600' },
  RESERVED: { label: 'Reserved', bg: 'bg-orange-50', text: 'text-orange-600' },
};

const FACING_ICONS: Record<string, string> = {
  EAST: 'E', WEST: 'W', NORTH: 'N', SOUTH: 'S',
};

interface Props {
  plot: Plot | null;
  onClose: () => void;
}

export function PlotDetailPopup({ plot, onClose }: Props) {
  if (!plot) return null;
  const statusStyle = STATUS_STYLES[plot.status] || STATUS_STYLES.AVAILABLE;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl lg:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37]">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A1931]">Plot No: {plot.plotNumber}</h3>
              <span className={`inline-block mt-0.5 rounded-full px-3 py-0.5 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                {statusStyle.label}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <DetailItem icon={<Compass className="h-4 w-4" />} label="Facing" value={
              <span className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A1931] text-[10px] font-bold text-white">
                  {FACING_ICONS[plot.facing] || plot.facing[0]}
                </span>
                {plot.facing.charAt(0) + plot.facing.slice(1).toLowerCase()}
              </span>
            } />
            <DetailItem icon={<Ruler className="h-4 w-4" />} label="Plot Size" value={`${plot.sizeSqYds} Sq.Yds`} />
            {plot.roadWidth && <DetailItem icon={<MapPin className="h-4 w-4" />} label="Road Width" value={plot.roadWidth} />}
            {plot.pricePerSqYd && <DetailItem icon={<BadgeCheck className="h-4 w-4" />} label="Price" value={`₹${Number(plot.pricePerSqYd).toLocaleString('en-IN')}/Sq.Yd`} />}
            {plot.isCorner && <DetailItem icon={<CornerDownRight className="h-4 w-4" />} label="Type" value="Corner Plot" />}
            {plot.isCommercialFacing && <DetailItem icon={<Store className="h-4 w-4" />} label="Type" value="Commercial Facing" />}
            {plot.isParkFacing && <DetailItem icon={<TreePine className="h-4 w-4" />} label="Type" value="Park Facing" />}
          </div>

          {plot.features && (
            <div className="mt-4 rounded-xl bg-[#f8fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Special Features</p>
              <p className="mt-1 text-sm text-slate-700">{plot.features}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a href="#contact" className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C84C] py-2.5 text-center text-xs font-bold text-[#0A1931] transition-all hover:shadow-lg">
              Enquire Now
            </a>
            <button onClick={onClose} className="rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-50">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#f8fafc] p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#0A1931]">{value}</div>
    </div>
  );
}
