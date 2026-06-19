import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, BedDouble, Bath, Ruler, LayoutGrid, Grid3X3, TrendingUp, Star, Shield, Award } from 'lucide-react';
import type { Property } from '@/types/property';
import { cardHoverLift, imageZoom, pricePulse, staggerFast } from '@/config/animations';

function formatPrice(p: Property['price']) {
  if (p == null || p === '') return 'Price on request';
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

const statusColors: Record<string, string> = {
  PUBLISHED: 'bg-emerald-500',
  SOLD: 'bg-red-500',
  RENTED: 'bg-amber-500',
  DRAFT: 'bg-gray-400',
};

const typeConfig: Record<string, { label: string; gradient: string; badgeBg: string }> = {
  flat: { label: 'Apartment', gradient: 'from-violet-600 to-indigo-700', badgeBg: 'bg-violet-500' },
  apartment: { label: 'Apartment', gradient: 'from-violet-600 to-indigo-700', badgeBg: 'bg-violet-500' },
  'independent house': { label: 'House', gradient: 'from-blue-600 to-cyan-600', badgeBg: 'bg-blue-500' },
  house: { label: 'House', gradient: 'from-blue-600 to-cyan-600', badgeBg: 'bg-blue-500' },
  villa: { label: 'Villa', gradient: 'from-blue-600 to-cyan-600', badgeBg: 'bg-blue-500' },
  plot: { label: 'Plot', gradient: 'from-emerald-600 to-teal-600', badgeBg: 'bg-emerald-500' },
  land: { label: 'Plot', gradient: 'from-emerald-600 to-teal-600', badgeBg: 'bg-emerald-500' },
  layout: { label: 'Layout', gradient: 'from-amber-600 to-orange-600', badgeBg: 'bg-amber-500' },
  development: { label: 'Development', gradient: 'from-amber-600 to-orange-600', badgeBg: 'bg-amber-500' },
};

function getPrimaryImage(property: Property): string | null {
  return property.media?.find((m) => m.type === 'image' || m.type.includes('image'))?.url
    ?? property.media?.[0]?.url
    ?? null;
}

function getGrowthRating(property: Property): { grade: string; score: number; label: string } {
  const type = (property.propertyType ?? '').toLowerCase();
  const isPlot = ['plot', 'land', 'layout', 'development'].some((t) => type.includes(t));
  const hasApproval = property.city?.includes('Edara') || property.city?.includes('Vijayawada') || (property.amenities ?? []).some((a) => a?.toLowerCase().includes('crda'));
  if (isPlot && hasApproval && property.featured) return { grade: 'A+', score: 95, label: 'Prime Investment' };
  if (isPlot && hasApproval) return { grade: 'A', score: 88, label: 'High Growth' };
  if (isPlot) return { grade: 'B+', score: 78, label: 'Steady Growth' };
  if (hasApproval) return { grade: 'A-', score: 82, label: 'Strong Potential' };
  return { grade: 'B', score: 70, label: 'Good Value' };
}

function getMediaCount(property: Property): { images: number; videos: number } {
  const media = property.media ?? [];
  return {
    images: media.filter((m) => m.type.includes('image')).length,
    videos: media.filter((m) => m.type === 'video' || m.type.includes('video')).length,
  };
}

function PropertyTypeBadge({ type }: { type: string }) {
  const key = type.toLowerCase().trim();
  const config = typeConfig[key] ?? { label: type, gradient: 'from-slate-600 to-slate-800', badgeBg: 'bg-slate-500' };
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg bg-gradient-to-r ${config.gradient} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg`}>
      <Building2 className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function PropertyCard({ property, index = 0 }: { property: Property; index?: number }) {
  const thumb = getPrimaryImage(property);
  const href = `/properties/${property.slug ?? property.id}`;
  const type = (property.propertyType ?? '').toLowerCase().trim();
  const isPlot = ['plot', 'land', 'layout', 'development'].some((t) => type.includes(t));
  const isFlat = ['flat', 'apartment'].some((t) => type.includes(t));
  const isHouse = ['house', 'villa', 'independent house', 'independent'].some((t) => type.includes(t));
  const statusColor = statusColors[property.status ?? ''] ?? 'bg-emerald-500';
  const growthRating = getGrowthRating(property);
  const { images, videos } = getMediaCount(property);

  return (
    <motion.article
      variants={staggerFast}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={index}
      whileHover={cardHoverLift}
      className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500"
    >
      <Link to={href} className="block">
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-[#0a2540]/10 to-[#0d9488]/10">
          {thumb ? (
            <motion.img
              src={thumb}
              alt={property.title}
              variants={imageZoom}
              initial="initial"
              whileHover="hover"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="h-12 w-12 text-slate-200" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {property.propertyType && <PropertyTypeBadge type={property.propertyType} />}
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#0a2540] to-[#0d2a4a] px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
              <Star className="h-2.5 w-2.5 fill-[#c6a43f] text-[#c6a43f]" />
              {growthRating.grade}
            </span>
          </div>

          {property.status && property.status !== 'DRAFT' && (
            <span className={`absolute right-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-md ${statusColor}`}>
              {property.status}
            </span>
          )}

          <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1.5">
            {isPlot && property.area ? (
              <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0a2540] shadow-sm">
                {property.area} {property.area >= 5 ? 'Acres' : 'Sq.Yards'}
              </span>
            ) : null}
            {isPlot && property.totalPlots ? (
              <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0a2540] shadow-sm">
                {property.totalPlots} Plots
              </span>
            ) : null}
            {isPlot && property.availableUnits ? (
              <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 shadow-sm">
                {property.availableUnits} Available
              </span>
            ) : null}
            {isFlat && property.bedrooms ? (
              <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0a2540] shadow-sm">
                {property.bedrooms} BHK
              </span>
            ) : null}
            {isHouse && property.bedrooms ? (
              <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-[#0a2540] shadow-sm">
                {property.bedrooms} Bed
              </span>
            ) : null}
            {!isPlot && property.area ? (
              <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                {property.area} Sq.Ft
              </span>
            ) : null}
          </div>

          {(images > 1 || videos > 0) && (
            <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
              {images > 1 && (
                <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {images} Photos
                </span>
              )}
              {videos > 0 && (
                <span className="rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {videos} Video{videos > 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}

          {property.price && property.price !== '' && (
            <div className="absolute -bottom-px left-0 right-0 z-10 px-3 pb-3">
              <motion.div
                variants={pricePulse}
                animate="animate"
                className="rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-3.5 py-3 shadow-lg"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5c4010]">Starting</p>
                <p className="text-lg font-bold text-[#081120]">{formatPrice(property.price)}</p>
              </motion.div>
            </div>
          )}
        </div>

        <div className="p-4 pt-5">
          <h3 className="font-serif text-2xl font-bold leading-snug text-[#0a2540] transition-colors group-hover:text-[#0d9488]">
            {property.title}
          </h3>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[#c6a43f]">Investment Venture</p>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {property.city}{property.locality ? `, ${property.locality}` : ''}
            </span>
          </div>

          {isPlot && (
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-emerald-50/50 p-3">
              {property.totalPlots && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <LayoutGrid className="h-3.5 w-3.5 text-emerald-500" />
                  <span><strong className="text-[#0a2540]">{property.totalPlots}</strong> Layouts</span>
                </div>
              )}
              {property.area && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Ruler className="h-3.5 w-3.5 text-emerald-500" />
                  <span><strong className="text-[#0a2540]">{property.area}</strong> {property.area >= 5 ? 'Acres' : 'Sq.Yards'}</span>
                </div>
              )}
              {property.availableUnits && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Grid3X3 className="h-3.5 w-3.5 text-emerald-500" />
                  <span><strong className="text-emerald-600">{property.availableUnits}</strong> Available</span>
                </div>
              )}
              {property.distanceToORR && (
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                  <span><strong className="text-[#0a2540]">{property.distanceToORR}</strong> to ORR</span>
                </div>
              )}
            </div>
          )}

          {(isFlat || isHouse) && (
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              {property.bedrooms && (
                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
                  <BedDouble className="h-3.5 w-3.5 text-[#0d9488]" /> {property.bedrooms} {isFlat ? 'BHK' : 'Beds'}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
                  <Bath className="h-3.5 w-3.5 text-[#0d9488]" /> {property.bathrooms}
                </span>
              )}
              {property.area && (
                <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1">
                  <Ruler className="h-3.5 w-3.5 text-[#0d9488]" /> {property.area} Sq.Ft
                </span>
              )}
            </div>
          )}

          {!isPlot && !isFlat && !isHouse && (
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                </span>
              )}
              {property.area && (
                <span className="flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" /> {property.area}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-[#0a2540]/5 px-2.5 py-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-semibold text-[#0a2540]">{growthRating.label}</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[#c6a43f]/10 px-2.5 py-1.5">
              <Award className="h-3.5 w-3.5 text-[#c6a43f]" />
              <span className="text-xs font-bold text-[#c6a43f]">{growthRating.score}</span>
            </div>
          </div>

          {!property.price || property.price === '' ? (
            <div className="mt-3 border-t border-slate-100 pt-3">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Price on request
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}
