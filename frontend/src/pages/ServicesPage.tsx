import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  Shield,
  ShieldCheck,
  FileCheck,
  HeadphonesIcon,
  Building2,
  Award,
  Users,
  Globe,
  Sparkles,
  ChevronDown,
  TrendingUp,
  Heart,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fadeUp, fadeIn, staggerContainer, staggerFast, floatAnimation, fadeDown, pageLoadVariants } from '@/config/animations';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';

const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(212, 175, 55, 0.3)',
      '0 0 40px rgba(212, 175, 55, 0.6)',
      '0 0 20px rgba(212, 175, 55, 0.3)',
    ],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: 'easeInOut' as const,
    },
  },
};

export function ServicesPage() {
  const services = [
    {
      title: 'Land Venture Investment',
      description: 'Curated plotted developments in high-growth corridors with verified approvals, clear titles, and exceptional ROI potential.',
      outcomes: ['Prime land parcels', 'CRDA/DTCP approved', 'Clear title guarantee', 'Infrastructure insights'],
      href: '/properties?type=plot',
      icon: 'MapPin',
    },
    {
      title: 'Portfolio Diversification',
      description: 'Strategic land portfolio building across multiple growth corridors to maximize returns and minimize risk.',
      outcomes: ['Multi-location holdings', 'Risk diversification', 'Capital appreciation', 'Exit strategy planning'],
      href: '/services#diversification',
      icon: 'Globe',
    },
    {
      title: 'NRI Investment Services',
      description: 'End-to-end investment management for NRIs — from remote site selection through digital documentation and post-purchase support.',
      outcomes: ['Virtual site tours', 'Digital documentation', 'Power of attorney', 'Tax advisory support'],
      href: '/services#nri',
      icon: 'Users',
    },
    {
      title: 'Investment Advisory',
      description: 'Data-driven guidance backed by deep market research, growth corridor analysis, and infrastructure development tracking.',
      outcomes: ['Market analysis', 'Growth forecasting', 'Portfolio planning', 'Exit timing advice'],
      href: '/services#investment',
      icon: 'Sparkles',
    },
    {
      title: 'Legal Due Diligence',
      description: 'Comprehensive legal verification covering title deeds, encumbrance certificates, RERA compliance, and land use approvals.',
      outcomes: ['Title verification', 'RERA compliance', 'Land use approval', 'Mutation & registration'],
      href: '/services#legal',
      icon: 'Shield',
    },
    {
      title: 'Site Visit & Evaluation',
      description: 'Expert-guided property tours with detailed site evaluation, neighborhood analysis, and investment potential assessment.',
      outcomes: ['Scheduled visits', 'Neighborhood analysis', 'Comparison reports', 'Infrastructure mapping'],
      href: '/site-visits',
      icon: 'Calendar',
    },
    {
      title: 'Loan & Finance Assistance',
      description: 'Hassle-free financing support with pre-approved land loans, competitive interest rates, and fast disbursal.',
      outcomes: ['Land loans', 'Home loans', 'Balance transfer', 'Documentation support'],
      href: '/services#finance',
      icon: 'Clock',
    },
    {
      title: 'Post-Investment Support',
      description: 'Lifetime support after your investment — property management, renovation coordination, and future resale assistance.',
      outcomes: ['Property management', 'Renovation support', 'Resale assistance', 'Legal advisory'],
      href: '/services#support',
      icon: 'CheckCircle',
    },
  ];

  const timelineSteps = [
    {
      step: '01',
      title: 'Investment Consultation',
      description: 'Deep-dive into your investment goals, budget, and growth corridor preferences.',
    },
    {
      step: '02',
      title: 'Venture Selection',
      description: 'Handpicked land ventures matching your ROI expectations and risk profile.',
    },
    {
      step: '03',
      title: 'Site Evaluation',
      description: 'Expert-led site visits with infrastructure analysis and growth projection reports.',
    },
    {
      step: '04',
      title: 'Due Diligence',
      description: 'Complete legal verification — title deeds, approvals, encumbrance, and land use.',
    },
    {
      step: '05',
      title: 'Investment Execution',
      description: 'Seamless registration, documentation, and payment processing.',
    },
    {
      step: '06',
      title: 'Post-Investment Growth',
      description: 'Lifetime support — property management, renovation, and resale assistance.',
    },
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Zero Hidden Costs',
      description: 'Complete transparency in pricing, fees, and timelines — no surprises at any stage.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Growth Corridor Expertise',
      description: 'Deep knowledge of high-growth micro-markets across Andhra Pradesh and Telangana.',
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Verified Approvals Guarantee',
      description: 'Every land venture is legally screened for clear titles, RERA compliance, and land use approvals.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Lifetime Investor Partnership',
      description: 'We stay with you long after the investment — support, advisory, and resale assistance for life.',
    },
  ];

  const locations = [
    { name: 'Vijayawada', active: true },
    { name: 'Amaravati', active: true },
    { name: 'Hyderabad', active: true },
    { name: 'Guntur', active: true },
    { name: 'Visakhapatnam', active: false },
  ];

  const serviceCommitmentItems = [
    {
      title: 'Documentation you can track',
      body: 'Timelines, checklists, and updates in plain language—no last-minute surprises at registration.',
    },
    {
      title: 'Verification-first listings',
      body: 'Titles and key approvals reviewed before we recommend a property, with RERA awareness baked in.',
    },
    {
      title: 'AP & Telangana corridor expertise',
      body: 'Honest yield and growth context for Vijayawada, Amaravati, Hyderabad, Guntur, and emerging belts.',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden py-24 md:py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80"
            alt="Aerial farm landscape"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#081120]/90 via-[#0a2540]/85 to-[#0d2a4a]/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081120]/60 via-transparent to-black/30" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.span
              variants={glowPulse}
              animate="animate"
              className="inline-flex items-center gap-2 rounded-full border border-[#c6a43f]/40 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-[#c6a43f]" />
              Premium Land Investment Partner Since 2007
            </motion.span>

            <h1 className="mb-3 mt-6 font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-5xl">
              Investment Services
            </h1>
            <h2 className="bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] bg-clip-text font-serif text-2xl font-bold text-transparent md:text-3xl lg:text-4xl">
              Build Wealth Through Premium Land Ventures
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              From identifying high-growth land parcels to complete post-investment support, Property Vision delivers end-to-end investment solutions across Andhra Pradesh and Telangana.
            </p>

            <motion.div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-8 py-4 text-lg font-bold text-[#020617] shadow-lg transition-all hover:shadow-[0_0_30px_rgba(198,164,63,0.4)]"
                >
                  Book Free Consultation
                  <ArrowRight className="ml-2 inline h-5 w-5" />
                </motion.button>
              </Link>
              <Link to="/properties">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Explore Active Ventures
                </motion.button>
              </Link>
            </motion.div>

            <motion.div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { label: 'Zero Brokerage Direct Deals', icon: 'ShieldCheck' },
                { label: 'Clear Title Guarantee', icon: 'FileCheck' },
                { label: 'End-to-End Investment Support', icon: 'Headphones' },
              ].map((item) => (
                <motion.span
                  key={item.label}
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md"
                >
                  <ShieldCheck className="h-4 w-4 text-[#c6a43f]" />
                  {item.label}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== INVESTMENT PERFORMANCE SECTION ===== */}
      <section className="border-b border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="mb-10 text-center"
          >
            <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
              Investment Performance
            </motion.span>
            <motion.h2 variants={fadeUp} className="mb-2 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
              Numbers That Matter
            </motion.h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              { icon: <Award className="h-5 w-5" />, value: '₹500 Cr+', label: 'Transaction Value', sub: 'Total land venture sales facilitated' },
              { icon: <Building2 className="h-5 w-5" />, value: '1200+', label: 'Plots Sold', sub: 'Across 6 cities in AP & Telangana' },
              { icon: <Heart className="h-5 w-5" />, value: '95%', label: 'Client Retention', sub: 'Repeat investors & referrals' },
              { icon: <TrendingUp className="h-5 w-5" />, value: '10+', label: 'Years Experience', sub: 'Since 2007 in land investments' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-lg"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c6a43f]/10 text-[#c6a43f]">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-[#0a2540]">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{stat.label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CORE SERVICES SECTION ===== */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="text-center mb-7 md:mb-8"
          >
            <span className="inline-block px-3 py-1.5 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium mb-2">
              Core Services
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#081120] mb-2">
              Comprehensive Investment Solutions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              End-to-end services for the savvy land investor
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group relative flex h-full min-h-0 flex-col rounded-3xl border border-gray-100 bg-white p-5 sm:p-6 shadow-lg transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-[#d4af37]/20 to-[#f0c14b]/20 opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative z-10 flex h-full min-h-0 flex-col">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a43f]/15 to-[#f0c14b]/5 shadow-sm">
                    {service.icon === 'MapPin' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <rect x="8" y="18" width="32" height="22" rx="2" fill="#c6a43f" opacity="0.2" />
                        <rect x="12" y="22" width="8" height="6" rx="1" fill="#c6a43f" />
                        <rect x="22" y="22" width="8" height="6" rx="1" fill="#c6a43f" />
                        <rect x="32" y="22" width="6" height="6" rx="1" fill="#c6a43f" />
                        <rect x="12" y="30" width="6" height="8" rx="1" fill="#c6a43f" />
                        <rect x="20" y="30" width="6" height="8" rx="1" fill="#c6a43f" />
                        <rect x="28" y="30" width="10" height="8" rx="1" fill="#c6a43f" />
                        <path d="M24 6 L24 14 M18 10 L24 14 L30 10" stroke="#c6a43f" strokeWidth="2" fill="none" />
                        <circle cx="24" cy="6" r="2" fill="#c6a43f" />
                      </svg>
                    )}
                    {service.icon === 'Globe' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <circle cx="24" cy="24" r="16" fill="#c6a43f" opacity="0.15" />
                        <path d="M8 24h32M16 12c-2 4-3 8-3 12s1 8 3 12M32 12c2 4 3 8 3 12s-1 8-3 12" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                        <circle cx="24" cy="24" r="16" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                        <path d="M24 8c2.5 3 4 7 4 12s-1.5 9-4 12" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                        <circle cx="32" cy="16" r="7" fill="#c6a43f" opacity="0.15" stroke="#c6a43f" strokeWidth="1" />
                        <text x="32" y="19" textAnchor="middle" fontSize="8" fill="#c6a43f" fontWeight="bold">$</text>
                      </svg>
                    )}
                    {service.icon === 'Users' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <circle cx="16" cy="16" r="6" fill="#c6a43f" opacity="0.15" stroke="#c6a43f" strokeWidth="1.5" />
                        <circle cx="34" cy="16" r="6" fill="#c6a43f" opacity="0.15" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M6 38c0-6 4-11 10-11h2c3 0 5.6 1.5 7 3.7" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                        <path d="M44 38c0-6-4-11-10-11h-2c-3 0-5.6 1.5-7 3.7" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                        <path d="M24 27c-6 0-10 4.5-10 11h20c0-6.5-4-11-10-11z" fill="#c6a43f" opacity="0.1" stroke="#c6a43f" strokeWidth="1" />
                        <circle cx="24" cy="16" r="5" fill="#c6a43f" opacity="0.15" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M30 10c0-3.3-2.7-6-6-6s-6 2.7-6 6" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                      </svg>
                    )}
                    {service.icon === 'Sparkles' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <rect x="6" y="20" width="36" height="22" rx="3" fill="#c6a43f" opacity="0.1" stroke="#c6a43f" strokeWidth="1.2" />
                        <path d="M14 26v10M22 26v10M30 26v10" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M10 31h34" stroke="#c6a43f" strokeWidth="1" opacity="0.3" />
                        <path d="M24 6 l1 3 l3 1 l-3 1 l-1 3 l-1-3 l-3-1 l3-1 z" fill="#c6a43f" />
                        <path d="M14 10 l1 2 l2 1 l-2 1 l-1 2 l-1-2 l-2-1 l2-1 z" fill="#c6a43f" opacity="0.6" />
                        <path d="M34 9 l1 2 l2 1 l-2 1 l-1 2 l-1-2 l-2-1 l2-1 z" fill="#c6a43f" opacity="0.6" />
                      </svg>
                    )}
                    {service.icon === 'Shield' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <path d="M24 4 L6 12 v10 c0 10 7 18 18 22 11-4 18-12 18-22 V12 z" fill="#c6a43f" opacity="0.1" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M24 10 L24 32 M17 20 L24 32 L31 20" stroke="#c6a43f" strokeWidth="1.5" fill="none" />
                        <path d="M16 7 L24 4 L32 7" stroke="#c6a43f" strokeWidth="1" fill="none" opacity="0.5" />
                      </svg>
                    )}
                    {service.icon === 'Calendar' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <rect x="8" y="14" width="32" height="28" rx="3" fill="#c6a43f" opacity="0.1" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M8 22h32" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M16 14V8M32 14V8" stroke="#c6a43f" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="20" cy="30" r="2" fill="#c6a43f" />
                        <circle cx="28" cy="30" r="2" fill="#c6a43f" />
                        <circle cx="24" cy="36" r="2" fill="#c6a43f" />
                      </svg>
                    )}
                    {service.icon === 'Clock' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <circle cx="24" cy="24" r="16" fill="#c6a43f" opacity="0.1" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M24 12v12l8 4" stroke="#c6a43f" strokeWidth="2" fill="none" />
                        <circle cx="24" cy="24" r="2" fill="#c6a43f" />
                        <path d="M16 6c-4 7-6 10-6 16" stroke="#c6a43f" strokeWidth="1" fill="none" opacity="0.4" />
                        <path d="M8 24c0 9 7 16 16 16" stroke="#c6a43f" strokeWidth="1" fill="none" opacity="0.4" />
                      </svg>
                    )}
                    {service.icon === 'CheckCircle' && (
                      <svg viewBox="0 0 48 48" className="h-7 w-7">
                        <circle cx="24" cy="24" r="16" fill="#c6a43f" opacity="0.1" stroke="#c6a43f" strokeWidth="1.5" />
                        <path d="M16 24l6 6 10-10" stroke="#c6a43f" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M24 8c2 0 3.8 0.4 5.5 1" stroke="#c6a43f" strokeWidth="1" fill="none" opacity="0.4" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#081120] mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 flex-shrink-0">{service.description}</p>

                  <ul className="space-y-2 mb-5 flex-1 min-h-0">
                    {service.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-[#c6a43f] flex-shrink-0 mt-0.5" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={service.href}
                    className="mt-auto inline-flex items-center gap-2 text-[#d4af37] font-medium text-sm hover:text-[#b89435] transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== COMMITMENT BAND (trust + CTA) ===== */}
      <section className="border-t border-gray-200/90 bg-white py-11 lg:py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0d9488] mb-2">
              Why Property Vision
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#081120] mb-2">
              Clarity on price, paper, and process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              We combine on-ground experience with transparent communication—so you always know what happens next, from first call to registration.
            </p>
          </motion.div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-48px' }}
            className="mb-9 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 list-none p-0 m-0"
          >
            {serviceCommitmentItems.map((item, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                className="rounded-2xl border border-gray-100 bg-gray-50/90 px-5 py-5 md:px-6 md:py-6 shadow-sm"
              >
                <h3 className="font-semibold text-[#081120] mb-2 text-base">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#081120] to-[#0a2540] px-5 py-5 md:px-8 md:py-6 text-white sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-center text-sm text-white/90 sm:text-left md:text-base">
              Take the next step with a team that prioritizes transparency across Andhra Pradesh and Telangana.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#081120] shadow-md transition hover:bg-gray-100"
              >
                Book consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/917659926345"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW WE WORK TIMELINE ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium mb-4">
              Our Process
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#081120] mb-4">
              How We Work
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our proven investment process ensures a smooth and rewarding journey from selection to returns
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#d4af37]/50 via-[#16a34a]/50 to-transparent" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-12"
            >
              {timelineSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className={`flex flex-col md:flex-row items-start gap-6 ${
                    idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Number */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f0c14b] flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0"
                  >
                    {step.step}
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="flex-1 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all"
                  >
                    <h3 className="text-xl font-bold text-[#081120] mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#d4af37]/10 text-[#d4af37] text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#081120] mb-4">
              Why Investors Choose Property Vision
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#f0c14b]/20 flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-[#081120] mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== COVERAGE LOCATIONS SECTION ===== */}
      <section className="py-20 bg-gradient-to-br from-[#081120] to-[#0a2540]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-4">
              Our Coverage
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Active Across AP & Telangana
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Plus emerging corridors in Guntur, Rajahmundry, and Vizag
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {locations.map((location, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                className={`px-6 py-4 rounded-2xl border transition-all ${
                  location.active
                    ? 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:border-[#d4af37]/50 hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${location.active ? 'text-[#16a34a]' : 'text-white/40'}`} />
                  <span className="font-medium">{location.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== PREMIUM CTA BANNER ===== */}
      <section className="bg-gradient-to-br from-[#0a2540] via-[#0d2a4a] to-[#081120] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-3xl border border-[#c6a43f]/20 bg-gradient-to-br from-[#c6a43f]/10 to-transparent p-8 backdrop-blur-md lg:p-12"
          >
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Tell us your investment goals and we will chart the perfect land venture strategy for you.
            </p>
            <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:+919000971317"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-8 py-4 text-lg font-bold text-[#020617] shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(198,164,63,0.4)]"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
              <a
                href="https://wa.me/917659926345"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#c6a43f]/40 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/15"
              >
                <Calendar className="h-5 w-5" />
                Book Site Visit
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#c6a43f]" />
                +91 90009 71317
              </span>
              <span className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[#c6a43f]" />
                Available on WhatsApp
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#c6a43f]" />
                Mon-Sat 9AM-7PM
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <StickyMobileCTA />

      {/* ===== FLOATING WHATSAPP BUTTON ===== */}
      
    </div>
  );
}