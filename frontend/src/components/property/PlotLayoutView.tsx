import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3, Home } from 'lucide-react';
import type { Plot } from '@/types/property';
import { PlotDetailPopup } from './PlotDetailPopup';

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-emerald-500 hover:bg-emerald-400 border-emerald-400',
  SOLD: 'bg-red-500 hover:bg-red-400 border-red-400',
  RESERVED: 'bg-orange-400 hover:bg-orange-300 border-orange-300',
};

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Available',
  SOLD: 'Sold',
  RESERVED: 'Reserved',
};

interface Props {
  plots: Plot[];
}

export function PlotLayoutView({ plots }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  const sorted = useMemo(() => {
    return [...plots].sort((a, b) => {
      const aNum = parseInt(a.plotNumber.replace(/[^0-9]/g, '')) || 0;
      const bNum = parseInt(b.plotNumber.replace(/[^0-9]/g, '')) || 0;
      return aNum - bNum;
    });
  }, [plots]);

  if (!plots.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
        <Grid3X3 className="h-12 w-12 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-400">No plots added yet</p>
        <p className="text-xs text-slate-300">Add plots from the admin panel to see the layout</p>
      </div>
    );
  }

  return (
    <>
      {/* Legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500" /> Available ({plots.filter((p) => p.status === 'AVAILABLE').length})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-500" /> Sold ({plots.filter((p) => p.status === 'SOLD').length})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-orange-400" /> Reserved ({plots.filter((p) => p.status === 'RESERVED').length})
        </span>
      </div>

      {/* Layout Grid — responsive columns */}
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {sorted.map((plot, idx) => (
          <motion.button
            key={plot.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.02 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlot(plot)}
            className={`group relative flex flex-col items-center justify-center rounded-lg border-2 p-2 text-white shadow-sm transition-all ${STATUS_COLORS[plot.status] || 'bg-slate-400'}`}
          >
            <Home className="h-3 w-3 opacity-70 lg:h-4 lg:w-4" />
            <span className="mt-0.5 text-[8px] font-bold leading-tight lg:text-[10px]">
              {plot.plotNumber}
            </span>
            {/* Corner indicator */}
            {plot.isCorner && (
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-yellow-300 ring-1 ring-white" />
            )}
            {/* Hover tooltip */}
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              #{plot.plotNumber} · {plot.sizeSqYds} sq.yd · {STATUS_LABELS[plot.status]}
            </div>
          </motion.button>
        ))}
      </div>

      <PlotDetailPopup plot={selectedPlot} onClose={() => setSelectedPlot(null)} />
    </>
  );
}
