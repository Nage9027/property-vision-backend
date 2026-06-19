import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ShieldCheck, FileText, MapPin, HeadphonesIcon, ArrowRight, Phone, Mail,
  Star, Award, Briefcase, CheckCircle2, Building2, Users, Clock, TrendingUp,
  Sparkles, ChevronRight, Quote, Play,
} from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { fadeUp, fadeIn, lineGrow, staggerContainer, staggerFast, floatAnimation, fadeDown, pageLoadVariants } from '@/config/animations';

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '', prefix = '', startDelay = 0 }: { value: number; suffix?: string; prefix?: string; startDelay?: number }) {
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
        <CountUp start={0} end={value} duration={3} suffix={suffix} prefix={prefix} useEasing={false} />
      ) : `0${suffix}`}
    </span>
  );
}

/* ─── Badge Component ─── */
function SectionBadge({ text }: { text: string }) {
  return (
    <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
      {text}
    </motion.span>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ badge, title, subtitle }: { badge: string; title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="mb-16 text-center"
    >
      <SectionBadge text={badge} />
      <motion.h2 variants={fadeUp} className="mb-4 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-5xl">
        {title}
      </motion.h2>
      {subtitle && <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-gray-500">{subtitle}</motion.p>}
    </motion.div>
  );
}

/* ─── Timeline Dot ─── */
function TimelineDot({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
        active ? 'border-[#c6a43f] bg-[#c6a43f]' : 'border-slate-200 bg-white'
      }`}>
        <div className={`h-3 w-3 rounded-full ${active ? 'bg-white' : 'bg-[#c6a43f]/40'}`} />
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const timeline = [
    { year: '2010', title: 'Property Vision Founded', desc: 'Founded by Anil Kumar Bekkam with a vision for transparent real estate.', active: true },
    { year: '2015', title: '100+ Successful Projects', desc: 'Crossed 100 successful transactions across Vijayawada and Guntur.', active: true },
    { year: '2018', title: 'Expansion into Telangana', desc: 'Opened Hyderabad office, expanding into the Telangana market.', active: true },
    { year: '2022', title: '1000+ Happy Families', desc: 'Served over 1000 families with verified properties and end-to-end support.', active: true },
    { year: '2025', title: 'Leading Brand in AP & TG', desc: 'Recognised as one of the most trusted real estate brands in the region.', active: true },
  ];

  const whyItems = [
    { icon: ShieldCheck, title: 'Verified Properties', desc: 'Every property undergoes thorough legal and documentation verification before listing.' },
    { icon: FileText, title: 'Legal Documentation Support', desc: 'Complete assistance with title checks, RERA verification, and legal paperwork.' },
    { icon: MapPin, title: 'Guided Site Visits', desc: 'Expert-led site visits with detailed insights on location, infrastructure, and growth potential.' },
    { icon: TrendingUp, title: 'Investment Advisory', desc: 'Data-driven investment advice based on market trends, appreciation potential, and ROI analysis.' },
    { icon: Users, title: 'Customer Success', desc: 'Dedicated relationship managers ensuring a smooth journey from search to possession.' },
    { icon: HeadphonesIcon, title: 'End-to-End Assistance', desc: 'From property selection to registration and post-sale support — we handle everything.' },
  ];

  const processSteps = [
    { num: '01', title: 'Understand', desc: 'Deep-dive into your requirements, budget, and lifestyle preferences.' },
    { num: '02', title: 'Curate', desc: 'Handpicked property options that match your exact needs.' },
    { num: '03', title: 'Verify', desc: 'Complete legal, documentation, and technical due diligence.' },
    { num: '04', title: 'Close', desc: 'Hassle-free registration, loan assistance, and handover support.' },
  ];

  const locations = [
    { name: 'Hyderabad', type: 'Metro', projects: '200+', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Vijayawada', type: 'Headquarters', projects: '500+', color: 'from-[#c6a43f] to-[#d4a937]' },
    { name: 'Guntur', type: 'City', projects: '300+', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Amaravati', type: 'Capital Region', projects: '150+', color: 'from-[#c6a43f] to-[#d4a937]' },
    { name: 'Khammam', type: 'City', projects: '80+', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Warangal', type: 'City', projects: '60+', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Nalgonda', type: 'City', projects: '40+', color: 'from-emerald-500 to-emerald-600' },
  ];

  const testimonials = [
    {
      name: 'Suresh Reddy', location: 'Jubilee Hills, Hyderabad', type: 'Land Venture', year: '2021', return: '220% ROI in 4 years',
      text: "Invested in a plotted development through Property Vision and watched my land value triple. Their market insights and legal diligence gave me complete confidence as a first-time land investor.",
      rating: 5,
    },
    {
      name: 'Meera Agarwal', location: 'Gachibowli, Hyderabad', type: 'Premium Villa', year: '2022', return: '175% ROI in 3 years',
      text: "Property Vision identified a hidden gem in a growing corridor. The end-to-end support — from site selection to property registration — made it a truly rewarding investment experience.",
      rating: 5,
    },
    {
      name: 'Venkateswara Rao', location: 'Vijayawada', type: 'Plotted Development', year: '2020', return: '310% ROI in 5 years',
      text: "As an NRI investor, I needed a partner I could trust blindly. Property Vision managed everything — site visits via video, digital documentation, and post-purchase support. My best investment decision.",
      rating: 5,
    },
  ];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <AppLayout>
      <article className="bg-white">
        {/* ════════════════════════════════════════
            SECTION 1 — CINEMATIC HERO (CENTERED)
        ════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a2540] to-[#0d2a4a]" />
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
              alt=""
              className="h-full w-full object-cover opacity-50"
            />
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

          <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: heroOpacity }}>
            <div className="container mx-auto px-6 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="mx-auto max-w-5xl text-center"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
                >
                  <Award className="h-3 w-3 text-[#c6a43f]" />
                  Premium Investment Partner Since 2007
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 font-serif text-[42px] font-black leading-[1.1] tracking-tight text-white lg:text-[56px] xl:text-[72px]"
                >
                  Building Wealth Through{' '}
                  <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    Premium Land Ventures
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/70 lg:text-lg"
                >
                  The most trusted investment partner for land ventures across Andhra Pradesh and Telangana — delivering wealth creation through verified approvals, transparent transactions, and exceptional post-investment support.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2"
                >
                  {[
                    { icon: CheckCircle2, text: 'Verified Properties' },
                    { icon: FileText, text: 'Legal Documentation' },
                    { icon: MapPin, text: 'Guided Site Visits' },
                    { icon: ShieldCheck, text: 'Investment Advisory' },
                  ].map((item) => (
                    <span key={item.text} className="flex items-center gap-1.5 text-xs text-white/50">
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
                  <Link to="/properties">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-6 py-2.5 text-sm font-bold text-[#020617] shadow-lg shadow-[#c6a43f]/20 transition-all hover:shadow-xl hover:shadow-[#c6a43f]/30"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Explore Properties
                      </span>
                      <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </motion.button>
                  </Link>
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Schedule Consultation
                      </span>
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-6 py-2.5 text-sm font-medium text-emerald-300 backdrop-blur-sm transition-all hover:bg-emerald-500/[0.1]"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      Watch Our Story
                    </span>
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-8 flex flex-wrap justify-center gap-2 lg:gap-3"
                >
                  {[
                    { icon: Star, label: '4.9 Rating', accent: 'text-amber-400' },
                    { icon: Building2, label: '1200+ Properties', accent: 'text-emerald-400' },
                    { icon: Users, label: '1000+ Clients', accent: 'text-amber-400' },
                    { icon: Clock, label: '10+ Years', accent: 'text-emerald-400' },
                    { icon: ShieldCheck, label: '100% Verified', accent: 'text-amber-400' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.span
                        key={item.label}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1 + i * 0.06, type: 'spring', stiffness: 120, damping: 12 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-white/60 backdrop-blur-md lg:gap-2 lg:px-4 lg:py-2 lg:text-sm"
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
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — COMPANY JOURNEY TIMELINE
        ════════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="relative overflow-hidden bg-[#f8fafc] py-24"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Our Journey & Success Stories"
              title="The Property Vision Story"
              subtitle="From a vision to a trusted investment partner — our journey of creating wealth through premium land ventures"
            />

            <div className="relative mx-auto max-w-3xl">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={lineGrow}
                className="absolute left-[19px] top-0 h-full w-0.5 origin-top bg-gradient-to-b from-[#c6a43f] via-emerald-400 to-[#c6a43f]/20"
              />

              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative mb-10 ml-12 last:mb-0"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute -left-[37px] top-1"
                  >
                    <TimelineDot active={item.active} />
                  </motion.div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[#c6a43f]/10 px-3 py-1 text-xs font-medium text-[#c6a43f]">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-[#0a2540]">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 3 — FOUNDER MESSAGE ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="bg-white py-24"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-[#c6a43f]/20 via-white/5 to-emerald-500/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-2xl">
                  <img
                    src="/assets/images/logo.png"
                    alt="Anil Kumar Bekkam"
                    className="h-[500px] w-full object-cover lg:h-[600px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-sm">
                      <Award className="h-3.5 w-3.5 text-[#c6a43f]" />
                      15+ Years Experience
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <SectionBadge text="Founder Message" />

                <div className="relative">
                  <Quote className="absolute -left-2 -top-2 h-12 w-12 text-[#c6a43f]/20" />
                  <p className="pl-8 font-serif text-2xl font-bold italic leading-relaxed text-[#0a2540] lg:text-3xl">
                    "We don't sell land. We build futures."
                  </p>
                </div>

                <p className="text-lg leading-relaxed text-gray-600">
                  Property Vision was founded with a vision to bring transparency, trust, and professionalism into real estate. Every project is verified, every customer is valued, and every investment is treated with responsibility.
                </p>

                <p className="text-lg leading-relaxed text-gray-600">
                  Over the past decade, we have grown from a small office in Vijayawada to a trusted brand serving hundreds of families across Andhra Pradesh and Telangana. Our commitment remains simple — put the client first, always.
                </p>

                <div className="border-l-4 border-[#c6a43f] bg-[#f8fafc] p-6 rounded-r-2xl">
                  <p className="text-xl font-bold text-[#0a2540]">Anil Kumar Bekkam</p>
                  <p className="text-sm text-gray-500">Founder & CEO, Property Vision</p>
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerFast}
                  className="flex items-center gap-6 text-sm text-gray-500"
                >
                  <motion.div variants={fadeUp} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    15+ Years Experience
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    1000+ Families Served
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 4 — LEADERSHIP TEAM ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="bg-white py-24"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-16 text-center"
            >
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                Leadership Team
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-4 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-5xl">
                Meet Our Leadership
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-gray-500">
                Meet the professionals driving Property Vision's growth, customer success, and market leadership across Andhra Pradesh and Telangana.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"
            >
              {[
                {
                  img: '/assets/Anil.JPEG',
                  name: 'Anil Kumar Bekkam',
                  title: 'Founder & CEO',
                  desc: 'Founded Property Vision with a vision for transparent, trustworthy real estate. Over 15 years of experience building a brand that puts clients first across Andhra Pradesh and Telangana.',
                  badge: 'Founder & CEO',
                  icon: Award,
                },
                {
                  img: '/assets/Satynarayana.PNG',
                  name: 'Satyanarayana Polisetty',
                  title: 'Director & Head of Sales',
                  desc: 'Drives partnerships, brand direction, and high-value client relationships with a strong focus on long-term trust and quality service. Leads the sales team with exceptional market expertise.',
                  badge: 'Director & Head of Sales',
                  icon: Building2,
                },
              ].map((leader, i) => (
                <motion.div
                  key={leader.name}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className="group relative"
                >
                  <div className="absolute -inset-[2px] rounded-[2rem] bg-gradient-to-r from-[#c6a43f]/30 via-emerald-500/20 to-[#c6a43f]/30 opacity-0 blur-md transition-opacity duration-700 group-hover:opacity-100" />

                  <div className="relative rounded-[2rem] border border-slate-100/80 bg-white/90 p-8 text-center shadow-sm backdrop-blur-xl transition-all duration-500 group-hover:border-transparent group-hover:shadow-2xl lg:p-10">
                    <div className="relative mx-auto mb-6 h-36 w-36 lg:h-44 lg:w-44">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#c6a43f] via-emerald-400 to-[#c6a43f] p-[3px]">
                        <div className="h-full w-full rounded-full bg-white" />
                      </div>
                      <motion.img
                        src={leader.img}
                        alt={leader.name}
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] rounded-full object-cover"
                      />
                      <motion.div
                        animate={{ y: [0, -4, 0], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                        className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/30 lg:h-12 lg:w-12"
                      >
                        <leader.icon className="h-5 w-5 text-white lg:h-6 lg:w-6" />
                      </motion.div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#0a2540] lg:text-2xl">{leader.name}</h3>
                    <p className="mt-1 text-sm font-medium text-[#c6a43f]">{leader.title}</p>

                    <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#c6a43f]/40 to-transparent" />

                    <p className="mt-4 text-sm leading-relaxed text-gray-500">{leader.desc}</p>

                    <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-[#c6a43f]/15 bg-[#c6a43f]/5 px-4 py-2 text-xs font-medium text-[#c6a43f]">
                      <leader.icon className="h-3.5 w-3.5" />
                      {leader.badge}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ===== SECTION 5 — WHY PROPERTY VISION ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="relative overflow-hidden bg-[#f8fafc] py-24"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Why Property Vision"
              title="Built Different. Built Better."
              subtitle="What sets us apart in the real estate landscape"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {whyItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white bg-gradient-to-br from-white to-[#f8fafc] p-8 shadow-sm transition-all duration-500 hover:border-[#c6a43f]/20 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#c6a43f]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#c6a43f]/10 text-[#c6a43f]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-[#0a2540]">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* ===== SECTION 6 — NUMBERS THAT SPEAK VOLUMES ===== */}
        <section className="relative overflow-hidden bg-[#f8fafc] py-16">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f8fafc] to-white" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-10 text-center"
            >
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-[#c6a43f]/20 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                Trust Metrics
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-3 mt-4 font-serif text-3xl font-bold text-[#0a2540] lg:text-4xl">
                Numbers That Speak Volumes
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-500 lg:text-base">
                A decade of trust, thousands of successful investments, and a growing community of satisfied property owners.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative mx-auto max-w-7xl"
            >
              <div className="relative rounded-[2rem] border border-white/20 bg-white/70 p-6 shadow-2xl shadow-black/5 backdrop-blur-2xl transition-all duration-700 group-hover:border-white/30 lg:p-8">
                <div className="relative grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
                  {[
                    { value: 10, suffix: '+', label: 'Years Experience', icon: Award, gradient: 'from-[#c6a43f] to-amber-400' },
                    { value: 1200, suffix: '+', label: 'Properties Sold', icon: Building2, gradient: 'from-emerald-400 to-emerald-500' },
                    { value: 1000, suffix: '+', label: 'Happy Clients', icon: Users, gradient: 'from-[#c6a43f] to-amber-400' },
                    { value: 100, suffix: '%', label: 'Verified Properties', icon: ShieldCheck, gradient: 'from-emerald-400 to-emerald-500' },
                    { value: 50, suffix: '+', label: 'Locations Covered', icon: MapPin, gradient: 'from-[#c6a43f] to-amber-400' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        className="relative px-4 py-5 text-center sm:px-6 sm:py-6 lg:px-8"
                      >
                        <div className="relative">
                          <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 + 0.25, type: 'spring', stiffness: 180 }}
                            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transition-all duration-500 group-hover/stat:scale-110 lg:h-14 lg:w-14`}
                          >
                            <Icon className="h-5 w-5 text-white lg:h-6 lg:w-6" />
                          </motion.div>

                          <p className="font-serif text-[36px] font-extrabold leading-none tracking-tight lg:text-[44px] xl:text-[52px]">
                            <span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                              <AnimatedCounter value={stat.value} suffix={stat.suffix} startDelay={i * 0.08 + 0.3} />
                            </span>
                          </p>

                          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 transition-colors duration-300 group-hover/stat:text-slate-600 lg:text-xs">
                            {stat.label}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 7 — OUR PROCESS ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="relative overflow-hidden bg-[#f8fafc] py-24"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Our Process"
              title="A Seamless Journey to Your New Home"
              subtitle="We make property investment simple, transparent, and stress-free"
            />

            <div className="relative mx-auto max-w-5xl">
              <motion.div
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute left-0 right-0 top-1/2 hidden h-0.5 bg-gradient-to-r from-transparent via-[#c6a43f]/35 to-transparent md:block"
              />

              <div className="grid gap-8 md:grid-cols-4 md:gap-6">
                {processSteps.map((step, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="group relative"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.15 + 0.2, type: 'spring', stiffness: 200 }}
                      className="relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c6a43f] bg-white text-2xl font-bold text-[#c6a43f] shadow-[0_0_20px_rgba(198,164,63,0.2)] transition-colors group-hover:bg-[#c6a43f] group-hover:text-white"
                    >
                      {step.num}
                    </motion.div>
                    <div className="text-center">
                      <h3 className="mb-2 text-xl font-bold text-[#0a2540]">{step.title}</h3>
                      <p className="text-sm text-gray-500">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 8 — MARKET PRESENCE ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="bg-white py-24"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Market Presence"
              title="Our Footprint Across AP & Telangana"
              subtitle="Deep roots and strong presence in key real estate markets"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12 overflow-hidden rounded-3xl border border-slate-100 shadow-xl"
            >
              <div className="relative h-[300px] bg-gradient-to-br from-[#0a2540] via-[#0d2a4a] to-[#0f3058] lg:h-[400px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <MapPin className="mx-auto h-12 w-12 text-[#c6a43f]/60" />
                    </motion.div>
                    <p className="mt-4 font-serif text-2xl font-bold text-white/80">Andhra Pradesh & Telangana</p>
                    <p className="mt-2 text-sm text-white/40">7 Cities · 50+ Locations · 1200+ Properties</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7"
            >
              {locations.map((loc) => (
                <motion.div
                  key={loc.name}
                  variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-md"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${loc.color}`} />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c6a43f]/10 text-[#c6a43f]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0a2540]">{loc.name}</p>
                      <p className="text-xs text-gray-400">{loc.type} · {loc.projects} projects</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ===== SECTION 9 — TESTIMONIALS ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="relative overflow-hidden bg-[#f8fafc] py-24"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Investor Success Stories"
              title="What Our Investors Say"
              subtitle="Real success stories from investors who built wealth through Property Vision"
            />

            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:p-8"
                >
                  <div className="absolute right-5 top-5 text-[#c6a43f]/25">
                    <Quote className="h-10 w-10" />
                  </div>

                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-[#c6a43f]" />
                    ))}
                  </div>

                  <p className="mb-6 text-lg italic leading-relaxed text-gray-700 lg:mb-8">"{t.text}"</p>

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
                      <div className="mt-1 text-xs font-bold text-emerald-600">{t.return}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SECTION 10 — FINAL CTA ===== */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeIn}
          className="relative overflow-hidden bg-[#0a2540] py-24"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#0d2a4a] to-[#0f3058]" />
          <div className="container relative z-10 mx-auto px-4 text-center lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mx-auto max-w-3xl"
            >
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2 text-sm font-medium text-emerald-400">
                <Sparkles className="h-4 w-4" />
                Start Your Journey Today
              </motion.span>

              <motion.h2 variants={fadeUp} className="mt-6 font-serif text-4xl font-black text-white lg:text-6xl">
                Ready to Build Your{' '}
                <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                  Future?
                </span>
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-400">
                Join thousands of satisfied families who found their dream property with Property Vision.
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
                <Link to="/properties">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      Explore Properties
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </motion.button>
                </Link>
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
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerFast}
                className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-400"
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