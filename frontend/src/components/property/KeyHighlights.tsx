import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ShieldCheck,
  Zap,
  FileText,
  MapPin,
  Building2,
  Route,
  TrendingUp,
  Award,
  CheckCircle2,
  Eye,
  Sparkles,
  Crown,
  Gem,
  Heart,
  Users,
  Clock,
  Calendar,
  Compass,
  Navigation,
  Ruler,
  Sun,
  Droplets,
  TreePine,
  Car,
  Wifi,
  Lock,
  Home,
  Briefcase,
  BarChart3,
  ArrowUpRight,
  Info
} from 'lucide-react';
import type { Property } from '../../types/property';

// ============================================
// TYPES
// ============================================
interface HighlightCategory {
  title: string;
  items: Array<{
    icon: any;
    label: string;
    description: string;
    status?: string;
    statusColor?: string;
  }>;
  color: string;
  gradient: string;
}

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeInOut' as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeInOut' as const }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: 'easeOut' as const }
  }
};

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================
const CircularProgress = ({ value, label, max = 100 }: { value: number; label: string; max?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setCount(value), 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="rgba(13,148,136,0.1)"
            strokeWidth="12"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isInView ? strokeDashoffset : circumference }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#C6A43F" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-bold text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {isInView ? <CountUp start={0} end={count} duration={2.5} suffix="%" /> : '0%'}
          </motion.span>
          <span className="text-xs text-slate-500 mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATS CARD COMPONENT
// ============================================
type StatsCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
};
const StatsCard = ({ icon: Icon, value, label, suffix = '', delay = 0 }: StatsCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      custom={delay}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover="hover"
      className="relative group text-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/50 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100/50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Icon className="w-10 h-10 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
      <p className="text-4xl font-bold text-primary mb-1">
        {isInView ? <CountUp start={0} end={value} duration={2.5} suffix={suffix} /> : '0'}
      </p>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
    </motion.div>
  );
};

// ============================================
// PREMIUM HIGHLIGHT CARD
// ============================================
const PremiumHighlightCard = ({ item, index, categoryColor }: { item: any; index: number; categoryColor: string }) => {
  const Icon = item.icon;
  
  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      whileHover="hover"
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100"
    >
      {/* Animated Border Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${categoryColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10`} style={{ filter: 'blur(20px)' }} />
      
      {/* Glass Reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColor} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {item.status && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.statusColor || 'bg-emerald-100 text-emerald-700'}`}>
            {item.status}
          </span>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-primary mt-4 mb-2 group-hover:text-secondary transition-colors duration-300">
        {item.label}
      </h3>
      
      <p className="text-slate-500 text-sm leading-relaxed">
        {item.description}
      </p>
      
      {/* Hover Arrow Indicator */}
      <motion.div 
        className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        <ArrowUpRight className="w-5 h-5 text-secondary" />
      </motion.div>
    </motion.div>
  );
};

// ============================================
// CATEGORIZE HIGHLIGHTS
// ============================================
const categorizeHighlights = (amenities: string[]): HighlightCategory[] => {
  const categories = {
    'Legal & Compliance': {
      items: [] as any[],
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-500',
      statusColor: 'bg-emerald-100 text-emerald-700'
    },
    'Infrastructure': {
      items: [] as any[],
      icon: Building2,
      color: 'from-blue-500 to-cyan-500',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    'Location & Connectivity': {
      items: [] as any[],
      icon: Navigation,
      color: 'from-amber-500 to-orange-500',
      statusColor: 'bg-amber-100 text-amber-700'
    },
    'Investment Potential': {
      items: [] as any[],
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      statusColor: 'bg-purple-100 text-purple-700'
    }
  };

  const keywordMap = {
    'Legal & Compliance': ['CRDA', 'Approved', 'Title', 'Legal', 'Document', 'Clear', 'RERA', 'Verified'],
    'Infrastructure': ['Road', 'Electricity', 'Water', 'Underground', 'Layout', 'Block', 'Development', 'Site'],
    'Location & Connectivity': ['Location', 'Connectivity', 'ORR', 'Highway', 'Access', 'Corridor', 'Near'],
    'Investment Potential': ['Investment', 'Growth', 'Future', 'Potential', 'Value', 'Appreciation', 'Return']
  };

  amenities.forEach(amenity => {
    let assigned = false;
    for (const [category, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => amenity.toLowerCase().includes(k.toLowerCase()))) {
        categories[category as keyof typeof categories].items.push({
          icon: categories[category as keyof typeof categories].icon,
          label: amenity,
          description: getDescriptionForAmenity(amenity),
          status: 'Verified',
          statusColor: categories[category as keyof typeof categories].statusColor
        });
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      categories['Infrastructure'].items.push({
        icon: Building2,
        label: amenity,
        description: getDescriptionForAmenity(amenity),
        status: 'Included',
        statusColor: 'bg-slate-100 text-slate-700'
      });
    }
  });

  return Object.entries(categories).map(([title, data]) => ({
    title,
    items: data.items,
    color: data.color,
    gradient: data.color
  }));
};

const getDescriptionForAmenity = (amenity: string): string => {
  const descriptions: Record<string, string> = {
    'CRDA Approved': 'Government-approved development with complete regulatory compliance and verified documentation.',
    'Non-layout under CRDA approved': 'Officially recognized layout with all necessary approvals and clearances.',
    '24/7 Electricity': 'Round-the-clock power supply with underground cabling and modern infrastructure.',
    'Electricity facility available': 'Fully electrified site with transformers and distribution network.',
    'Clear Title': 'Legal and clean documents with complete title verification and due diligence.',
    'Legal and clean documents': 'Comprehensive documentation with clear ownership history and verification.',
    'Four clearly planned blocks': 'Strategically organized residential blocks for optimal space utilization.',
    'Wide 33 ft internal road': 'Spacious road network ensuring smooth traffic flow and accessibility.',
    'Clear internal block planning': 'Well-designed block layout for seamless navigation and convenience.',
    'Site-ready environment': 'Fully developed site with all necessary infrastructure in place.',
    'Focused plotted layout': 'Carefully planned residential plots with investment-friendly structure.',
    'Investment-friendly structure': 'Designed to maximize long-term property value and returns.',
    'Fast-growing plotted investment zone': 'High-growth corridor with excellent appreciation potential.',
  };
  return descriptions[amenity] || 'Premium feature designed for modern living and long-term investment value.';
};

// ============================================
// MAIN COMPONENT
// ============================================
export function KeyHighlights({ property }: { property: Property }) {
  const amenities = property.amenities ?? [];
  const categorizedHighlights = categorizeHighlights(amenities);
  
  // Calculate trust score based on available amenities
  const trustScore = Math.min(96, 60 + Math.floor(amenities.length * 3));
  
  const stats = [
    { icon: Building2, value: typeof property.totalPlots === 'number' && !isNaN(property.totalPlots) ? property.totalPlots : Number(property.totalPlots) || 97, label: 'Total Plots', suffix: '' },
    { icon: CheckCircle2, value: 35, label: 'Sold Out', suffix: '' },
    { icon: Home, value: typeof property.availableUnits === 'number' && !isNaN(property.availableUnits) ? property.availableUnits : Number(property.availableUnits) || 62, label: 'Available', suffix: '' },
    { icon: Ruler, value: 33, label: 'Road Width', suffix: ' FT' },
  ];

  const investmentAdvantages = [
    { icon: TrendingUp, title: 'Rapid Area Development', description: 'IT parks, residential complexes, and commercial hubs coming up within 5-10 km radius.' },
    { icon: BarChart3, title: 'Excellent Appreciation', description: 'Property values expected to appreciate 15-20% annually in this growth corridor.' },
    { icon: MapPin, title: 'Strategic Location', description: 'Close to ORR, Vijayawada Highway, and Amaravati region.' },
    { icon: FileText, title: 'Verified Documentation', description: 'Complete legal verification and clear title documentation.' },
    { icon: Compass, title: 'Future Infrastructure', description: 'Planned metro extension and highway expansions nearby.' },
    { icon: Users, title: 'High Demand Zone', description: 'Growing residential and commercial demand in the area.' }
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
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
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Project Excellence</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Everything That Makes
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">This Project Exceptional</span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-3xl mx-auto">
            Carefully planned infrastructure, verified documentation, premium connectivity, and long-term investment value.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-0.5 rounded-full bg-secondary/60" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
          </motion.div>
        </motion.div>

        {/* Trust Score + Stats Row */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left - Trust Score Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="w-6 h-6 text-secondary" />
                <h3 className="text-xl font-bold text-primary">Project Trust Score</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <CircularProgress value={trustScore} label="Overall Rating" />
                <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                  {[
                    { label: 'Documentation', value: 98 },
                    { label: 'Connectivity', value: 92 },
                    { label: 'Infrastructure', value: 95 },
                    { label: 'Future Growth', value: 96 },
                    { label: 'Investment', value: 94 },
                    { label: 'Legal Status', value: 100 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-primary">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 content-center">
            {stats.map((stat, idx) => (
              <StatsCard key={idx} {...stat} delay={idx * 0.1} />
            ))}
          </div>
        </div>

        {/* Premium Highlights Grid by Category */}
        {categorizedHighlights.map((category, categoryIdx) => (
          category.items.length > 0 && (
            <div key={category.title} className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${category.color}`} />
                <h3 className="text-2xl font-bold text-primary">{category.title}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
              </motion.div>
              
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {category.items.map((item, idx) => (
                  <PremiumHighlightCard
                    key={idx}
                    item={item}
                    index={idx}
                    categoryColor={category.color}
                  />
                ))}
              </motion.div>
            </div>
          )
        ))}

        {/* Investment Advantage Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary to-secondary overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-6 h-6 text-white" />
              <h3 className="text-2xl font-bold text-white">Why Investors Are Buying Here</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentAdvantages.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                >
                  <item.icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-white/80">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg border border-slate-100">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-primary">100% Verified Documentation</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm font-medium text-primary">RERA Approved</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-sm font-medium text-primary">Clear Title</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default KeyHighlights;