import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import { CONTACT_NUMBERS } from '../data/contact';

const Footer = () => {
  const { pathname } = useLocation();
  /** Stack above HomePage’s fixed WhatsApp CTA (same corner). */
  const communityFabBottom =
    pathname === '/' ? 'bottom-28 max-lg:bottom-24' : 'bottom-6';

  // Social links
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/profile.php?id=61578459361105&mibextid=wwXIfr&rdid=eXUJPes2x3cW8B2E&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1DtWHewLGR%2F%3Fmibextid%3DwwXIfr#',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/property_vision1610',
      icon: Instagram,
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@property_visionyourdreams--our',
      icon: Youtube,
    },
    {
      name: 'WhatsApp Community',
      href: 'https://chat.whatsapp.com/CsGyWiZHkMsFqHFKaHBph0?mode=gi_t',
      icon: MessageCircle,
    },
  ];

  // Quick links
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Post Property', href: '/post-property' },
  ];

  // Services
  const services = [
    { name: 'Buy Property', href: '/properties?intent=buy' },
    { name: 'Sell Property', href: '/properties?intent=sell' },
    { name: 'Rent Property', href: '/properties?intent=rent' },
    { name: 'Investment Advisory', href: '/services#investment' },
  ];

  // Contact info
  const contactInfo = [
    ...CONTACT_NUMBERS.map((contact) => ({
      icon: Phone,
      label: contact.display,
      href: contact.href,
    })),
    {
      icon: Mail,
      label: 'propertyvision1610@gmail.com',
      href: 'mailto:propertyvision1610@gmail.com',
    },
    {
      icon: MapPin,
      label: 'Vijayawada Mandal, NTR District, Andhra Pradesh, India - 520015',
      href: 'https://maps.google.com/?q=Vijayawada+Mandal+NTR+District',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const socialHoverVariants = {
    hover: {
      scale: 1.1,
      boxShadow: '0 0 25px rgba(198, 164, 63, 0.5)',
      transition: { duration: 0.2 },
    },
  };

  const MotionLink = motion(Link);

  const linkHoverVariants = {
    hover: {
      x: 4,
      color: '#0d9488',
      transition: { duration: 0.2 },
    },
  };

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-[#f8fafc] text-slate-800">
      {/* Light accent wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(13,148,136,0.06),transparent_55%)]"
        aria-hidden
      />

      {/* WhatsApp Community Floating CTA */}
      <motion.a
        href="https://chat.whatsapp.com/CsGyWiZHkMsFqHFKaHBph0?mode=gi_t"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed right-6 z-40 hidden lg:flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold shadow-lg hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300 ${communityFabBottom}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Join Our Community</span>
        <ArrowUpRight className="w-4 h-4 ml-1" />
      </motion.a>

      {/* Main Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-8"
        >
          {/* ===== COLUMN 1: BRAND ===== */}
          <motion.div variants={itemVariants} className="space-y-3">
            {/* Logo */}
            <Link
              to="/"
              className="inline-block max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d9488] focus-visible:ring-offset-2 rounded-sm"
            >
              <img
                src="/assets/logo-1.png"
                alt="Property Vision"
                className="h-14 w-auto max-w-[min(100%,280px)] object-contain md:h-16"
                width={280}
                height={64}
                decoding="async"
              />
            </Link>

            {/* Tagline */}
            <p className="max-w-xs text-[15px] leading-relaxed text-slate-600">
              Your Dream, Our Mission — Trusted real estate partner in Andhra Pradesh.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-0.5">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={socialHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-[#c6a43f]/50 hover:bg-[#c6a43f]/5 group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-slate-600 transition-colors group-hover:text-[#b8941f]" />
                </motion.a>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="rounded-full border border-[#c6a43f]/35 bg-[#c6a43f]/10 px-2.5 py-1 text-xs font-medium text-[#8a6d1f]">
                ✓ Verified Listings
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                ✓ RERA Compliant
              </span>
            </div>

            {/* Compact CTA — no second logo (main mark is above) */}
            <div className="mt-1 rounded-lg border border-slate-200/90 bg-white/90 px-3 py-2.5 shadow-sm">
              <Link
                to="/properties"
                className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#0a2540] transition-colors hover:text-[#0d9488]"
              >
                Browse listings
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#b8941f]" aria-hidden />
              </Link>
            </div>
          </motion.div>

          {/* ===== COLUMN 2: QUICK LINKS ===== */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-2 font-serif text-lg font-semibold text-[#0a2540]">Quick Links</h4>
            <ul className="space-y-0.5">
              {quickLinks.map((link) => (
                <motion.li key={link.name}>
                  <MotionLink
                    to={link.href}
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    className="inline-flex min-h-[40px] items-center gap-2 py-1 text-[15px] text-slate-600 transition-colors duration-200 hover:text-[#0d9488]"
                  >
                    <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" />
                    <span>{link.name}</span>
                  </MotionLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ===== COLUMN 3: SERVICES ===== */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-2 font-serif text-lg font-semibold text-[#0a2540]">Services</h4>
            <ul className="space-y-0.5">
              {services.map((service) => (
                <motion.li key={service.name}>
                  <MotionLink
                    to={service.href}
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    className="inline-flex min-h-[40px] items-center gap-2 py-1 text-[15px] text-slate-600 transition-colors duration-200 hover:text-[#0d9488]"
                  >
                    <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2" />
                    <span>{service.name}</span>
                  </MotionLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ===== COLUMN 4: CONTACT INFO ===== */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-2 font-serif text-lg font-semibold text-[#0a2540]">Contact Info</h4>
            <div className="space-y-2">
              {contactInfo.map((item, idx) => (
                <motion.div key={idx} whileHover={{ x: 2 }} className="group flex min-h-[40px] items-start gap-2.5 py-0.5">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#c6a43f]/10 transition-colors group-hover:bg-[#c6a43f]/18">
                    <item.icon className="h-4 w-4 text-[#b8941f]" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-[15px] leading-snug text-slate-600 transition-colors duration-200 hover:text-[#0d9488]"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-[15px] leading-snug text-slate-600">{item.label}</span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Office hours — same row structure as contacts, minimal gap */}
              <div className="flex items-start gap-2.5 border-t border-slate-200 pt-2.5">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#c6a43f]/10">
                  <Clock className="h-4 w-4 text-[#b8941f]" aria-hidden />
                </div>
                <div className="min-w-0 pt-0.5 text-[15px] leading-snug text-slate-600">
                  <p className="font-semibold text-[#0a2540]">Office hours</p>
                  <p className="mt-0.5">Mon–Sat: 9:00 AM – 7:00 PM</p>
                  <p>Sun: 10:00 AM – 4:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="relative z-10 border-t border-slate-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 lg:flex-row lg:gap-4">
            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              © {new Date().getFullYear()} Property Vision. All rights reserved.
            </motion.p>

            {/* Credits */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              Designed & Developed by{' '}
              <span className="font-medium text-[#b8941f]">IEP Solutions</span>
            </motion.p>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <Link
                to="/terms"
                className="group relative text-slate-600 transition-colors duration-200 hover:text-[#0d9488]"
              >
                Terms & Conditions
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#0d9488] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/privacy"
                className="group relative text-slate-600 transition-colors duration-200 hover:text-[#0d9488]"
              >
                Privacy Policy
                <span className="absolute bottom-0 left-0 h-px w-0 bg-[#0d9488] transition-all duration-300 group-hover:w-full" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };