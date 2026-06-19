import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Building2, Ruler, MapPin, Phone, MessageCircle,
  ChevronRight, ChevronLeft, Play, Download, Share2,
  Shield, Globe, Clock, TrendingUp, Sparkles,
  ZoomIn, Maximize, Heart, CheckCircle2, ChevronDown, Menu, X, ExternalLink,
  Star, Award, Users, Quote, Search, Mail, Camera, Video,
  Map, Droplets, Wifi, Lock, HeadphonesIcon,
  ArrowRight, ChevronUp,   Calendar, BarChart3, LucideProps,
} from 'lucide-react';
import {
  fadeUp, fadeIn, staggerContainer, staggerFast, accordionContent, iconRotate,
} from '@/config/animations';
import { AppLayout } from '@/layouts/AppLayout';
import { useProperty, useProperties, usePlotSummary } from '@/features/properties/hooks/useProperties';
import type { Property } from '@/types/property';
import { PropertyStickyNav } from '@/components/PropertyStickyNav';
import { PlotAvailabilitySection } from '@/components/property/PlotAvailabilitySection';

// ============================================================
// HELPERS
// ============================================================
function formatPrice(p: Property['price']): string {
  if (p == null || p === '') return '—';
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

function safePrice(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  const cleaned = typeof value === 'string' ? value.replace(/[^0-9.]/g, '') : String(value);
  const n = parseFloat(cleaned);
  if (isNaN(n)) return String(value);
  return `₹${n.toLocaleString('en-IN')}`;
}

// A map for icon components (used in investment benefits)
const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Building2,
  Globe,
  Shield,
  MapPin,
  Users,
  Clock,
  Award,
  Star,
  CheckCircle2,
};

// ============================================================
// TYPES FOR DYNAMIC FIELDS
// ============================================================
interface InvestmentBenefit {
  icon?: keyof typeof iconMap;
  value?: string;
  label?: string;
  sub?: string;
}

interface LocationAdvantage {
  icon?: string;
  title?: string;
  distance?: string;
  dist?: string;
  desc?: string;
  description?: string;
}

interface Testimonial {
  name?: string;
  location?: string;
  type?: string;
  year?: string;
  rating?: number;
  text?: string;
}

interface FAQ {
  q?: string;
  a?: string;
}

interface SiteVisitBenefit {
  icon?: string;
  text?: string;
}

interface ContactInformation {
  phone?: string[];
  email?: string;
  address?: string;
  hours?: string;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id);
  const { data: allProperties = [] } = useProperties();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [galleryTab, setGalleryTab] = useState<'photos' | 'video' | 'plan' | 'drone'>('photos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  // --- Dynamic Data from Property ---
  const { data: plotSummary } = usePlotSummary(property?.id || id);
  const totalPlots = plotSummary?.total ?? (property?.totalPlots ? Number(property.totalPlots) : 0);
  const soldPlots = plotSummary?.sold ?? 0;
  const availablePlots = totalPlots - soldPlots;
  const reservedPlots = plotSummary?.reserved ?? 0;

  // --- Loading & Error States ---
  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white px-4 py-32 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto h-8 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="mx-auto mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="mt-8 h-64 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (isError || !property) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center bg-white px-4">
          <div className="text-center">
            <Building2 className="mx-auto h-16 w-16 text-slate-200" />
            <h1 className="mt-4 font-serif text-3xl font-bold text-[#0a2540]">Property Not Found</h1>
            <p className="mt-2 text-gray-500">The property you're looking for doesn't exist or has been removed.</p>
            <Link to="/properties" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c6a43f] px-6 py-3 text-sm font-bold text-[#020617]">
              <ArrowLeft className="h-4 w-4" /> Back to Properties
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  // --- Extract media ---
  const images = property.media?.filter((m) => m.type === 'image' || m.type.includes('image')) ?? [];
  const videos = property.media?.filter((m) => m.type === 'video' || m.type.includes('video')) ?? [];
  const allMedia = property.media ?? [];
  const thumb = images[0]?.url ?? property.media?.[0]?.url ?? '';
  const type = (property.propertyType ?? '').toLowerCase().trim();
  const isPlot = ['plot', 'land', 'layout', 'development'].some((t) => type.includes(t));
  const similar = allProperties.filter((p) => p.id !== property.id && p.city === property.city).slice(0, 3);

  const highlights = [
    { icon: Building2, value: totalPlots, label: 'Total Plots', cardColor: 'text-blue-600' },
    { icon: Ruler, value: availablePlots, label: 'Available', cardColor: 'text-emerald-600' },
    { icon: Building2, value: soldPlots, label: 'Sold', cardColor: 'text-red-600' },
    { icon: MapPin, value: property.distanceToORR ?? '—', label: 'Distance to ORR', cardColor: 'text-slate-500' },
    { icon: Shield, value: property.internalRoadWidth || '33 Ft', label: 'Road Width', cardColor: 'text-[#D4AF37]' },
    { icon: Award, value: property.status === 'PUBLISHED' ? 'Active' : '—', label: 'Status', cardColor: 'text-emerald-600' },
  ];

  const invBenefits = (property.investmentBenefits as InvestmentBenefit[]) ?? [];
  const locAdvantages = (property.locationAdvantages as LocationAdvantage[]) ?? [];
  const testimonialList = (property.testimonials as Testimonial[]) ?? [];
  const faqList = (property.faqs as FAQ[]) ?? [];
  const siteVisitBenefitsList = (property.siteVisitBenefits as SiteVisitBenefit[]) ?? [];
  const contactInfo = property.contactInformation as ContactInformation | null | undefined;

  // Investment Overview dynamic object
  const invOverview = property.investmentOverview as { heading?: string; description?: string; highlights?: string[] } | null | undefined;

  // Gallery items based on tab
  const galleryItems =
    galleryTab === 'photos' ? images :
    galleryTab === 'video' ? videos :
    galleryTab === 'plan' ? images.slice(0, 3) :
    images.slice(0, 3);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <AppLayout>
      <article className="bg-white pb-24">
        {/* ──────────────────────────────────────────────────────
            SECTION 1 — CENTERED CINEMATIC HERO (Homepage Style)
        ────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative min-h-screen overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A1931] via-[#102542] to-[#0A1931]" />
            {thumb ? (
              <img src={thumb} alt={property.title} className="h-full w-full object-cover opacity-60" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1931]/95 via-[#0A1931]/80 to-[#0A1931]/50" />
          </div>

          {/* Decorative glows */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-0 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[180px]" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#F5C84C]/[0.03] blur-[150px]" />
          </div>

          {/* Back button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="absolute left-6 top-6 z-20 lg:left-10 lg:top-10">
            <Link to="/properties" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
          </motion.div>

          {/* ── Premium Hero Content ── */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: heroOpacity as unknown as number }}>
            <div className="mx-auto w-full max-w-[1200px] px-6 text-center">
              <div className="flex flex-col items-center justify-center">
                {/* 1. Status + Badge Row */}
                <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold text-[#D4AF37]">
                    <Award className="h-3.5 w-3.5" />
                    {property.status === 'PUBLISHED' ? 'Active' : property.status}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                    <Shield className="h-3.5 w-3.5" />
                    CRDA Approved
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    RERA Verified
                  </span>
                </motion.div>

                {/* 2. Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-5 font-serif font-bold leading-[0.95] text-white"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', maxWidth: '900px' }}
                >
                  {property.title}
                </motion.h1>

                {/* 3. Location + Price */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                  className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-base text-white/70 lg:text-lg"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {[property.city, property.locality, property.district, property.state].filter(Boolean).join(', ')}
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    {formatPrice(property.price)}{property.priceUnit ? ` / ${property.priceUnit}` : ''}
                  </span>
                </motion.div>

                {/* 4. Trust Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-5 flex flex-wrap justify-center gap-2"
                >
                  {['CRDA Approved', 'DTCP Approved', 'Clear Title', 'Bank Loan Available'].map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      {badge}
                    </span>
                  ))}
                </motion.div>

                {/* 5. Premium CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="mt-6 flex flex-wrap justify-center gap-3"
                >
                  <a href="#gallery">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] px-6 py-3 text-sm font-bold text-[#0A1931] shadow-lg transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    >
                      <span className="relative z-10 flex items-center gap-2"><Map className="h-4 w-4" /> View Master Plan</span>
                      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </motion.button>
                  </a>
                  <a href={`tel:${property.phoneNumber || '+917659926345'}`}>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> Call Now</span>
                    </motion.button>
                  </a>
                  <a href={`https://wa.me/${(property.whatsappNumber || '917659926345').replace(/[^0-9]/g, '')}?text=Hi%2C%20I'm%20interested%20in%20${encodeURIComponent(property.title)}`} target="_blank" rel="noopener noreferrer">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-300 backdrop-blur-sm transition-all hover:bg-emerald-500/20"
                    >
                      <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</span>
                    </motion.button>
                  </a>
                  <a href="#contact">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Schedule Site Visit</span>
                    </motion.button>
                  </a>
                </motion.div>

                {/* 6. Project Highlights Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
                >
                  {[
                    { label: 'Available Plots', value: String(availablePlots), icon: Building2 },
                    { label: 'Road Width', value: property.internalRoadWidth || '33 Ft', icon: Ruler },
                    { label: 'Facing', value: 'East/West', icon: Map },
                    { label: 'Project Area', value: property.totalPlots ? `${property.totalPlots} Plots` : '—', icon: Building2 },
                    { label: 'Distance to ORR', value: property.distanceToORR || '—', icon: MapPin },
                    { label: 'Approval', value: 'CRDA/DTCP', icon: Shield },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-lg">
                        <Icon className="mx-auto h-4 w-4 text-[#D4AF37]" />
                        <p className="mt-1 text-sm font-bold text-white">{item.value}</p>
                        <p className="text-[10px] text-white/50">{item.label}</p>
                      </div>
                    );
                  })}
                </motion.div>

                {/* 7. Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 }}
                  className="mt-4 flex flex-wrap justify-center gap-4"
                >
                  {[
                    { label: 'Total Plots', value: String(totalPlots) },
                    { label: 'Available', value: String(availablePlots) },
                    { label: 'Sold', value: String(soldPlots) },
                    { label: 'Project Size', value: property.totalPlots ? `${property.totalPlots} Units` : '—' },
                  ].map((stat) => (
                    <span key={stat.label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 backdrop-blur-md">
                      <span className="font-semibold text-white">{stat.value}</span>
                      {stat.label}
                    </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-1">
              <span className="text-xs uppercase tracking-[0.2em] text-white/20">Scroll</span>
              <ChevronDown className="h-4 w-4 text-white/20" />
            </motion.div>
          </motion.div>
        </section>

        <PropertyStickyNav />

        {/* ──────────────────────────────────────────────────────
            SECTION 2 — INVESTMENT OVERVIEW (Premium ROI Cards)
        ────────────────────────────────────────────────────── */}
        {(invOverview || invBenefits.length > 0 || property.expectedROI) && (
          <motion.section
            id="overview"
            whileInView="visible"
            variants={fadeIn}
            className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white py-16 lg:py-24"
          >
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-40 top-1/2 h-[500px] w-[500px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />
              <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div variants={staggerContainer} className="mb-12 text-center">
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
                  Investment Overview
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0A1931] lg:text-4xl">
                  {invOverview?.heading || 'Why Invest Here?'}
                </motion.h2>
              </motion.div>

              {/* Premium ROI Cards Grid */}
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {/* Expected ROI — Premium Card */}
                {property.expectedROI && (
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="group relative col-span-1 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-[#D4AF37]/20 hover:shadow-xl lg:p-8 xl:col-span-1"
                  >
                    {/* Gold accent bar */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#F5C84C] to-[#D4AF37] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 shadow-inner">
                        <TrendingUp className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Expected ROI</p>
                        <p className="mt-1 text-3xl font-bold text-[#0A1931]">{property.expectedROI}</p>
                        {/* Mini bar chart visual */}
                        <div className="mt-3 flex items-end gap-1">
                          <div className="h-6 w-2 rounded-t bg-emerald-200" />
                          <div className="h-8 w-2 rounded-t bg-emerald-300" />
                          <div className="h-10 w-2 rounded-t bg-emerald-400" />
                          <div className="h-12 w-2 rounded-t bg-emerald-500" />
                          <div className="h-14 w-2 rounded-t bg-gradient-to-t from-[#D4AF37] to-[#F5C84C]" />
                        </div>
                      </div>
                    </div>
                    {invOverview?.description && (
                      <p className="mt-4 text-sm leading-relaxed text-gray-600">{invOverview.description}</p>
                    )}
                    {invOverview?.highlights && invOverview.highlights.length > 0 && (
                      <ul className="mt-4 space-y-2">
                        {invOverview.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}

                {/* Appreciation Potential */}
                {property.expectedROI && (
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-[#D4AF37]/20 hover:shadow-xl lg:p-8"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-inner">
                        <BarChart3 className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Total Plots</p>
                        <p className="mt-1 text-3xl font-bold text-[#0A1931]">{totalPlots}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {availablePlots} Available
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            {soldPlots} Sold
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                            {reservedPlots} Reserved
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Facing Distribution */}
                {property.expectedROI && (
                  <motion.div
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-[#D4AF37]/20 hover:shadow-xl lg:p-8"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 shadow-inner">
                        <Map className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">Facing Distribution</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {['EAST', 'WEST', 'NORTH', 'SOUTH'].map((f) => {
                            const count = plotSummary?.facingDistribution?.[f] ?? 0;
                            return (
                              <div key={f} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                                <span className="text-xs font-medium text-slate-500">{f.charAt(0) + f.slice(1).toLowerCase()}</span>
                                <span className="text-sm font-bold text-[#0A1931]">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Investment Benefits Grid */}
              {invBenefits.length > 0 && (
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {invBenefits.map((item) => {
                    const Icon = item.icon && iconMap[item.icon] ? iconMap[item.icon] : TrendingUp;
                    return (
                      <motion.div
                        key={item.label || Math.random().toString()}
                        variants={fadeUp}
                        whileHover={{ y: -3 }}
                        className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#D4AF37]/20 hover:shadow-md"
                      >
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-bold text-[#0A1931]">{item.value}</p>
                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                        {item.sub && <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* ──────────────────────────────────────────────────────
            SECTION 3 — PROPERTY HIGHLIGHTS (Glassmorphism)
        ────────────────────────────────────────────────────── */}
        <section id="gallery" className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* Section Header */}
            <motion.div
              whileInView="visible"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
                Property Highlights
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0A1931] lg:text-4xl">
                Key Metrics at a Glance
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-gray-500">
                Everything you need to know about this premium property development
              </motion.p>
            </motion.div>

            {/* Glassmorphism Highlights Grid */}
            <motion.div
              whileInView="visible"
              variants={staggerContainer}
              className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <motion.div
                    key={h.label}
                    variants={fadeUp}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 p-6 shadow-lg shadow-black/[0.03] backdrop-blur-xl transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/10"
                  >
                    {/* Glass shine overlay */}
                    <div className="pointer-events-none absolute -inset-40 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                    {/* Gold accent top */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#D4AF37] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${h.cardColor}`}>{String(h.value)}</p>
                        <p className="text-sm font-medium text-gray-500">{h.label}</p>
                      </div>
                    </div>

                    {/* Bottom-right decorative glow */}
                    <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#D4AF37]/10 blur-2xl transition-all duration-500 group-hover:bg-[#D4AF37]/20 group-hover:blur-3xl" />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* ── Premium Gallery ── */}
            <div className="mt-20">
              <motion.div
                whileInView="visible"
                variants={staggerContainer}
                className="mb-8 text-center"
              >
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
                  Gallery
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-2 mt-4 font-serif text-2xl font-bold text-[#0A1931] lg:text-3xl">
                  Project Gallery
                </motion.h2>
              </motion.div>

              {/* Gallery Tab Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide"
              >
                {[
                  { key: 'photos', label: 'Photos', icon: Camera },
                  { key: 'video', label: 'Videos', icon: Video },
                  { key: 'plan', label: 'Master Plan', icon: Map },
                  { key: 'drone', label: 'Drone Views', icon: Camera },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setGalleryTab(tab.key as typeof galleryTab)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                        galleryTab === tab.key
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" /> {tab.label}
                    </button>
                  );
                })}
              </motion.div>

              {/* Gallery Grid — Featured + Thumbnails */}
              {galleryItems.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-3">
                  {/* Featured Image (spans 2 cols on desktop) */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
                    className="group relative col-span-2 overflow-hidden rounded-2xl bg-slate-100 shadow-lg"
                  >
                    <div className="aspect-[16/10] lg:aspect-auto lg:h-full">
                      <img
                        src={galleryItems[0].url}
                        alt=""
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white/90 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <ZoomIn className="mr-1 inline h-3.5 w-3.5" /> View
                      </div>
                    </div>
                    {galleryItems[0].type.includes('video') && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                          <Play className="h-6 w-6 pl-0.5 text-[#0A1931]" />
                        </div>
                      </div>
                    )}
                  </motion.button>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {galleryItems.slice(1, 5).map((media, idx) => {
                      const isVideo = media.type === 'video' || media.type.includes('video');
                      return (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.08 }}
                          onClick={() => { setLightboxIndex(idx + 1); setLightboxOpen(true); }}
                          className="group relative overflow-hidden rounded-xl bg-slate-100 shadow-sm"
                        >
                          <div className="aspect-[4/3]">
                            <img
                              src={media.url}
                              alt=""
                              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>
                          {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
                                <Play className="h-4 w-4 pl-0.5 text-[#0A1931]" />
                              </div>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Image Counter */}
              {galleryItems.length > 0 && (
                <div className="mt-4 text-center text-sm text-gray-400">
                  {galleryItems.length} {galleryItems.length === 1 ? 'image' : 'images'} available
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────
            SECTION 4 — LOCATION ADVANTAGES (Aparna Style)
        ────────────────────────────────────────────────────── */}
        {(locAdvantages.length > 0 || true) && (
          <motion.section
            id="location"
            whileInView="visible"
            variants={fadeIn}
            className="bg-white py-16 lg:py-24"
          >
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div variants={staggerContainer} className="mb-12 text-center">
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                  Location
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                  Location Advantages
                </motion.h2>
              </motion.div>

              <div className="grid gap-8 lg:grid-cols-5">
                {/* Left: Image (3/5 ≈ 60%) */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="relative col-span-3 overflow-hidden rounded-2xl lg:rounded-3xl"
                >
                  <div className="group relative min-h-[320px] overflow-hidden sm:min-h-[400px] lg:min-h-full">
                    <img
                      src={images[1]?.url ?? thumb}
                      alt="Location"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                        {property.title}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Right: List (2/5 ≈ 40%) */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.15 }}
                  className="col-span-2 flex flex-col justify-center lg:pl-6"
                >
                  <h3 className="font-serif text-2xl font-bold text-[#0a2540] lg:text-3xl">
                    Prime Location Benefits
                  </h3>
                  <div className="mt-6 space-y-5">
                    {(locAdvantages.length > 0 ? locAdvantages : [
                      { title: 'ORR Exit', dist: '2 KM', desc: 'Direct access to Outer Ring Road' },
                      { title: '33 Ft Internal Roads', desc: 'Spacious well-planned internal road network' },
                      { title: 'Vijayawada Highway', dist: '2 KM', desc: 'Major arterial road connectivity' },
                      { title: 'CRDA Approved', desc: 'Fully approved layout by CRDA' },
                      { title: 'Near Educational Institutions', desc: 'Schools and colleges within 3 KM radius' },
                      { title: 'Bank Loan Facility', desc: 'All major banks offer home/plot loans' },
                    ]).slice(0, 8).map((loc, i) => (
                      <motion.div
                        key={loc.title || i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        whileHover={{ x: 8 }}
                        className="group flex items-start gap-4 border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#c6a43f]/10 text-[#c6a43f]">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-bold text-[#0a2540]">{loc.title}</h4>
                            {(loc.dist || loc.distance) && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                                {loc.dist || loc.distance}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500">{loc.desc || loc.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ──────────────────────────────────────────────────────
            SECTION 5 — AMENITIES (Dynamic)
        ────────────────────────────────────────────────────── */}
        {property.amenities && property.amenities.length > 0 && (
          <motion.section
            id="amenities"
            whileInView="visible"
            variants={fadeIn}
            className="bg-white py-16"
          >
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div variants={staggerContainer} className="mb-10 text-center">
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                  Amenities
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                  Project Features
                </motion.h2>
              </motion.div>

              <motion.div
                whileInView="visible"
                variants={staggerContainer}
                className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              >
                {property.amenities.map((a) => (
                  <motion.div
                    key={a}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    className="group rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-[#f8fafc] p-5 shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-md"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6a43f]/10 text-[#c6a43f]">
                      <Shield className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-[#0a2540]">{a}</h3>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ──────────────────────────────────────────────────────
            SECTION 6 — TESTIMONIALS (Dynamic)
        ────────────────────────────────────────────────────── */}
        {(testimonialList.length > 0 || true) && (
          <motion.section
            whileInView="visible"
            variants={fadeIn}
            className="relative overflow-hidden bg-[#f8fafc] py-16"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div variants={staggerContainer} className="mb-10 text-center">
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                  Testimonials
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                  What Investors Say
                </motion.h2>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                {(testimonialList.length > 0 ? testimonialList : [
                  { name: 'Suresh Reddy', location: 'Jubilee Hills', type: 'Plot Investment', year: '2023', rating: 5, text: "Found the perfect investment plot through Property Vision. The team handled all legal verification and documentation. Completely transparent process." },
                  { name: 'Venkateswara Rao', location: 'Vijayawada', type: 'Layout Purchase', year: '2024', rating: 5, text: "As an NRI, I was worried about investing from abroad. Property Vision managed everything — site visits via video, document verification, and registration." },
                ]).map((t, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:p-8"
                  >
                    <Quote className="absolute right-5 top-5 h-10 w-10 text-[#c6a43f]/15" />
                    <div className="mb-3 flex items-center gap-1">
                      {[...Array(t.rating ?? 5)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-current text-[#c6a43f]" />))}
                    </div>
                    <p className="mb-5 text-base italic leading-relaxed text-gray-600">"{t.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#c6a43f] to-[#f0c14b] text-lg font-bold text-[#020617]">
                        {(t.name || '?').charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#0a2540]">{t.name}</div>
                        {t.location && <div className="text-sm text-gray-500">{t.location}</div>}
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                          {t.type && <span>{t.type}</span>}
                          {t.type && t.year && <span>·</span>}
                          {t.year && <span>{t.year}</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ──────────────────────────────────────────────────────
            SECTION 7 — CONTACT (Two-Column Layout + QR Code)
        ────────────────────────────────────────────────────── */}
        <motion.section
          whileInView="visible"
          variants={fadeIn}
          id="contact"
          className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white py-16 lg:py-24"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-5">
              {/* ── Left: Enquiry Form (3/5) ── */}
              <motion.div
                variants={staggerContainer}
                className="lg:col-span-3"
              >
                <motion.div variants={fadeUp} className="mb-6">
                  <motion.span variants={fadeUp} className="inline-flex w-fit rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-sm font-medium text-[#D4AF37]">
                    Schedule a Visit
                  </motion.span>
                  <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0A1931] lg:text-4xl">
                    Experience the Property Firsthand
                  </motion.h2>
                  <motion.p variants={fadeUp} className="text-gray-500">
                    Get a guided tour with our experts. We'll show you everything you need to know.
                  </motion.p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 lg:p-8"
                >
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-[#0A1931]">Full Name</label>
                        <input type="text" placeholder="Enter your name" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0A1931] placeholder:text-slate-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#0A1931]">Email Address</label>
                        <input type="email" placeholder="Enter your email" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0A1931] placeholder:text-slate-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#0A1931]">Phone Number</label>
                      <input type="tel" placeholder="Enter your phone" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0A1931] placeholder:text-slate-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-[#0A1931]">Preferred Date</label>
                        <input type="date" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0A1931] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#0A1931]">Preferred Time</label>
                        <select className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0A1931] focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10">
                          <option>Morning (9AM-12PM)</option>
                          <option>Afternoon (12PM-3PM)</option>
                          <option>Evening (3PM-6PM)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#0A1931]">Message (Optional)</label>
                      <textarea rows={3} placeholder="Any specific questions?" className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0A1931] placeholder:text-slate-300 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/10" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C84C] px-6 py-3.5 text-sm font-bold text-[#0A1931] shadow-lg shadow-[#D4AF37]/20 transition-all hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center gap-2"><Calendar className="h-4 w-4" /> Schedule Private Tour</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Trust badges */}
                <motion.div variants={staggerFast} className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-400" /> 100% Secure</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-emerald-400" /> Response within 1 hour</span>
                </motion.div>
              </motion.div>

              {/* ── Right: Project Highlights + QR Code (2/5) ── */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                {/* Project Highlights Card */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 lg:p-8">
                  <h3 className="text-lg font-bold text-[#0A1931]">Project Highlights</h3>
                  <ul className="mt-4 space-y-3">
                    {(siteVisitBenefitsList.length > 0 ? siteVisitBenefitsList : [
                      { text: 'Free pickup and drop service' },
                      { text: 'Meet the development team' },
                      { text: 'Verify documents and approvals' },
                      { text: 'Get investment guidance' },
                    ]).map((item) => (
                      <li key={item.text || Math.random().toString()} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-gray-600">{item.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* QR Code */}
                  <div className="mt-6 rounded-xl bg-[#f8fafc] p-4 text-center">
                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl bg-white shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                          typeof window !== 'undefined' ? window.location.href : ''
                        )}`}
                        alt="QR Code"
                        className="h-24 w-24"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">Scan to view on mobile</p>
                  </div>

                  {/* Contact info */}
                  <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                    <a href={`tel:${property.phoneNumber || '+917659926345'}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#D4AF37]">
                      <Phone className="h-4 w-4 text-emerald-500" /> {property.phoneNumber || '+91 76599 26345'}
                    </a>
                    <a href={`mailto:${property.email || 'propertyvision1610@gmail.com'}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#D4AF37]">
                      <Mail className="h-4 w-4 text-emerald-500" /> {property.email || 'propertyvision1610@gmail.com'}
                    </a>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-emerald-500" /> {[property.city, property.district].filter(Boolean).join(' | ') || 'Hyderabad | Vijayawada'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ──────────────────────────────────────────────────────
            SECTION 9 — PLOT AVAILABILITY (Dynamic)
        ────────────────────────────────────────────────────── */}
        {property.id && <PlotAvailabilitySection propertyId={property.id} property={property as any} />}

        {/* ──────────────────────────────────────────────────────
            SECTION 10 — FAQ (Dynamic)
        ────────────────────────────────────────────────────── */}
        {(faqList.length > 0 || true) && (
          <motion.section
            id="faqs"
            whileInView="visible"
            variants={fadeIn}
            className="relative overflow-hidden bg-[#f8fafc] py-16"
          >
            <div className="relative z-10 mx-auto max-w-3xl px-4 lg:px-8">
              <motion.div variants={staggerContainer} className="mb-10 text-center">
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                  FAQ
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                  Frequently Asked Questions
                </motion.h2>
              </motion.div>

              <div className="space-y-3">
                {(faqList.length > 0 ? faqList : [
                  { q: 'What is the pricing and payment plan?', a: 'Prices start from the listed amount with flexible payment plans. We offer bank loan assistance with major banks and financial institutions.' },
                  { q: 'What is the possession timeline?', a: 'The project is currently in active development phase with possession expected as per the timeline shared during consultation.' },
                  { q: 'Is the property CRDA approved?', a: 'Yes, this property is fully CRDA approved with all necessary government approvals and clear documentation.' },
                ]).map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300"
                  >
                    <button
                      onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-[#0a2540] lg:text-base">{faq.q}</span>
                      <motion.span variants={iconRotate} animate={faqOpen === idx ? 'open' : 'closed'} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c6a43f]/10 text-[#c6a43f]">
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {faqOpen === idx && (
                        <motion.div
                          variants={accordionContent}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 px-6 py-4">
                            <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ──────────────────────────────────────────────────────
            SECTION 11 — FINAL CTA BANNER
        ────────────────────────────────────────────────────── */}
        <motion.section
          whileInView="visible"
          variants={fadeIn}
          className="relative overflow-hidden bg-[#0a2540] py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#0d2a4a] to-[#0f3058]" />
          <div className="absolute inset-0">
            <div className="absolute -right-20 top-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/[0.04] blur-[160px]" />
            <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-[#c6a43f]/[0.03] blur-[120px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

          <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
            <motion.div whileInView="visible" variants={staggerContainer} className="mx-auto max-w-3xl">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2 text-sm font-medium text-emerald-400">
                <Sparkles className="h-4 w-4" /> Ready to Own Your Future?
              </motion.span>
              <motion.h2 variants={fadeUp} className="mt-6 font-serif text-4xl font-black text-white lg:text-5xl">
                Book a{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">Free Consultation</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-base text-slate-400 lg:text-lg">
                Discover why Property Vision is the most trusted name in real estate.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="#contact">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-8 py-4 text-sm font-bold text-[#020617] shadow-lg shadow-[#c6a43f]/20 transition-all hover:shadow-xl hover:shadow-[#c6a43f]/30">
                    <span className="relative z-10 flex items-center gap-2"><Calendar className="h-4 w-4" /> Schedule Site Visit</span>
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </motion.button>
                </a>
                <a href={`tel:${property.phoneNumber || '+917659926345'}`}>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="rounded-xl border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white">
                    <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> Call Expert</span>
                  </motion.button>
                </a>
                <a href={`https://wa.me/${(property.whatsappNumber || '917659926345').replace(/[^0-9]/g, '')}?text=Hi,%20I'm%20interested%20in%20${encodeURIComponent(property.title)}`} target="_blank" rel="noopener noreferrer">
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-8 py-4 text-sm font-medium text-emerald-300 backdrop-blur-sm transition-all hover:bg-emerald-500/[0.1]">
                    <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp Us</span>
                  </motion.button>
                </a>
              </motion.div>
              <motion.div variants={staggerFast} className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                <motion.div variants={fadeUp} className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-400" /> {property.phoneNumber || '+91 76599 26345'}</motion.div>
                <motion.div variants={fadeUp} className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400" /> {property.email || 'propertyvision1610@gmail.com'}</motion.div>
                <motion.div variants={fadeUp} className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-400" /> {[property.city, property.district].filter(Boolean).join(' | ') || 'Hyderabad | Vijayawada'}</motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </article>

      {/* ─── LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={() => setLightboxOpen(false)}
          >
            <button onClick={() => setLightboxOpen(false)} className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p > 0 ? p - 1 : galleryItems.length - 1)); }}
              className="absolute left-6 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={galleryItems[lightboxIndex]?.url}
              alt=""
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p < galleryItems.length - 1 ? p + 1 : 0)); }}
              className="absolute right-6 top-1/2 z-10 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/40">
              {lightboxIndex + 1} / {galleryItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}