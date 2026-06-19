import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import {
  Building2, TrendingUp, MapPin, GraduationCap, Heart, Trees, ArrowRight, Phone,
  Plane, Train, Waypoints, Store, Music, Star, Shield, DollarSign, Clock,
  ChevronRight, ExternalLink, Camera, Play, X, Globe, CheckCircle2, Sparkles,
  AppWindow, Ruler, Compass, Mountain, ChevronDown, Navigation, CircleDot,
} from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { fadeUp, fadeIn, staggerContainer, staggerFast, floatAnimation, fadeDown, pageLoadVariants } from '@/config/animations';

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  return (
    <span ref={ref} className="inline-block tabular-nums">
      {inView ? <CountUp start={0} end={value} duration={2.5} suffix={suffix} prefix={prefix} /> : `0${suffix}`}
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

/* ─── Static City Data ─── */
const cityData = {
  name: 'Vijayawada',
  subtitle: 'Andhra Pradesh\'s premier investment destination with booming infrastructure, IT growth, and strategic location.',
  heroImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600&q=80',
  stats: [
    { value: 240, suffix: '%', label: 'Growth Rate' },
    { value: 15, suffix: 'L+', label: 'Population' },
    { value: 85, suffix: '%', label: 'Literacy Rate' },
    { value: 4.5, suffix: 'Cr', label: 'Avg. Property' },
  ],
  whyCity: [
    { icon: Building2, title: 'Booming IT Corridor', desc: 'Major IT companies setting up campuses along the Vijayawada-Guntur corridor.' },
    { icon: TrendingUp, title: 'Rapid Appreciation', desc: 'Property values have seen 240% appreciation in the last 5 years.' },
    { icon: MapPin, title: 'Strategic Location', desc: 'Central hub connecting Hyderabad, Chennai, and Visakhapatnam.' },
    { icon: GraduationCap, title: 'Educational Hub', desc: 'Home to premier institutions like NIT, SRM, and KL University.' },
    { icon: Heart, title: 'Quality of Life', desc: 'Excellent healthcare, green spaces, and modern amenities.' },
    { icon: Trees, title: 'Green City Initiative', desc: 'Ranked among India\'s top 10 green cities with extensive parks.' },
  ],
  highlights: [
    { icon: Plane, title: 'International Airport', desc: 'Direct flights to major cities' },
    { icon: Train, title: 'Railway Hub', desc: 'South Central Railway headquarters' },
    { icon: Waypoints, title: 'Smart City Mission', desc: '₹2,000 Cr digital infrastructure' },
    { icon: Store, title: 'Retail Boom', desc: '7+ major malls coming up' },
    { icon: Music, title: 'Cultural Capital', desc: 'Rich heritage & festivals' },
    { icon: TrendingUp, title: 'GDP Growth', desc: '12.5% annual growth rate' },
  ],
  hotspots: [
    { name: 'Auto Nagar', growth: '240%', score: 95, types: ['IT Hub', 'Residential'], developments: ['Tech Park', 'Metro Station', 'Expressway'] },
    { name: 'Benz Circle', growth: '210%', score: 92, types: ['Commercial', 'Luxury'], developments: ['Business District', '5-Star Hotels', 'Entertainment Zone'] },
    { name: 'Mogalrajapuram', growth: '185%', score: 88, types: ['Residential', 'Premium'], developments: ['Gated Communities', 'International School'] },
    { name: 'Governorpet', growth: '170%', score: 85, types: ['Heritage', 'Commercial'], developments: ['Smart City Zone', 'Heritage Walk'] },
    { name: 'IT Corridor', growth: '300%', score: 97, types: ['IT/ITES', 'Residential'], developments: ['SEZ', 'Vijayawada Tech Park', 'Affordable Housing'] },
  ],
  infrastructure: [
    { year: '2022', status: 'completed', title: 'Vijayawada Metro Phase 1', desc: '25 km metro corridor connecting major transit hubs.' },
    { year: '2023', status: 'completed', title: 'Outer Ring Road', desc: '80 km expressway decongesting city traffic.' },
    { year: '2024', status: 'completed', title: 'Amaravati Capital Region', desc: 'Government administrative zone development.' },
    { year: '2025', status: 'completed', title: 'IT Corridor Expansion', desc: 'New tech parks and business districts.' },
    { year: '2026', status: 'ongoing', title: 'Greenfield Airport Terminal', desc: 'New terminal with 10M passenger capacity.' },
    { year: '2027', status: 'ongoing', title: 'High-Speed Rail Corridor', desc: 'Hyderabad-Vijayawada bullet train project.' },
  ],
  nearby: [
    { icon: Waypoints, name: 'ORR Entry', distance: '2 km', time: '5 mins' },
    { icon: Plane, name: 'Airport', distance: '25 km', time: '30 mins' },
    { icon: Train, name: 'Railway Station', distance: '5 km', time: '10 mins' },
    { icon: Building2, name: 'Financial District', distance: '15 km', time: '20 mins' },
    { icon: GraduationCap, name: 'NIT Vijayawada', distance: '12 km', time: '15 mins' },
    { icon: Heart, name: 'Amaravati', distance: '35 km', time: '40 mins' },
    { icon: Store, name: 'Central Business District', distance: '4 km', time: '8 mins' },
    { icon: Trees, name: 'Prakasam Barrage', distance: '3 km', time: '5 mins' },
  ],
  gallery: [
    { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', label: 'City Skyline', type: 'Aerial View' },
    { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', label: 'Commercial District', type: 'Architecture' },
    { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', label: 'IT Corridor', type: 'Business Hub' },
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', label: 'Residential Area', type: 'Premium Living' },
    { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', label: 'Infrastructure', type: 'Development' },
    { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', label: 'Green Spaces', type: 'Nature' },
  ],
};

/* ─── Main Component ─── */
export function CityPage() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const city = cityData;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <AppLayout>
      <article className="bg-white">
        {/* ════════════════════════════════════════
            SECTION 1 — FULL SCREEN CITY HERO
        ════════════════════════════════════════ */}
        <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
          <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
            <img src={city.heroImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75" />
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2540]/30 via-transparent to-transparent" />

          <div className="absolute inset-0">
            <div className="absolute top-1/4 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.06] blur-[160px]" />
            <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[#c6a43f]/[0.04] blur-[120px]" />
          </div>

          <motion.div className="absolute inset-0 flex items-center" style={{ opacity: heroOpacity as unknown as number }}>
            <div className="container mx-auto px-6 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-4xl"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
                >
                  <MapPin className="h-3 w-3" />
                  City Investment Guide
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 font-serif text-6xl font-black leading-[1.05] tracking-tight text-white lg:text-8xl xl:text-9xl"
                >
                  Invest in{' '}
                  <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                    {city.name}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60 lg:text-xl"
                >
                  {city.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4"
                >
                  {city.stats.map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
                      <p className="text-2xl font-bold text-white lg:text-3xl">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="mt-1 text-xs text-white/40">{stat.label}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-8 flex flex-wrap gap-4"
                >
                  <Link to="/properties">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-7 py-3 text-sm font-bold text-[#020617] shadow-lg shadow-[#c6a43f]/20 transition-all hover:shadow-xl hover:shadow-[#c6a43f]/30"
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
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-7 py-3 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Book Site Visit
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              <ChevronDown className="h-5 w-5 text-white/30" />
              <span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/20">Scroll</span>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 2 — WHY THIS CITY
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#f8fafc] py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c6a43f]/5 to-transparent" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Why This City"
              title={`Why Invest in ${city.name}?`}
              subtitle="Discover what makes this city a prime real estate investment destination"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {city.whyCity.map((item, i) => {
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
        </section>

        {/* ════════════════════════════════════════
            SECTION 3 — CITY HIGHLIGHTS
        ════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="City Highlights"
              title="Everything at Your Doorstep"
              subtitle="World-class infrastructure and amenities that make this city exceptional"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {city.highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-500 hover:border-emerald-500/20 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-100">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0a2540]">{item.title}</h3>
                        <p className="mt-0.5 text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 4 — INVESTMENT HOTSPOTS
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#0a2540] py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a2540] via-[#0d2a4a] to-[#0f3058]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-16 text-center"
            >
              <motion.span variants={fadeUp} className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2 text-sm font-medium text-emerald-400">
                Investment Hotspots
              </motion.span>
              <motion.h2 variants={fadeUp} className="mb-4 mt-4 font-serif text-3xl font-bold text-white lg:text-5xl">
                Premium Investment Zones
              </motion.h2>
              <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-slate-400">
                High-growth corridors with exceptional returns and modern infrastructure
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2"
            >
              {city.hotspots.map((spot, i) => (
                <motion.div
                  key={spot.name}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/20 hover:bg-white/[0.06] lg:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white lg:text-2xl">{spot.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {spot.types.map((t) => (
                          <span key={t} className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-400">{spot.growth}</p>
                      <p className="text-xs text-slate-500">Growth</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-[#c6a43f]" />
                      <span className="text-sm text-slate-300">Score: {spot.score}/100</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-[#c6a43f]" />
                      <span className="text-sm text-slate-300">Premium Zone</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {spot.developments.map((d) => (
                      <span key={d} className="inline-flex items-center gap-1 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-2.5 py-1 text-[11px] text-emerald-300/70">
                        <CircleDot className="h-2.5 w-2.5" />
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${spot.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 5 — INFRASTRUCTURE DEVELOPMENT
        ════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Infrastructure Development"
              title="Shaping the Future"
              subtitle="Major infrastructure projects transforming the city landscape"
            />

            <div className="relative mx-auto max-w-3xl">
              <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gradient-to-b from-[#c6a43f] via-emerald-400 to-[#c6a43f]/20" />

              {city.infrastructure.map((item, i) => (
                <motion.div
                  key={item.title}
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
                    className="absolute -left-[37px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#c6a43f] bg-white"
                  >
                    <div className={`h-3 w-3 rounded-full ${item.status === 'ongoing' ? 'bg-emerald-500' : 'bg-[#c6a43f]/40'}`} />
                  </motion.div>

                  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                        {item.year}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-wider ${item.status === 'ongoing' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-[#0a2540]">{item.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 6 — LOCATION MAP
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#f8fafc] py-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd07?w=1600')] bg-cover bg-center opacity-[0.02]" />
          <div className="container relative z-10 mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Location Map"
              title="Strategic Location Advantages"
              subtitle="Prime connectivity to all essential destinations"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {city.nearby.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    variants={fadeUp}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#c6a43f]/20 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#c6a43f]/10 text-[#c6a43f]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#0a2540]">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{item.distance}</span>
                        <span>·</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <MapPin className="h-4 w-4 shrink-0 text-[#c6a43f]" />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 7 — PROPERTY OPPORTUNITIES
        ════════════════════════════════════════ */}
        <section className="bg-white py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="Property Opportunities"
              title="Featured Investment Properties"
              subtitle="Curated selection of premium properties in high-growth zones"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                { title: 'Luxury Apartment in Auto Nagar', price: '₹1.2 Cr', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', location: 'Auto Nagar', rating: 92 },
                { title: 'Premium Villa in Benz Circle', price: '₹2.8 Cr', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', location: 'Benz Circle', rating: 88 },
                { title: 'Commercial Space in Governorpet', price: '₹85 L', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', location: 'Governorpet', rating: 82 },
                { title: 'Plot in Mogalrajapuram', price: '₹45 L', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', location: 'Mogalrajapuram', rating: 85 },
                { title: 'Penthouse at IT Corridor', price: '₹3.5 Cr', img: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80', location: 'IT Corridor', rating: 90 },
                { title: 'Villa with Golf Course View', price: '₹4.2 Cr', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', location: 'Benz Circle', rating: 95 },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:border-[#c6a43f]/20 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 rounded-full bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-3 py-1 text-sm font-bold text-white shadow-lg">
                      {item.price}
                    </span>
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[#0a2540] shadow-sm backdrop-blur-sm">
                      <Star className="h-3 w-3 fill-[#c6a43f] text-[#c6a43f]" />
                      {item.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 font-bold text-[#0a2540] transition group-hover:text-[#c6a43f]">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </div>
                    <Link to="/properties">
                      <motion.button
                        whileHover={{ x: 3 }}
                        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#c6a43f]"
                      >
                        View Property
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            SECTION 8 — CITY GALLERY
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#f8fafc] py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader
              badge="City Gallery"
              title={`Visual Tour of ${city.name}`}
              subtitle="Explore the city through stunning visuals"
            />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="columns-1 gap-4 sm:columns-2 lg:columns-3"
            >
              {city.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="mb-4 inline-block w-full cursor-pointer overflow-hidden rounded-2xl"
                  onClick={() => setLightboxImg(img.url)}
                >
                  <div className="group relative overflow-hidden">
                    <img src={img.url} alt={img.label} className="w-full transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="text-sm font-medium text-white">{img.label}</p>
                      <p className="text-xs text-white/60">{img.type}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <AnimatePresence>
            {lightboxImg && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
                onClick={() => setLightboxImg(null)}
              >
                <motion.button
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                  onClick={() => setLightboxImg(null)}
                >
                  <X className="h-5 w-5" />
                </motion.button>
                <motion.img
                  key={lightboxImg}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  src={lightboxImg}
                  alt=""
                  className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ════════════════════════════════════════
            SECTION 9 — FINAL CTA
        ════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#0a2540] py-24">
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mx-auto max-w-3xl"
            >
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-4 py-2 text-sm font-medium text-emerald-400">
                <Sparkles className="h-4 w-4" />
                Start Your Investment Journey
              </motion.span>

              <motion.h2 variants={fadeUp} className="mt-6 font-serif text-4xl font-black text-white lg:text-6xl">
                Ready to Invest in <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">{city.name}</span>?
              </motion.h2>

              <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-400">
                Explore verified investment opportunities with Property Vision. Our experts will guide you every step of the way.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/properties">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-8 py-4 text-sm font-bold text-[#020617] shadow-lg shadow-[#c6a43f]/20 transition-all hover:shadow-xl hover:shadow-[#c6a43f]/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      View Properties
                      <ArrowRight className="h-4 w-4" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </motion.button>
                </Link>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border border-white/15 bg-white/[0.06] px-8 py-4 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      Schedule Consultation
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
                      Call Expert
                    </span>
                  </motion.button>
                </a>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-8">
                {[
                  { icon: Shield, text: 'Verified Properties' },
                  { icon: CheckCircle2, text: 'RERA Approved' },
                  { icon: DollarSign, text: 'Best Price Guarantee' },
                  { icon: Clock, text: '24/7 Support' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-2 text-sm text-slate-400">
                      <Icon className="h-4 w-4 text-emerald-400" />
                      {item.text}
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </article>
    </AppLayout>
  );
}
