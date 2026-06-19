import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ShieldCheck, Zap, FileText, Building2, TrendingUp, Construction,
  TreePine, Sun, Ruler, MapPin, Award, Sparkles, Clock, CheckCircle2,
  Crown, Gem, Home, Lock, Wifi, Droplets, Wind, Car, Bike, Dumbbell,
  Heart, Coffee, BookOpen, Music, Layers, Compass, Navigation, Users,
  UserCheck, Calendar, ClipboardCheck, Truck
} from 'lucide-react';
import type { Property } from '../../types/property';
import { fadeUp, staggerContainer, scaleInBounce, cardHover, amenityHover } from '@/config/animations';

// ============================================
// PREMIUM ICON MAPPING WITH LUXURY VARIANTS
// ============================================
const LUXURY_ICON_MAP: Record<string, any> = {
  'CRDA': ShieldCheck,
  'Approved': Award,
  'Electricity': Zap,
  'Power': Zap,
  'Title': FileText,
  'Document': FileText,
  'Legal': FileText,
  'Block': Building2,
  'Road': Ruler,
  'Investment': TrendingUp,
  'Site': Construction,
  'Development': Construction,
  'Green': TreePine,
  'Park': TreePine,
  'Garden': TreePine,
  'Security': Lock,
  'Safe': ShieldCheck,
  'Water': Droplets,
  'Underground': Layers,
  'Layout': Compass,
  'Location': MapPin,
  'Connectivity': Navigation,
  'Future': TrendingUp,
  'Growth': TrendingUp,
  'Luxury': Crown,
  'Premium': Gem,
  'Residential': Home,
  'Commercial': Building2,
  'Parking': Car,
  'Cycle': Bike,
  'Fitness': Dumbbell,
  'Wellness': Heart,
  'Cafe': Coffee,
  'Library': BookOpen,
  'Club': Music,
  'Community': Users,
  'Verified': CheckCircle2,
  'Clear': FileText,
  'Possession': Calendar,
  'Handover': Calendar,
  'Inspection': ClipboardCheck,
  'Ready': Truck
};

// ============================================
// PREMIUM STATS DATA
// ============================================
const STATS_DATA = [
  { icon: Crown, label: 'Premium Layouts', key: 'totalPlots' },
  { icon: Home, label: 'Available Units', key: 'availableUnits' },
  { icon: Ruler, label: 'Road Width', key: 'internalRoadWidth' },
  { icon: Navigation, label: 'To ORR', key: 'distanceToORR' },
];

// ============================================
// ANIMATION VARIANTS
// ============================================

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
const AnimatedCounter = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <span ref={ref} className="inline-block text-4xl font-bold text-primary">
      {isInView ? <CountUp start={0} end={value} duration={2.5} suffix={suffix} prefix={prefix} /> : '0'}
    </span>
  );
};

// ============================================
// PREMIUM AMENITY CARD COMPONENT
// ============================================
const PremiumAmenityCard = ({ name, index }: { name: string; index: number }) => {
  const Icon = LUXURY_ICON_MAP[Object.keys(LUXURY_ICON_MAP).find(k => name.includes(k)) || ''] || ShieldCheck;
  // Generate a unique gradient based on the amenity name
  const gradients = [
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-cyan-500',
    'from-amber-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-rose-500 to-red-500',
    'from-indigo-500 to-blue-500',
  ];
  const gradient = gradients[index % gradients.length];
  return (
    <motion.div
      variants={fadeUp}
      whileHover={cardHover}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100/50"
    >
      {/* Animated Gradient Border */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl -z-10`} />
      {/* Glass Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      {/* Icon Container with Animation */}
      <motion.div
        variants={scaleInBounce}
        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg mb-5 group-hover:shadow-xl transition-all duration-300`}
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-8 h-8 text-white" />
        <motion.div
          className="absolute inset-0 rounded-2xl bg-white/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
        />
      </motion.div>
      {/* Title */}
      <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors duration-300">
        {name}
      </h3>
      {/* Description - Auto-generated based on amenity type */}
      <p className="text-slate-500 text-sm leading-relaxed">
        {getAmenityDescription(name)}
      </p>
      {/* Hover Indicator */}
      <motion.div
        className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        whileHover={{ x: 5 }}
      >
        <Sparkles className="w-4 h-4 text-secondary" />
      </motion.div>
    </motion.div>
  );
};

// ============================================
// HELPER: Get premium description based on amenity
// ============================================
const getAmenityDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    'CRDA Approved': 'Government-approved development with verified planning and documentation.',
    'Non-layout under CRDA approved': 'Officially recognized layout with complete regulatory compliance.',
    '24/7 Electricity': 'Round-the-clock power supply with underground cabling and backup systems.',
    'Electricity facility available': 'Fully electrified site with modern infrastructure and transformers.',
    'Clear Title': 'Legal and clean documents with complete title verification and due diligence.',
    'Legal and clean documents': 'Comprehensive documentation with clear ownership history.',
    'Four clearly planned blocks': 'Strategically organized blocks for optimal space utilization and privacy.',
    'Wide 33 ft internal road': 'Spacious road network ensuring smooth traffic flow and accessibility.',
    'Clear internal block planning': 'Well-designed block layout for seamless navigation and convenience.',
    'Site-ready environment': 'Fully developed site with all necessary infrastructure in place.',
    'Focused plotted layout': 'Carefully planned residential plots with investment-friendly structure.',
    'Investment-friendly structure': 'Designed to maximize long-term property value and returns.',
    'Fast-growing plotted investment zone': 'High-growth corridor with excellent appreciation potential.',
  };
  
  return descriptions[name] || 'Premium feature designed for modern living and long-term investment value.';
};

// ============================================
// STATS SECTION COMPONENT
// ============================================
const StatsSection = ({ property }: { property: Property }) => {
  const stats = [
    { icon: Crown, label: 'Premium Layouts', value: property.totalPlots || 97, suffix: '+' },
    { icon: Home, label: 'Available Units', value: property.availableUnits || 62, suffix: '', color: 'text-emerald-600' },
    { icon: Ruler, label: 'Road Width', value: 33, suffix: ' FT', valuePrefix: '' },
    { icon: Navigation, label: 'To ORR', value: 2, suffix: ' KM', valuePrefix: '' },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          variants={fadeUp}
          className="relative group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <stat.icon className="w-10 h-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
          <p className={`text-4xl font-bold ${stat.color || 'text-primary'} mb-1`}>
            <AnimatedCounter value={Number(stat.value)} suffix={stat.suffix} prefix={stat.valuePrefix || ''} />
          </p>
          <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================
// MAIN AMENITIES SECTION COMPONENT
// ============================================
export function AmenitiesSection({ property }: { property: Property }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  
  const amenities = property.amenities ?? [];
  
  // If no amenities, don't render
  if (!amenities.length) return null;

  // Split amenities into primary and secondary
  const primaryAmenities: string[] = amenities.slice(0, 8);
  const secondaryAmenities: string[] = amenities.slice(8);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 rounded-full blur-3xl" />
        
        {/* Decorative Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header with Premium Typography */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Project Advantages</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Premium Amenities Designed
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">For Modern Living</span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-3xl mx-auto">
            Every feature has been carefully planned to provide comfort, convenience, security, and long-term investment value.
          </motion.p>
          
          {/* Decorative Divider */}
          <motion.div variants={fadeUp} className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-0.5 rounded-full bg-secondary/60" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
          </motion.div>
        </motion.div>

        {/* Stats Row - Premium Investment Indicators */}
        <StatsSection property={property} />

        {/* Primary Amenities Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {primaryAmenities.map((amenity: string, index: number) => (
            <PremiumAmenityCard key={amenity} name={amenity} index={index} />
          ))}
        </motion.div>

        {/* Secondary Amenities Grid - Compact */}
        {secondaryAmenities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-8 border-t border-slate-200/50"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-primary">Additional Premium Features</h3>
              <p className="text-slate-500 text-sm mt-1">Every detail crafted for excellence</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {secondaryAmenities.map((amenity: string, index: number) => (
                <motion.span
                  key={amenity}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 text-sm shadow-sm hover:shadow-md hover:border-secondary/50 transition-all duration-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                  {amenity}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Premium Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 border border-secondary/20">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-primary">Experience luxury living at Property Vision</span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
        </motion.div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default AmenitiesSection;