import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  CheckCircle,
  Send,
  Loader2,
  ExternalLink,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fadeUp, staggerContainer, pageLoadVariants } from '@/config/animations';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';

const officeAddress = 'Vijayawada Mandal, NTR District, Andhra Pradesh 520015, India';
const officeMapsUrl =
  'https://www.google.com/maps/search/Vijayawada+Mandal,+NTR+District,+Andhra+Pradesh+520015/@16.508939,80.629101,15z';
const officeMapsEmbedUrl =
  'https://www.google.com/maps?q=Vijayawada+Mandal,+NTR+District,+Andhra+Pradesh+520015&output=embed';

// ===== Background Blob Component =====
const AnimatedBlob = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl ${className}`}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      x: [0, 30, -20, 0],
      y: [0, -20, 30, 0],
    }}
    transition={{
      duration: 12 + delay,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  />
);

// ===== Glow Pulse Animation =====
const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(212, 175, 55, 0.25)',
      '0 0 50px rgba(212, 175, 55, 0.5)',
      '0 0 20px rgba(212, 175, 55, 0.25)',
    ],
    transition: {
      repeat: Infinity,
      duration: 4,
      ease: 'easeInOut' as const,
    },
  },
};

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    email: '',
    whatsappOptIn: true,
  });
  const [callbackStatus, setCallbackStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.85]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.05]);

  const formRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useSpring(30, { stiffness: 500, damping: 28 });
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, rgba(212, 175, 55, 0.15), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1800));
    console.log('Form submitted:', formData);
    setFormStatus('success');
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormStatus('idle'), 4000);
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackStatus('submitting');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setCallbackStatus('success');
    setCallbackForm({ name: '', phone: '', email: '', whatsappOptIn: true });
    setTimeout(() => setCallbackStatus('idle'), 4000);
  };

  const contactCards = [
    {
      icon: <Phone className="w-7 h-7" />,
      title: 'Call Us',
      lines: ['+91 76599 26345', '+91 99482 02823', 'Mon - Sat: 9 AM - 7 PM'],
      cta: 'Contact Now',
      href: 'tel:+917659926345',
    },
    {
      icon: <Mail className="w-7 h-7" />,
      title: 'Email Us',
      lines: ['propertyvision1610@gmail.com', 'Response within 24 hours'],
      cta: 'Send Email',
      href: 'mailto:propertyvision1610@gmail.com',
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: 'Visit Office',
      lines: ['Vijayawada Mandal,', 'NTR District,', 'Andhra Pradesh 520015'],
      cta: 'Get Directions',
      href: officeMapsUrl,
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Working Hours',
      lines: ['Mon-Sat: 9 AM - 7 PM', 'Sunday: 10 AM - 4 PM', 'Emergency support available'],
      cta: 'Contact Us',
      href: 'tel:+917659926345',
    },
  ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61578459361105', icon: <Facebook className="w-6 h-6" />, color: '#1877F2' },
    { name: 'Instagram', href: 'https://www.instagram.com/property_vision1610', icon: <Instagram className="w-6 h-6" />, color: '#E4405F' },
    { name: 'YouTube', href: 'https://www.youtube.com/@property_visionyourdreams--our', icon: <Youtube className="w-6 h-6" />, color: '#FF0000' },
    { name: 'WhatsApp', href: 'https://wa.me/917659926345', icon: <MessageCircle className="w-6 h-6" />, color: '#25D366' },
  ];

  return (
    // ✅ ROOT WRAPPER - White background like Home page
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-800">
      <Navbar />

      {/* ===== SECTION 1: DARK CINEMATIC HERO (Only Hero stays dark) ===== */}
      <section className="relative -mt-20 flex min-h-[100dvh] items-center overflow-hidden pt-20 text-white">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#081120] via-[#0A2540] to-[#0A2540]" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600)' }}
          />
          <AnimatedBlob className="w-[500px] h-[500px] bg-[#c6a43f]/20 top-20 right-20" delay={0} />
          <AnimatedBlob className="w-[400px] h-[400px] bg-[#0d9488]/20 bottom-20 left-20" delay={2} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-transparent to-[#081120]/40" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-4 py-16 lg:py-20">
          <motion.div
            variants={pageLoadVariants}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div
              variants={glowPulse}
              animate="animate"
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[#c6a43f]/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_30px_rgba(198,164,63,0.2)] backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-[#c6a43f]" />
              Fast response within 24 hours
            </motion.div>

            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
              Contact{' '}
              <span className="bg-gradient-to-r from-[#c6a43f] via-[#f0c14b] to-[#c6a43f] bg-clip-text text-transparent">
                Property Vision
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
              Let's discuss your next investment. Expert guidance for plots, ventures and land investments across Andhra
              Pradesh and Telangana.
            </p>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-6 flex flex-wrap justify-center gap-4">
              {[
                { value: '24h', label: 'Response Time' },
                { value: '5000+', label: 'Happy Clients' },
                { value: '10+', label: 'Years Experience' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUp}
                  className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-center backdrop-blur-sm"
                >
                  <div className="text-xl font-bold text-[#c6a43f]">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+917659926345">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-8 py-3.5 text-base font-bold text-[#081120] shadow-lg shadow-[#c6a43f]/25 transition-all hover:shadow-xl hover:shadow-[#c6a43f]/40"
                >
                  <Phone className="mr-2 inline h-4 w-4" />
                  Call Now
                </motion.button>
              </a>
              <a href="https://wa.me/917659926345" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  <MessageCircle className="mr-2 inline h-4 w-4" />
                  WhatsApp
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 text-white/50"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/30 p-2">
              <motion.div
                className="h-3 w-1.5 rounded-full bg-white/50"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <span className="text-xs tracking-wider text-white/40">Scroll to connect</span>
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 2: CONTACT CARDS (White background) ===== */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {contactCards.map((card, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 text-center shadow-xl transition-all duration-500 hover:shadow-2xl lg:p-7">
                  <motion.div whileHover={{ scale: 1.1, rotate: 3 }} className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c6a43f]/20 to-[#f0c14b]/15 text-[#c6a43f]">
                    {card.icon}
                  </motion.div>
                  <h3 className="mb-4 text-lg font-bold text-slate-800">{card.title}</h3>
                  <ul className="mb-6 space-y-2">
                    {card.lines.map((line, i) => (
                      <li key={i} className="text-sm text-slate-600">{line}</li>
                    ))}
                  </ul>
                  <a href={card.href} className="inline-flex items-center gap-2 text-sm font-semibold text-[#c6a43f] transition-colors hover:text-[#f0c14b]">
                    {card.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 3: CONSULTATION + CALLBACK (Light gray background) ===== */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="inline-block rounded-full border border-[#c6a43f]/30 bg-[#c6a43f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#c6a43f]">
                Limited Time Offer
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-800 md:text-4xl">
                Get Free Expert Consultation
              </h2>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                Speak with our certified real estate experts and get personalized guidance — completely free, no obligation.
              </p>
              <ul className="space-y-3">
                {[
                  'Expert advice from certified professionals',
                  'Quick response within 1 hour',
                  'No obligation — completely free',
                  'Access to exclusive off-market listings',
                  '100% data secure & encrypted',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-[15px] text-slate-700">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#c6a43f]" strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-6 border-t border-slate-200 pt-4">
                <div className="text-center">
                  <div className="font-serif text-2xl font-bold text-[#c6a43f] md:text-3xl">4.9/5</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">from 2000+ clients</div>
                </div>
                <div className="h-10 w-px bg-gradient-to-b from-transparent via-[#c6a43f]/40 to-transparent" />
                <div className="text-center">
                  <div className="font-serif text-2xl font-bold text-[#c6a43f] md:text-3xl">1,200+</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Properties sold</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl lg:p-8">
                <h3 className="mb-6 font-serif text-2xl font-bold text-slate-800">Request a Callback</h3>
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                    <input
                      type="email"
                      value={callbackForm.email}
                      onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                      placeholder="you@example.com"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={callbackForm.whatsappOptIn}
                      onChange={(e) => setCallbackForm({ ...callbackForm, whatsappOptIn: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/35"
                    />
                    I agree to receive property updates on WhatsApp
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={callbackStatus === 'submitting'}
                    className="w-full rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] py-3.5 text-base font-bold text-[#081120] shadow-lg shadow-[#c6a43f]/25 transition-all hover:brightness-105 disabled:opacity-50"
                  >
                    {callbackStatus === 'submitting' ? 'Submitting...' : 'Get Free Consultation'}
                  </motion.button>
                  {callbackStatus === 'success' && (
                    <div className="flex items-center justify-center gap-2 rounded-xl border border-[#c6a43f]/35 bg-[#c6a43f]/10 p-4 text-center text-sm font-medium text-slate-800">
                      <CheckCircle className="h-5 w-5 text-[#c6a43f]" />
                      Thank you — our expert will contact you within one hour.
                    </div>
                  )}
                  <p className="text-center text-xs text-slate-400">No spam. Unsubscribe anytime. We respect your privacy.</p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: DETAILED FORM + MAP (White background) ===== */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:gap-12">
            <motion.div
              ref={formRef}
              onMouseMove={handleMouseMove}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <motion.div style={{ background }} className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 hover:opacity-100" />
              <div className="relative rounded-3xl border border-gray-200 bg-white p-6 shadow-xl lg:p-8">
                <div className="mb-6">
                  <span className="mb-4 inline-block rounded-full border border-[#c6a43f]/30 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                    Detailed enquiry
                  </span>
                  <h2 className="mb-3 font-serif text-3xl font-bold text-slate-800 lg:text-4xl">Send Us a Message</h2>
                  <p className="text-slate-600">Prefer to share more context? Use this form — we typically reply within 24 hours.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className={`mb-2 block text-sm font-medium transition-colors ${focusedField === 'name' ? 'text-[#c6a43f]' : 'text-slate-700'}`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium transition-colors ${focusedField === 'phone' ? 'text-[#c6a43f]' : 'text-slate-700'}`}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className={`mb-2 block text-sm font-medium transition-colors ${focusedField === 'email' ? 'text-[#c6a43f]' : 'text-slate-700'}`}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className={`mb-2 block text-sm font-medium transition-colors ${focusedField === 'subject' ? 'text-[#c6a43f]' : 'text-slate-700'}`}>
                        Subject *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`mb-2 block text-sm font-medium transition-colors ${focusedField === 'message' ? 'text-[#c6a43f]' : 'text-slate-700'}`}>
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-[#c6a43f] focus:ring-2 focus:ring-[#c6a43f]/20"
                      placeholder="Tell us about your property needs..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] py-4 text-lg font-bold text-[#081120] shadow-lg transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </motion.button>

                  {formStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-[#c6a43f]/35 bg-[#c6a43f]/10 p-5 text-center text-sm font-medium text-slate-800"
                    >
                      <CheckCircle className="mr-2 inline h-5 w-5 text-[#c6a43f]" />
                      Thank you! We'll contact you within 24 hours.
                    </motion.div>
                  )}

                  <p className="text-center text-xs text-slate-400">
                    By submitting, you agree to our <a href="/privacy" className="text-[#c6a43f] transition-colors hover:text-[#f0c14b]">Privacy Policy</a>
                  </p>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                <div className="relative z-10 border-b border-gray-200 bg-white p-6 lg:p-7">
                  <span className="mb-4 inline-block rounded-full border border-[#c6a43f]/30 bg-[#c6a43f]/10 px-4 py-2 text-sm font-medium text-[#c6a43f]">
                    Find Us
                  </span>
                  <h2 className="mb-3 font-serif text-3xl font-bold text-slate-800 lg:text-4xl">Find Us on Map</h2>
                  <p className="text-slate-600">Visit our office at {officeAddress}</p>
                </div>

                <div className="relative h-80 lg:h-96">
                  <iframe
                    src={officeMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                    title="Property Vision Office Location"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 border-t border-gray-200 bg-white p-6 lg:p-7">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#c6a43f]/20 to-[#f0c14b]/15">
                      <MapPin className="h-5 w-5 text-[#c6a43f]" />
                    </div>
                    <span className="leading-relaxed text-slate-700">{officeAddress}</span>
                  </div>
                  <motion.a
                    href={officeMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-7 py-3 font-semibold text-[#081120] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: SOCIAL MEDIA (Light gray background) ===== */}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-sm font-semibold uppercase tracking-wide text-[#c6a43f]">Connect With Us</span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-800 md:text-4xl">Follow Our Journey</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">Stay updated with latest property listings, market insights, and exclusive offers</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                whileHover={{ scale: 1.1, y: -6 }}
                className="group relative"
                aria-label={social.name}
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 group-hover:shadow-lg">
                  <span style={{ color: social.color }} className="transition-opacity duration-300">{social.icon}</span>
                </div>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                  {social.name}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 6: WHATSAPP COMMUNITY (White background) ===== */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-gradient-to-r from-[#081120] to-[#0A2540] p-6 text-center shadow-xl lg:p-8"
          >
            <motion.div variants={glowPulse} animate="animate" className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-white/10">
              <MessageCircle className="h-12 w-12 text-[#25D366]" />
            </motion.div>
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">Join Our WhatsApp Community</h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-white/70">
              Connect with 1,000+ property buyers, sellers & investors. Get exclusive deals, market updates, and expert advice!
            </p>
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {['Free to join', 'Active discussions', 'Exclusive property updates'].map((benefit, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm text-white/80"
                >
                  <CheckCircle className="h-4 w-4 text-[#c6a43f]" />
                  {benefit}
                </motion.span>
              ))}
            </div>
            <motion.a
              href="https://chat.whatsapp.com/CsGyWiZHkMsFqHFKaHBph0?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-9 py-4 text-lg font-bold text-white shadow-lg transition-all hover:shadow-[0_0_40px_rgba(37,211,102,0.35)]"
            >
              <MessageCircle className="h-5 w-5" />
              Join Community Now
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 7: FINAL CTA BANNER (Dark gradient) ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#081120] via-[#0A2540] to-[#1A3555] py-16 lg:py-20">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl"
          >
            <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Ready to discuss your property needs?
            </h2>
            <p className="mb-8 text-lg text-white/80">
              Let's have a conversation about your real estate goals. No obligation, just expert guidance.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.a
                href="tel:+919000971317"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-9 py-4 text-lg font-bold text-[#081120] shadow-lg transition-all hover:shadow-[0_0_40px_rgba(198,164,63,0.35)]"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </motion.a>
              
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