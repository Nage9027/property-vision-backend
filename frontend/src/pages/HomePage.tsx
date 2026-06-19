import { useState, useRef, useCallback, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Phone, MapPin, CheckCircle, MessageCircle, ArrowRight,
  IndianRupee, ShieldCheck, Volume2, VolumeX,
  Building2, HandHeart, Clock, BarChart3, ArrowUpRight, Star,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { useProperties } from '@/features/properties/hooks/useProperties';
import { useHomepageHero } from '@/features/properties/hooks/useHomepageHero';
import { Skeleton } from '@/components/ui/skeleton';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { PromotionalPopup } from '@/components/PromotionalPopup';

import {
  pageLoadVariants, fadeUp, staggerContainer, heroBadge,
} from '@/config/animations';

export function HomePage() {
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const { data: properties = [] } = useProperties();
  const { data: hero, isLoading: heroLoading } = useHomepageHero();
  const featuredProperties = properties.slice(0, 6);
  const [heroVideoMuted, setHeroVideoMuted] = useState(true);

  const toggleHeroVideoSound = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const el = heroVideoRef.current;
    if (!el) return;
    const nextMuted = !el.muted;
    el.muted = nextMuted;
    setHeroVideoMuted(nextMuted);
    if (!nextMuted) {
      void el.play().catch(() => {});
    }
  }, []);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    whatsappOptIn: true,
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormStatus('success');
    setLeadForm({ name: '', phone: '', email: '', whatsappOptIn: true });
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  // Dynamic hero data with fallbacks
  const heroTitle = hero?.heroTitle || hero?.title || 'Premium Investment Ventures';
  const heroSubtitle = hero?.heroSubtitle || 'Premium Investment Opportunities';
  const heroDescription = hero?.heroDescription || 'Handpicked land ventures and premium properties with high-growth potential, verified approvals, and expert investment advisory across Andhra Pradesh and Telangana.';
  const heroVideoSrc = hero?.heroVideoUrl || '/assets/Video%20Project%202.mp4';
  const heroImageFallback = hero?.heroImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80';
  const startingPrice = hero?.startingPrice || '';
  const priceUnit = hero?.priceUnit || '';
  const priceHighlight = hero?.priceHighlight || '';
  const offerBadge = hero?.offerBadge || '';
  const districtDisplay = hero?.district || '';
  const stateDisplay = hero?.state || '';
  const cityDisplay = hero?.city || '';
  const landmarkDisplay = hero?.landmark || '';
  const totalPlots = hero?.totalPlots || '';
  const availableUnits = hero?.availableUnits || '';
  const distanceToORR = hero?.distanceToORR || '';
  const internalRoadWidth = hero?.internalRoadWidth || '';
  const phoneNumber = hero?.phoneNumber || '+917659926345';
  const whatsappNumber = hero?.whatsappNumber || '+917659926345';
  const googleMapUrl = hero?.googleMapUrl || 'https://maps.google.com/?q=Vijayawada+ORR';
  const slug = hero?.slug || '';

  // Feature pills
  const featurePills: Array<{ Icon: typeof MapPin; label: string }> = [];
  if (cityDisplay && landmarkDisplay) {
    featurePills.push({ Icon: MapPin, label: `${cityDisplay} · ${landmarkDisplay}` });
  } else if (cityDisplay) {
    featurePills.push({ Icon: MapPin, label: cityDisplay });
  }
  if (startingPrice && priceUnit) {
    featurePills.push({ Icon: IndianRupee, label: `From ${startingPrice} ${priceUnit}` });
  }
  featurePills.push({ Icon: ShieldCheck, label: 'Approved layout guidance' });

  // Stats
  const heroStats: Array<{ value: string; label: string }> = [];
  if (totalPlots) heroStats.push({ value: totalPlots, label: 'Total Plots' });
  if (availableUnits) heroStats.push({ value: availableUnits, label: 'Available Now' });
  if (distanceToORR) heroStats.push({ value: distanceToORR, label: 'To ORR' });
  if (internalRoadWidth) heroStats.push({ value: internalRoadWidth, label: 'Internal Roads' });

  // Buttons
  const renderButton = (
    label: string | undefined | null,
    type: string | undefined | null,
    url: string | undefined | null,
    isPrimary: boolean,
  ) => {
    if (!label || !type) return null;

    const base = `rounded-2xl px-6 py-3 text-base font-bold transition-all md:px-8 md:py-3.5 md:text-lg ${
      isPrimary
        ? 'text-white shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]' +
          ' bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] text-[#020617]'
        : 'border border-white/25 bg-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.15)]'
    }`;

    const content = (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={base}
      >
        {type === 'phone' && <Phone className="mr-2 inline h-4 w-4 md:h-5 md:w-5" />}
        {label}
        {type === 'internal' && <ArrowRight className="ml-2 inline h-4 w-4 md:h-5 md:w-5" />}
      </motion.button>
    );

    if (type === 'phone') {
      return <a key={label} href={`tel:${url || phoneNumber}`}>{content}</a>;
    }
    if (type === 'whatsapp') {
      return <a key={label} href={`https://wa.me/${(url || whatsappNumber).replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">{content}</a>;
    }
    if (type === 'external') {
      return <a key={label} href={url || '#'} target="_blank" rel="noreferrer">{content}</a>;
    }
    // internal
    return (
      <Link key={label} to={url || '#'}>
        {content}
      </Link>
    );
  };

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-[85dvh] flex-col overflow-x-hidden overflow-y-hidden pt-20">
        {/* Cinematic Background */}
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0">
          <video
            ref={heroVideoRef}
            className="h-full w-full object-cover"
            src={heroVideoSrc}
            poster={heroImageFallback}
            autoPlay
            muted={heroVideoMuted}
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[#020617]/85" />
        </motion.div>

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="container mx-auto flex min-h-0 flex-1 flex-col px-4 py-4 md:py-6 lg:py-8">
            {heroLoading ? (
              <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center">
                <Skeleton className="mx-auto h-12 w-3/4 rounded-lg bg-white/10 md:h-16" />
                <Skeleton className="mx-auto mt-4 h-8 w-1/2 rounded-lg bg-white/10 md:h-10" />
                <Skeleton className="mx-auto mt-4 h-6 w-2/3 rounded-lg bg-white/10" />
              </div>
            ) : (
              <motion.div
                variants={pageLoadVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col justify-center text-center"
              >
                {/* Offer Badge */}
                {offerBadge && (
                  <motion.div
                    variants={heroBadge}
                    initial="hidden"
                    animate="visible"
                    className="mb-4"
                  >
                    <span className="inline-block rounded-full border-2 border-[#f0c14b] bg-[#c6a43f]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#f0c14b]">
                      {offerBadge}
                    </span>
                  </motion.div>
                )}

                {/* Main Title */}
                <h1 className="mb-3 font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl xl:text-7xl">
                  {heroTitle}
                </h1>

                {/* Subtitle */}
                <h2 className="mb-4 text-xl font-bold md:mb-5 md:text-2xl lg:text-3xl">
                  <span className="bg-gradient-to-r from-[#c6a43f] via-[#f0c14b] to-white bg-clip-text text-transparent">
                    {heroSubtitle}
                  </span>
                </h2>

                {/* Description */}
                <p className="mx-auto mb-4 max-w-3xl text-base leading-snug text-white/90 md:mb-5 md:text-lg md:leading-relaxed">
                  {heroDescription}
                </p>

                {/* Location & Price Info */}
                {(cityDisplay || districtDisplay || startingPrice) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm md:mb-6 md:text-base"
                  >
                    {(cityDisplay || districtDisplay) && (
                      <span className="inline-flex items-center gap-1.5 text-white/80">
                        <MapPin className="h-4 w-4 text-[#f0c14b]" />
                        {[cityDisplay, districtDisplay, stateDisplay].filter(Boolean).join(', ')}
                      </span>
                    )}
                    {startingPrice && (
                      <span className="inline-flex items-center gap-1.5 text-white/80">
                        <IndianRupee className="h-4 w-4 text-[#f0c14b]" />
                        {startingPrice}{priceUnit ? ` ${priceUnit}` : ''}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Feature Pills */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mb-5 flex flex-wrap justify-center gap-2 md:mb-6 md:gap-3"
                >
                  {featurePills.map(({ Icon, label }) => (
                    <motion.span
                      key={label}
                      variants={fadeUp}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(15,23,42,0.6)] px-3 py-1.5 text-xs text-white/90 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400 sm:h-4 sm:w-4" />
                      <span className="font-medium">{label}</span>
                    </motion.span>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4 flex flex-wrap justify-center gap-3 md:mb-5 md:gap-4"
                >
                  {renderButton(hero?.btn1Label || 'Explore This Venture', hero?.btn1Type || 'internal', hero?.btn1Url || (slug ? `/properties/${slug}` : '/properties'), true)}
                  {renderButton(hero?.btn2Label || 'Call Now', hero?.btn2Type || 'phone', hero?.btn2Url || phoneNumber, false)}
                </motion.div>

                {/* Bottom action links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-[rgba(255,255,255,0.08)] px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-emerald-400/50 hover:bg-[rgba(16,185,129,0.12)] hover:text-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={googleMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-[rgba(255,255,255,0.08)] px-5 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:bg-[rgba(212,175,55,0.12)] hover:text-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                  >
                    <MapPin className="h-4 w-4" />
                    {hero?.btn3Label || 'View Location'}
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* Bottom stats cards */}
            {!heroLoading && heroStats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto flex w-full shrink-0 flex-wrap items-center justify-center gap-3 self-center px-2 pb-4 sm:gap-4 sm:pb-6"
              >
                {heroStats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="flex min-w-[100px] flex-col items-center rounded-2xl border border-white/[0.15] bg-[rgba(15,23,42,0.65)] px-5 py-3 text-center shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] sm:min-w-[120px] sm:px-6 sm:py-4"
                  >
                    <span className="bg-gradient-to-b from-[#D4AF37] to-[#F5D76E] bg-clip-text text-lg font-bold text-transparent sm:text-xl lg:text-2xl">
                      {stat.value}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/80 sm:text-xs">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <button
              type="button"
              onClick={toggleHeroVideoSound}
              className="absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#020617]/70 text-white/70 transition hover:bg-[#020617] hover:text-white sm:h-10 sm:w-10"
              aria-pressed={!heroVideoMuted}
              aria-label={heroVideoMuted ? 'Unmute hero video' : 'Mute hero video'}
            >
              {heroVideoMuted ? (
                <VolumeX className="h-4 w-4" aria-hidden />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="relative border-b border-[#081120]/[0.06] bg-gradient-to-b from-white via-[#f8fafc] to-white py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a43f]/35 to-transparent" aria-hidden />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-start gap-x-10 gap-y-12 lg:grid-cols-2 lg:items-center lg:gap-x-14">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex min-w-0 flex-col"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#c6a43f]">
                About Us
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#081120] md:text-4xl md:leading-tight">
                About Property Vision
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 md:mt-5 md:text-lg">
                Your trusted partner in real estate across Andhra Pradesh and Telangana. Property Vision pairs deep local
                market knowledge with straightforward guidance so buyers, sellers, and investors can move with clarity.
              </p>

              <div
                className="my-6 h-px w-full max-w-lg bg-gradient-to-r from-[#c6a43f]/50 via-[#c6a43f]/20 to-transparent md:my-7"
                aria-hidden
              />

              <ul className="mb-7 max-w-xl space-y-3.5 text-sm leading-relaxed text-gray-600 md:mb-8 md:text-[15px] md:leading-relaxed">
                {[
                  'CRDA-aware layouts and title checks — we focus on clear documentation before you commit.',
                  'Site visits and end-to-end coordination from first enquiry through registration.',
                  'Transparent pricing on residential plots, gated communities, and growth corridors.',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <CheckCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#c6a43f]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[repeat(3,minmax(0,1fr))] sm:gap-4">
                {[
                  { value: '10+', label: 'Years' },
                  { value: '5000+', label: 'Deals' },
                  { value: '100%', label: 'Transparency' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -2 }}
                    className="flex min-h-[5.75rem] flex-col items-center justify-center rounded-xl border border-[#081120]/[0.08] bg-white/80 px-3 py-4 text-center shadow-sm shadow-[#081120]/[0.04] sm:min-h-[6.25rem] sm:px-4"
                  >
                    <div className="text-2xl font-bold tabular-nums text-[#081120]">{stat.value}</div>
                    <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <Link to="/about" className="inline-flex w-fit">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center rounded-xl border-2 border-[#c6a43f]/70 bg-gradient-to-r from-[#081120] to-[#0a2540] px-6 py-3 text-sm font-semibold text-white shadow-md transition-shadow hover:border-[#c6a43f] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a43f]/50 md:text-base"
                >
                  Learn More
                  <ArrowRight className="ml-2 inline h-4 w-4" aria-hidden />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative min-w-0 lg:justify-self-end"
            >
              <div className="relative overflow-hidden rounded-2xl border border-[#c6a43f]/25 bg-gradient-to-br from-[#081120]/[0.92] via-[#0a2540] to-[#1a3555] p-6 shadow-[0_24px_50px_-12px_rgba(8,17,32,0.35),0_0_0_1px_rgba(198,164,63,0.12)] ring-1 ring-black/5 sm:p-8 md:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c6a43f]/15 blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[#f0c14b]/10 blur-3xl" aria-hidden />
                <div className="relative flex min-h-[260px] items-center justify-center rounded-xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-6 py-8 sm:min-h-[280px] md:min-h-[300px] md:max-h-[320px] md:py-10">
                  <img
                    src="/logo.png"
                    alt="Property Vision"
                    className="h-auto max-h-[280px] w-full max-w-sm object-contain object-center drop-shadow-lg sm:max-h-[300px] md:max-h-[320px]"
                    width={400}
                    height={320}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-[#c6a43f]">
              Our Services
            </span>
            <h2 className="mb-4 mt-3 font-serif text-3xl font-bold text-[#081120] md:text-4xl">
              End-to-End Real Estate Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Comprehensive services designed to make your property journey seamless and successful.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: <Building2 className="h-6 w-6" />, title: 'Buy Properties', description: 'Find your dream home with zero brokerage' },
              { icon: <HandHeart className="h-6 w-6" />, title: 'Sell Property', description: 'Get the best market price, fast selling' },
              { icon: <Clock className="h-6 w-6" />, title: 'Rent Agreement', description: 'Legal support & rental management' },
              { icon: <BarChart3 className="h-6 w-6" />, title: 'Investment Advisory', description: 'High-ROI property investment guidance' },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a43f] to-[#f0c14b] text-white transition-transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[#081120]">{service.title}</h3>
                <p className="mb-4 text-sm text-gray-600">{service.description}</p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#c6a43f] transition-colors hover:text-[#b89435]"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="relative border-b border-[#081120]/[0.06] bg-gradient-to-b from-[#f8fafc] via-white to-[#f8fafc] py-12 md:py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a43f]/30 to-transparent" aria-hidden />
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex min-w-0 flex-col"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#c6a43f]">
                Why Choose Us
              </span>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#081120] md:text-4xl md:leading-tight">
                Why Choose Property Vision?
              </h2>

              <div className="mt-5 space-y-3 md:mt-6">
                {[
                  { title: 'Trust & Transparency', desc: '100% verified documents, no hidden charges' },
                  { title: 'Verified Listings', desc: 'Every property RERA-approved & inspected' },
                  { title: 'Local Expertise', desc: '10+ years serving local communities' },
                  { title: 'Fast Response', desc: 'Guaranteed reply within 1 hour' },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 2 }}
                    className="flex gap-3.5 rounded-xl border border-[#081120]/[0.08] border-l-[3px] border-l-[#c6a43f] bg-white px-4 py-3.5 shadow-sm shadow-[#081120]/[0.04] transition-shadow hover:shadow-md hover:shadow-[#081120]/[0.06]"
                  >
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#b8941f]" strokeWidth={2} aria-hidden />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#0a2540]">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-5"
            >
              <div className="overflow-hidden rounded-2xl ring-2 ring-[#c6a43f]/25 ring-offset-2 ring-offset-[#f8fafc] shadow-xl shadow-[#081120]/12">
                <img
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
                  alt="Professional consultation"
                  className="h-[min(380px,48vh)] w-full object-cover sm:h-[400px] md:h-[420px]"
                />
              </div>
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0a2540] bg-transparent px-5 py-3 text-sm font-semibold text-[#081120] shadow-sm transition-colors hover:border-[#c6a43f] hover:text-[#0a2540] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c6a43f]/40 sm:w-auto sm:self-end"
              >
                <MessageCircle className="h-4 w-4 text-[#b8941f]" strokeWidth={2} aria-hidden />
                Speak with our team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROPERTIES ===== */}
      {featuredProperties.length > 0 && (
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-[#c6a43f]">
                Featured Properties
              </span>
              <h2 className="mb-4 mt-3 font-serif text-3xl font-bold text-[#0a2540] md:text-4xl">
                Premium Investment Opportunities
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Handpicked properties in high-growth locations across Andhra Pradesh.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property, i) => (
                <PropertyCard key={property.id} property={property} index={i} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#c6a43f] px-6 py-3 font-semibold text-[#0a2540] transition-all hover:bg-[#c6a43f] hover:text-white"
              >
                View All Properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===== CONSULTATION / LEAD FORM ===== */}
      <section className="relative bg-gradient-to-br from-[#081120] to-[#0a2540] py-12 pb-16 lg:py-16 lg:pb-20">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c6a43f]/30 to-transparent" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white lg:max-w-xl lg:pr-2"
            >
              <span className="mb-4 inline-block rounded-full border-2 border-[#c6a43f] bg-[#081120]/40 px-3 py-1.5 text-xs font-semibold tracking-wide text-white">
                Limited Time Offer
              </span>
              <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight md:text-4xl md:leading-tight">
                Get Free Expert Consultation
              </h2>
              <p className="mb-6 text-base leading-relaxed text-white/90 md:text-lg">
                Speak with our certified real estate experts and get personalized guidance — completely free, no obligation.
              </p>

              <ul className="mb-6 space-y-3">
                {[
                  'Expert advice from certified professionals',
                  'Quick response within 1 hour',
                  'No obligation — completely free',
                  'Access to exclusive off-market listings',
                  '100% data secure & encrypted',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[15px] leading-snug">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c6a43f]" strokeWidth={2} aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-4 sm:justify-start sm:gap-8">
                <div className="text-center sm:text-left">
                  <div className="font-serif text-2xl font-bold tabular-nums text-[#c6a43f] md:text-3xl">4.9/5</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/60">from 2000+ clients</div>
                </div>
                <div className="hidden h-10 w-px bg-gradient-to-b from-transparent via-[#c6a43f]/40 to-transparent sm:block" />
                <div className="text-center sm:text-left">
                  <div className="font-serif text-2xl font-bold tabular-nums text-[#c6a43f] md:text-3xl">1,200+</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/60">Properties sold</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative pb-2 sm:pb-3"
            >
              <div className="relative">
                <div className="rounded-2xl border border-[#081120]/10 bg-white p-6 shadow-xl shadow-[#081120]/12 sm:p-7">
                  <h3 className="mb-5 font-serif text-xl font-bold text-[#081120]">Request a Callback</h3>
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={leadForm.email}
                        onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="you@example.com"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={leadForm.whatsappOptIn}
                        onChange={(e) => setLeadForm({ ...leadForm, whatsappOptIn: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#b8941f] focus:ring-2 focus:ring-[#c6a43f]/35 focus:ring-offset-0"
                      />
                      I agree to receive property updates on WhatsApp
                    </label>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="w-full rounded-xl bg-gradient-to-r from-[#081120] via-[#0a2540] to-[#c6a43f] py-3.5 text-base font-bold text-white shadow-lg shadow-[#081120]/25 transition-all hover:brightness-[1.02] disabled:opacity-50"
                    >
                      {formStatus === 'submitting' ? 'Submitting...' : 'Get Free Consultation'}
                    </motion.button>
                    {formStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 rounded-xl border border-[#c6a43f]/35 bg-[#c6a43f]/10 p-4 text-center text-[#081120]"
                      >
                        <CheckCircle className="h-5 w-5 shrink-0 text-[#b8941f]" aria-hidden />
                        <span className="text-sm font-medium">Thank you — our expert will contact you within one hour.</span>
                      </motion.div>
                    )}
                    <p className="text-center text-xs text-gray-500">No spam. Unsubscribe anytime. We respect your privacy.</p>
                  </form>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-1 -right-1 z-20 flex max-w-[calc(100%-0.5rem)] items-center gap-1.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] px-3 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:shadow-[0_0_24px_rgba(37,211,102,0.45)] sm:-bottom-2 sm:-right-2 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
                  <span className="truncate">Join Our Community</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-90 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-[#c6a43f]">
              Client Stories
            </span>
            <h2 className="mb-4 mt-3 font-serif text-3xl font-bold text-[#081120] md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Real experiences from people who trusted us with their property dreams.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {[
              { name: 'Rajesh Kumar', role: 'Home Buyer', location: 'Vijayawada', content: 'Property Vision helped me find my dream plot near ORR. Their team was professional and guided me through every step. Highly recommended!', rating: 5, initials: 'RK' },
              { name: 'Priya Sharma', role: 'Property Investor', location: 'Hyderabad', content: "Excellent investment advisory service. They helped me identify high-growth areas and I've already seen 30% appreciation in 1 year.", rating: 5, initials: 'PS' },
              { name: 'Venkata Reddy', role: 'Villa Owner', location: 'Amaravati', content: 'Sold my villa through Property Vision. They got me the best price and handled all the paperwork smoothly. Very satisfied!', rating: 5, initials: 'VR' },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="mb-6 italic text-gray-700">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#c6a43f] to-[#f0c14b] font-bold text-[#081120]">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#081120]">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <PromotionalPopup />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
