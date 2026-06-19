import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { AppLayout } from '@/layouts/AppLayout';
import { PropertyGrid } from '@/features/properties/components/PropertyGrid';
import { PropertyFilters } from '@/features/properties/components/PropertyFilters';
import { useProperties, usePropertyPageHero } from '@/features/properties/hooks/useProperties';
import type { Property } from '@/types/property';
import {
  ShieldCheck, FileText, MapPin, HeadphonesIcon, ArrowRight, Phone, Mail,
  Star, Award, Briefcase, CheckCircle2, Building2, Users, Clock, TrendingUp,
  Sparkles, ChevronRight, Quote, Play, Search, SlidersHorizontal, ChevronDown, Calendar,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const staggerFast = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

function AnimatedCounter({ value, suffix = '', startDelay = 0 }: { value: number; suffix?: string; startDelay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => setHasAnimated(true), startDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimated, startDelay]);
  return (
    <span ref={ref} className="inline-block tabular-nums">
      {hasAnimated ? (
        <CountUp start={0} end={value} duration={3} suffix={suffix} useEasing={false} useGrouping={false} separator="" />
      ) : `0${suffix}`}
    </span>
  );
}

function formatPrice(p: Property['price']) {
  if (p == null || p === '') return 'Price on request';
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function PropertiesPage() {
  const { data: properties = [], isLoading, isError, error } = useProperties();
  const { data: hero } = usePropertyPageHero();
  const [filtered, setFiltered] = useState<Property[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const handleFilterChange = useCallback((list: Property[]) => {
    setFiltered(list);
  }, []);

  const displayProperties = filtered.length > 0 || isError || isLoading ? filtered : properties;
  const heroMedia = hero?.videoUrl ?? hero?.bannerImageUrl ?? hero?.featuredProperty?.media?.[0]?.url;
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const whyItems = [
    { icon: TrendingUp, title: 'High Growth Locations', desc: 'Identify emerging investment hotspots with strong appreciation potential across AP and Telangana.' },
    { icon: FileText, title: 'Market Research & Insights', desc: 'Data-driven analysis on property trends, pricing, and future development corridors.' },
    { icon: MapPin, title: 'Guided Site Visits', desc: 'Expert-led site visits with detailed insights on location, infrastructure, and growth potential.' },
    { icon: ShieldCheck, title: 'Investment Protection', desc: 'Complete due diligence, title verification, and transparent transaction processes.' },
    { icon: Users, title: 'Dedicated Support', desc: 'Personal relationship managers ensuring a smooth journey from search to possession.' },
    { icon: HeadphonesIcon, title: 'End-to-End Assistance', desc: 'From property selection to registration, loan assistance, and post-sale support.' },
  ];

  const hotspots = [
    { name: 'Amaravati', growth: '240%', projects: '150+', rating: 'A+' },
    { name: 'Vijayawada', growth: '180%', projects: '500+', rating: 'A+' },
    { name: 'Guntur', growth: '160%', projects: '300+', rating: 'A' },
    { name: 'Hyderabad', growth: '220%', projects: '200+', rating: 'A+' },
    { name: 'Warangal', growth: '120%', projects: '60+', rating: 'B+' },
    { name: 'Khammam', growth: '100%', projects: '80+', rating: 'B+' },
  ];

  return (
    <AppLayout>
      <article className="bg-white">
        {/* ════════════════════════════════════════
            SECTION 1 — CINEMATIC HERO
        ════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a2540] to-[#0d2a4a]" />
            {hero?.videoUrl ? (
              <video className="h-full w-full object-cover opacity-50" autoPlay muted loop playsInline>
                <source src={hero.videoUrl} />
              </video>
            ) : heroMedia ? (
              <img src={heroMedia} alt="" className="h-full w-full object-cover opacity-50" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#020617] via-[#0a2540] to-[#0d9488]/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/65" />
          </motion.div>

          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.06] blur-[160px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#c6a43f]/[0.04] blur-[120px]" />
          </div>

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <motion.div className="absolute inset-0 flex items-center justify-center text-center" style={{ opacity: heroOpacity as unknown as number }}>
            <div className="mx-auto w-full max-w-5xl px-6">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="mx-auto max-w-4xl"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]"
                >
                  <TrendingUp className="h-3 w-3" />
                  Premium Investment Opportunities
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mx-auto mt-6 font-serif text-[42px] font-black leading-[1.1] tracking-tight text-white lg:text-[56px] xl:text-[72px]"
                >
                  Discover Premium<br />
                  <span className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] bg-clip-text text-transparent">
                    Investment Opportunities
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 lg:text-lg"
                >
                  Explore verified layouts, gated communities, CRDA-approved ventures, and high-growth investment destinations.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-5 flex flex-wrap justify-center gap-3"
                >
                  {[{ icon: ShieldCheck, text: 'CRDA Approved' }, { icon: CheckCircle2, text: 'RERA Verified' }, { icon: TrendingUp, text: 'High Growth Zone' }, { icon: FileText, text: 'Legal Clearance' }].map((item) => (
                    <span key={item.text} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                      <item.icon className="h-3.5 w-3.5 text-emerald-400" />
                      {item.text}
                    </span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 flex flex-wrap justify-center gap-3"
                >
                  <a href="#properties-grid">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] px-6 py-3 text-base font-bold text-[#020617] shadow-lg transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Explore Properties
                      </span>
                      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </motion.button>
                  </a>
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-2xl border border-white/25 bg-white/10 px-6 py-3 text-base font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Us
                      </span>
                    </motion.button>
                  </Link>
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-6 py-3 text-base font-medium text-emerald-300 backdrop-blur-sm transition-all hover:bg-emerald-500/20"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule Visit
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-8 flex flex-wrap justify-center gap-4"
                >
                  {[{ icon: Users, label: '1000+ Investors', accent: 'text-emerald-400' }, { icon: Building2, label: '500+ Acres Developed', accent: 'text-[#D4AF37]' }, { icon: Clock, label: '100+ Projects', accent: 'text-emerald-400' }, { icon: ShieldCheck, label: '100% Verified', accent: 'text-[#D4AF37]' }].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.span
                        key={item.label}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1 + i * 0.06, type: 'spring', stiffness: 120, damping: 12 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md lg:gap-2 lg:px-4 lg:py-2 lg:text-sm"
                      >
                        <Icon className={`h-3 w-3 ${item.accent} lg:h-3.5 lg:w-3.5`} />
                        {item.label}
                      </motion.span>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Scroll Indicator ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Scroll</span>
              <ChevronDown className="h-4 w-4 text-white/30" />
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — SMART SEARCH PANEL
        ════════════════════════════════════════ */}
        <div className="sticky top-0 z-30 border-b border-slate-100/80 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center gap-4 py-3">
              <div className="hidden items-center gap-2 lg:flex">
                <Search className="h-4 w-4 text-[#c6a43f]" />
                <span className="text-sm font-medium text-[#0a2540]">Find Your Property</span>
              </div>
              <div className="flex flex-1 items-center">
                <a href="#properties-grid" className="flex w-full max-w-md items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400 transition-colors hover:border-[#c6a43f]/30 hover:text-slate-600">
                  <Search className="h-4 w-4" />
                  Search ventures by city, type, budget...
                </a>
              </div>
              <a href="#properties-grid">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm hover:border-[#c6a43f]/30"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden lg:inline">Venture Filters</span>
                </motion.button>
              </a>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SECTION 3 — FEATURED PROJECTS
        ════════════════════════════════════════ */}
        {featuredProperties.length > 0 && (
          <motion.section
            whileInView="visible"
            variants={fadeUp}
            className="bg-[#f8fafc] py-20"
          >
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <motion.div variants={staggerContainer} className="mb-12 text-center">
                <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                  Featured Projects
                </motion.span>
                <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                  Premium Investment Opportunities
                </motion.h2>
                <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-sm text-gray-500 lg:text-base">
                  Handpicked projects with the highest investment potential and verified credentials.
                </motion.p>
              </motion.div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProperties.map((property, idx) => {
                  const thumb = property.media?.find((m) => m.type === 'image' || m.type.includes('image'))?.url ?? property.media?.[0]?.url ?? null;
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8, scale: 1.01 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-[#c6a43f]/25 via-emerald-500/10 to-[#c6a43f]/25 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {thumb ? (
                            <img src={thumb} alt={property.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" loading="lazy" />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0a2540]/10 to-[#0d9488]/10">
                              <Building2 className="h-12 w-12 text-slate-200" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <div className="absolute left-3 top-3 flex gap-2">
                            <span className="rounded-lg bg-gradient-to-r from-[#c6a43f] to-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#020617]">
                              Featured
                            </span>
                            {property.propertyType && (
                              <span className="rounded-lg bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0a2540] backdrop-blur-sm">
                                {property.propertyType}
                              </span>
                            )}
                          </div>
                          {property.price && property.price !== '' && (
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-4 py-2.5 shadow-lg">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5c4010]">Starting From</p>
                                <p className="text-lg font-bold text-[#081120]">{formatPrice(property.price)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-serif text-lg font-bold text-[#0a2540] group-hover:text-[#0d9488] transition-colors">{property.title}</h3>
                          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {property.city}{property.locality ? `, ${property.locality}` : ''}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                              <ShieldCheck className="h-3 w-3" />
                              CRDA Approved
                            </span>
                            <Link to={`/properties/${property.slug ?? property.id}`}>
                              <motion.span
                                whileHover={{ x: 3 }}
                                className="flex items-center gap-1 text-xs font-semibold text-[#c6a43f]"
                              >
                                Explore Project <ArrowRight className="h-3 w-3" />
                              </motion.span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* ════════════════════════════════════════
            SECTION 4 — PROPERTY COLLECTION
        ════════════════════════════════════════ */}
        <section id="properties-grid" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                Investment Ventures
              </span>
              <h2 className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                Explore All Ventures
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-gray-500 lg:text-base">
                Browse our handpicked selection of premium land ventures and investment-grade properties with verified approvals and high growth potential.
              </p>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-slate-100 p-4">
                    <div className="h-72 rounded-xl bg-slate-200" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                    <div className="mt-3 h-10 rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                <p className="text-sm text-red-600">
                  {(error as Error)?.message ?? 'Could not load properties. Is the API running?'}
                </p>
              </div>
            ) : (
              <>
                <PropertyFilters properties={properties} onFilterChange={handleFilterChange} />
                <PropertyGrid properties={displayProperties} />
              </>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 — WHY INVEST WITH PROPERTY VISION
        ════════════════════════════════════════ */}
        <motion.section
          whileInView="visible"
          variants={fadeIn}
          className="relative overflow-hidden bg-[#f8fafc] py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div variants={staggerContainer} className="mb-12 text-center">
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                Why Invest With Us
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                Built Different. Built Better.
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-sm text-gray-500 lg:text-base">
                What sets us apart in the real estate landscape.
              </motion.p>
            </motion.div>

            <motion.div
              whileInView="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {whyItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    className="rounded-2xl border border-slate-100 bg-white bg-gradient-to-br from-white to-[#f8fafc] p-8 shadow-sm transition-all duration-500 hover:border-[#c6a43f]/20 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c6a43f]/10 text-[#c6a43f]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 mt-4 text-lg font-bold text-[#0a2540]">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════
            SECTION 6 — INVESTMENT HOTSPOTS
        ════════════════════════════════════════ */}
        <motion.section
          whileInView="visible"
          variants={fadeIn}
          className="bg-white py-20"
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div variants={staggerContainer} className="mb-12 text-center">
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                Investment Hotspots
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                High-Growth Markets
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-sm text-gray-500 lg:text-base">
                Discover emerging investment destinations across Andhra Pradesh and Telangana.
              </motion.p>
            </motion.div>

            <div className="mb-10 overflow-hidden rounded-3xl border border-slate-100 shadow-xl">
              <div className="relative h-[250px] bg-gradient-to-br from-[#0a2540] via-[#0d2a4a] to-[#0f3058] lg:h-[320px]">
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <MapPin className="mx-auto h-10 w-10 text-[#c6a43f]/60" />
                    </motion.div>
                    <p className="mt-3 font-serif text-xl font-bold text-white/80 lg:text-2xl">Andhra Pradesh & Telangana</p>
                    <p className="mt-1 text-sm text-white/40">6 Cities · 50+ Locations · 1200+ Ventures</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a2540]/80 to-transparent" />
              </div>
            </div>

            <motion.div
              whileInView="visible"
              variants={staggerContainer}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
            >
              {hotspots.map((spot) => (
                <motion.div
                  key={spot.name}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-md"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#c6a43f] to-amber-400" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6a43f]/10 text-[#c6a43f]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0a2540]">{spot.name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="text-emerald-500 font-semibold">{spot.growth}</span>
                        <span>·</span>
                        <span>{spot.projects} projects</span>
                        <span>·</span>
                        <span className="text-[#c6a43f] font-semibold">Rating {spot.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════
            SECTION 7 — CUSTOMER STORIES
        ════════════════════════════════════════ */}
        <motion.section
          whileInView="visible"
          variants={fadeIn}
          className="relative overflow-hidden bg-[#f8fafc] py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <motion.div
              whileInView="visible"
              variants={staggerContainer}
              className="mb-12 text-center"
            >
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                Client Stories
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                What Our Investors Say
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-sm text-gray-500 lg:text-base">
                Real stories from real investors who found their dream property with Property Vision.
              </motion.p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {[
                {
                  name: 'Suresh Reddy', location: 'Jubilee Hills, Hyderabad', type: 'Luxury Apartment', year: '2023',
                  text: "Property Vision didn't just sell us a home — they helped us make a life-changing investment. Their transparency and local knowledge are unmatched.",
                  rating: 5,
                },
                {
                  name: 'Venkateswara Rao', location: 'Vijayawada', type: 'Plotted Development', year: '2024',
                  text: "As an NRI investor, I needed someone trustworthy. Property Vision handled everything professionally — from site visits to documentation.",
                  rating: 5,
                },
                {
                  name: 'Priya Sharma', location: 'Gachibowli, Hyderabad', type: 'Villa', year: '2024',
                  text: "The team's attention to detail and commitment to client satisfaction is extraordinary. They made buying our first property completely stress-free.",
                  rating: 5,
                },
              ].map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:p-8"
                >
                  <Quote className="absolute right-5 top-5 h-10 w-10 text-[#c6a43f]/20" />

                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-[#c6a43f]" />
                    ))}
                  </div>

                  <p className="mb-6 text-lg italic leading-relaxed text-gray-700">"{t.text}"</p>

                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#c6a43f] to-[#f0c14b] text-lg font-bold text-[#020617]">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-[#0a2540]">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.location}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                        <span>{t.type}</span>
                        <span>·</span>
                        <span>{t.year}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ════════════════════════════════════════
            SECTION 8 — FINAL CTA
        ════════════════════════════════════════ */}
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
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
            <motion.div
              whileInView="visible"
              variants={staggerContainer}
              className="mx-auto max-w-3xl"
            >
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2 text-sm font-medium text-emerald-400">
                <Sparkles className="h-4 w-4" />
                Ready To Invest In Your Future?
              </motion.span>

              <motion.h2 variants={fadeUp} className="mt-6 font-serif text-4xl font-black text-white lg:text-5xl">
                Find Your{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  Perfect Investment
                </span>
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-4 text-base text-slate-400 lg:text-lg">
                Join thousands of satisfied investors who found their dream property with Property Vision.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-8 py-4 text-sm font-bold text-[#020617] shadow-lg shadow-[#c6a43f]/20 transition-all hover:shadow-xl hover:shadow-[#c6a43f]/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Book Consultation
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </motion.button>
                </Link>
                <a href="#properties-grid">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      Explore Listings
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </motion.button>
                </a>
                <a href="tel:+917659926345">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-8 py-4 text-sm font-medium text-emerald-300 backdrop-blur-sm transition-all hover:bg-emerald-500/[0.1]"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call Now
                    </span>
                  </motion.button>
                </a>
              </motion.div>

              <motion.div
                whileInView="visible"
                variants={staggerFast}
                className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-slate-400"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-400" />
                  +91 76599 26345
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-400" />
                  propertyvision1610@gmail.com
                </motion.div>
                <motion.div variants={fadeUp} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  Hyderabad | Vijayawada
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </article>
    </AppLayout>
  );
}


