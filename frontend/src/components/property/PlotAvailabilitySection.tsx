import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, TrendingUp, Compass, CornerDownRight, Store,
  TreePine, Clock, BadgeCheck, Ruler, MapPin, Building2,
  FileCheck, Shield, Map, Award, Star, Sun, BarChart3,
} from 'lucide-react';
import CountUp from 'react-countup';
import { usePlots, usePlotSummary } from '@/features/properties/hooks/useProperties';
import { PlotLayoutView } from './PlotLayoutView';
import { PlotDetailPopup } from './PlotDetailPopup';
import { fadeUp, staggerContainer, fadeIn } from '@/config/animations';
import type { Property } from '@/types/property';

const FACING_LABELS: Record<string, string> = {
  EAST: 'East Facing', WEST: 'West Facing', NORTH: 'North Facing', SOUTH: 'South Facing',
};

interface Props {
  propertyId: string;
  property?: Property;
}

function formatPrice(p: Property['price']): string {
  if (p == null || p === '') return '—';
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  if (n >= 1e7) return `\u20B9${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `\u20B9${(n / 1e5).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function PlotAvailabilitySection({ propertyId, property }: Props) {
  const { data: plots = [] } = usePlots(propertyId);
  const { data: summary } = usePlotSummary(propertyId);
  const [viewMode, setViewMode] = useState<'cards' | 'layout'>('cards');

  if (!plots.length && !summary) return null;

  const total = summary?.total ?? 1;
  const available = summary?.available ?? 0;
  const sold = summary?.sold ?? 0;
  const reserved = summary?.reserved ?? 0;

  const availablePct = Math.round((available / total) * 100);
  const soldPct = Math.round((sold / total) * 100);
  const reservedPct = Math.round((reserved / total) * 100);

  const facingData = summary?.facingDistribution ? Object.entries(summary.facingDistribution) : [];

  const approvalStatus = property?.amenities?.includes('CRDA Approved')
    ? 'CRDA Approved'
    : property?.amenities?.[0] || 'CRDA Approved';

  const formatFacing = (f: string) => f.charAt(0) + f.slice(1).toLowerCase();

  return (
    <motion.section
      id="plot-availability"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeIn}
      className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />
        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <motion.div variants={staggerContainer} className="mb-12 text-center">
          <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
            <BarChart3 className="-mt-0.5 mr-1.5 inline h-4 w-4" /> Project Intelligence Dashboard
          </motion.span>
          <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0A1931] lg:text-4xl">
            Live Plot Availability
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-gray-500">
            Real-time plot status, facing distribution, and availability overview
          </motion.p>
        </motion.div>

        {/* ── Donut Chart + Legend ── */}
        <motion.div variants={fadeUp} className="mb-10 flex flex-col items-center">
          <div className="relative h-56 w-56 lg:h-64 lg:w-64">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
              {availablePct > 0 && (
                <circle cx="18" cy="18" r="15" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray={`${availablePct} ${100 - availablePct}`} strokeLinecap="round" />
              )}
              {soldPct > 0 && (
                <circle cx="18" cy="18" r="11.5" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray={`${soldPct} ${100 - soldPct}`} strokeLinecap="round" />
              )}
              {reservedPct > 0 && (
                <circle cx="18" cy="18" r="8" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray={`${reservedPct} ${100 - reservedPct}`} strokeLinecap="round" />
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-[#0A1931]">
                <CountUp start={0} end={available} duration={2} />
              </span>
              <span className="text-sm font-medium text-slate-400">Available</span>
            </div>
          </div>
          <div className="mt-4 flex gap-6">
            <span className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Available ({available})</span>
            <span className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded-full bg-red-500" /> Sold ({sold})</span>
            <span className="flex items-center gap-2 text-sm"><span className="h-3 w-3 rounded-full bg-orange-400" /> Reserved ({reserved})</span>
          </div>
        </motion.div>

        {/* ── 3-Column Info Cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10 grid gap-5 md:grid-cols-3"
        >
          {/* Column 1 — Plot Statistics */}
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#D4AF37]/20 hover:shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-[#0A1931]">Plot Statistics</h3>
            </div>
            <div className="space-y-3">
              <StatRow label="Total Plots" value={total} color="text-blue-600" />
              <StatRow label="Available Plots" value={available} color="text-emerald-600" />
              <StatRow label="Sold Plots" value={sold} color="text-red-600" />
              <StatRow label="Reserved Plots" value={reserved} color="text-orange-600" />
            </div>
          </motion.div>

          {/* Column 2 — Property Information */}
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#D4AF37]/20 hover:shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-[#0A1931]">Property Information</h3>
            </div>
            <div className="space-y-3">
              <TextRow label="Project Name" value={property?.title || '—'} />
              <TextRow label="Property Type" value={property?.propertyType || '—'} />
              <TextRow label="Approval Status" value={approvalStatus} />
              <TextRow label="Development Status" value={property?.possessionStatus || '—'} />
            </div>
          </motion.div>

          {/* Column 3 — Investment Information */}
          <motion.div variants={fadeUp} whileHover={{ y: -4 }} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#D4AF37]/20 hover:shadow-lg">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-sm font-bold text-[#0A1931]">Investment Information</h3>
            </div>
            <div className="space-y-3">
              <TextRow label="Price Per Sq.Yd" value={property?.price ? formatPrice(property.price) : '—'} />
              <TextRow label="Expected ROI" value={property?.expectedROI || '—'} />
              <TextRow label="Distance to ORR" value={property?.distanceToORR || '—'} />
              <TextRow label="Total Investment Value" value={property?.price && total ? formatPrice(Number(property.price) * total) : '—'} />
            </div>
          </motion.div>
        </motion.div>

        {/* ── Project Overview ── */}
        <motion.div variants={fadeUp} className="mb-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-5 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold text-[#0A1931]">Project Overview</h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-500">Description</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{property?.description || 'No description available.'}</p>
              {property?.amenities && property.amenities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-500">Amenities</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {property.amenities.map((a) => (
                      <span key={a} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Key Highlights</p>
              <ul className="mt-2 space-y-2">
                {[
                  property?.distanceToORR ? `Located just ${property.distanceToORR} from ORR` : null,
                  approvalStatus,
                  property?.totalPlots ? `${property.totalPlots} total plots` : null,
                  property?.internalRoadWidth ? `${property.internalRoadWidth} wide roads` : null,
                ].filter(Boolean).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <Star className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-slate-500">Location Benefits</p>
              <ul className="mt-2 space-y-1">
                {[
                  property?.city ? `Prime location in ${property.city}` : null,
                  property?.district ? `${property.district} District` : null,
                  property?.landmark ? `Near ${property.landmark}` : null,
                ].filter(Boolean).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* ── Facing Distribution ── */}
        <motion.div variants={fadeUp} className="mb-10 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-5 flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold text-[#0A1931]">Facing Distribution</h3>
          </div>
          <div className="space-y-4">
            {facingData.length > 0 ? facingData.map(([facing, count]) => {
              const pct = Math.round((count / total) * 100);
              const icons: Record<string, React.ElementType> = {
                EAST: Sun,
                WEST: Map,
                NORTH: TreePine,
                SOUTH: Map,
              };
              const Icon = icons[facing] || Compass;
              return (
                <div key={facing}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <Icon className="h-4 w-4 text-[#D4AF37]" />
                      {FACING_LABELS[facing] || formatFacing(facing)}
                    </span>
                    <span className="text-xs text-slate-400">{count} plots ({pct}%)</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5C84C]"
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-slate-400">No facing data available</p>
            )}
          </div>
        </motion.div>

        {/* ── Layout View ── */}
        <motion.div variants={fadeUp}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-base font-bold text-[#0A1931]">Plot Layout</h3>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'layout' : 'cards')}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
            >
              {viewMode === 'cards' ? 'Show Layout' : 'Show Cards'}
            </button>
          </div>
          {viewMode === 'layout' ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:p-6">
              <PlotLayoutView plots={plots} />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plots.slice(0, 18).map((plot) => (
                <PlotCard key={plot.id} plot={plot} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-bold ${color}`}>
        <CountUp start={0} end={value} duration={2} />
      </span>
    </div>
  );
}

function TextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-[#0A1931]">{value}</span>
    </div>
  );
}

function PlotCard({ plot }: { plot: import('@/types/property').Plot }) {
  const [open, setOpen] = useState(false);
  const statusColors: Record<string, string> = {
    AVAILABLE: 'border-emerald-400 bg-emerald-50',
    SOLD: 'border-red-300 bg-red-50',
    RESERVED: 'border-orange-300 bg-orange-50',
  };
  const statusText: Record<string, string> = {
    AVAILABLE: 'text-emerald-600',
    SOLD: 'text-red-600',
    RESERVED: 'text-orange-600',
  };
  return (
    <>
      <motion.button
        variants={fadeUp}
        whileHover={{ y: -3, scale: 1.02 }}
        onClick={() => setOpen(true)}
        className={`group rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${statusColors[plot.status] || 'border-slate-200 bg-white'}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#0A1931]">#{plot.plotNumber}</span>
          <span className={`text-[10px] font-semibold ${statusText[plot.status] || 'text-slate-500'}`}>
            {plot.status === 'AVAILABLE' ? 'Available' : plot.status === 'SOLD' ? 'Sold' : 'Reserved'}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
          <span>{plot.sizeSqYds} Sq.Yds</span>
          <span>·</span>
          <span>{plot.facing.charAt(0) + plot.facing.slice(1).toLowerCase()}</span>
        </div>
      </motion.button>
      {open && <PlotDetailPopup plot={plot} onClose={() => setOpen(false)} />}
    </>
  );
}
