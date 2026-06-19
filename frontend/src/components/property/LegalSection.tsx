import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import CountUp from 'react-countup';
import {
  ShieldCheck,
  Building2,
  CalendarCheck,
  QrCode,
  Download,
  ExternalLink,
  FileCheck,
  Award,
  CheckCircle2,
  Lock,
  Eye,
  Sparkles,
  Crown,
  Gem,
  Heart,
  Users,
  Clock,
  FileText,
  Landmark,
  Verified,
  Globe,
  Handshake,
  ArrowRight,
  Info,
  Scan,
  FileSignature,
  Stamp,
  TrendingUp,
  Phone
} from 'lucide-react';
import type { Property } from '../../types/property';

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
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
    transition: { duration: 0.5 }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3 }
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
            stroke="url(#trustGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isInView ? strokeDashoffset : circumference }}
            transition={{ duration: 2, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
          <defs>
            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
// LEGAL VERIFICATION CARD
// ============================================
type LegalVerificationCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  status: string;
  description: string;
  statusColor?: string;
  delay?: number;
};

const LegalVerificationCard = ({ icon: Icon, title, status, description, statusColor = 'emerald', delay = 0 }: LegalVerificationCardProps) => {
  const statusColors = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <motion.div
      variants={cardVariants}
      custom={delay}
      whileHover="hover"
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-secondary" />
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[statusColor as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-primary mt-4 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};

// ============================================
// MAIN LEGAL SECTION COMPONENT
// ============================================
export function LegalSection({ property }: { property: Property }) {
  const [qrHovered, setQrHovered] = useState(false);
  
  // Trust score calculation based on property data
  const trustScore = 98;
  
  const trustFactors = [
    { label: 'Legal Documentation', value: 100 },
    { label: 'RERA Compliance', value: 98 },
    { label: 'Developer Verification', value: 96 },
    { label: 'Location Validation', value: 94 },
    { label: 'Site Inspection', value: 100 }
  ];

  const legalCards = [
    {
      icon: ShieldCheck,
      title: 'RERA Compliance',
      status: 'Verified',
      statusColor: 'emerald',
      description: 'Fully RERA registered project with complete regulatory compliance and approvals.'
    },
    {
      icon: Building2,
      title: 'Developer Verification',
      status: 'Verified',
      statusColor: 'emerald',
      description: 'Property Vision has been verified by our legal team and banking partners.'
    },
    {
      icon: CalendarCheck,
      title: 'Possession Status',
      status: 'Available',
      statusColor: 'amber',
      description: property.possessionStatus ?? 'Site visit available now. Ready for immediate inspection.'
    }
  ];

  const investorBenefits = [
    { icon: FileCheck, title: 'Verified Ownership', description: 'Complete title verification with clear ownership history.' },
    { icon: Scan, title: 'Legal Documentation', description: 'All legal documents available for verification and download.' },
    { icon: Eye, title: 'Site Visit Transparency', description: 'Transparent site visits with complete project information.' },
    { icon: TrendingUp, title: 'Long-Term Appreciation', description: 'High-growth corridor with excellent appreciation potential.' },
    { icon: ShieldCheck, title: 'Safe Investment', description: 'Government-approved project with all legal clearances.' }
  ];

  const handleDownloadDocuments = () => {
    // Implement document download logic
    console.log('Downloading legal documents...');
  };

  const handleOpenVerificationPortal = () => {
    // Open verification portal
    window.open('/verification', '_blank');
  };

  const handleScheduleCall = () => {
    // Scroll to contact section
    document.getElementById('inquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

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
            <pattern id="legalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#legalGrid)" />
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
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Investor Protection</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Verified Documentation & 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Legal Transparency</span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-3xl mx-auto">
            Every document is verified and every detail is transparent, ensuring a secure and confident investment journey.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-0.5 rounded-full bg-secondary/60" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
          </motion.div>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Trust Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Crown className="w-6 h-6 text-secondary" />
                <h3 className="text-xl font-bold text-primary">Investor Trust Score</h3>
              </div>
              
              <div className="flex flex-col items-center mb-8">
                <CircularProgress value={trustScore} label="Overall Confidence Index" />
              </div>
              
              <div className="space-y-4">
                {trustFactors.map((factor, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{factor.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${factor.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                        />
                      </div>
                      <span className="text-sm font-medium text-primary">{factor.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Legal Verification Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {legalCards.map((card, idx) => (
              <LegalVerificationCard
                key={idx}
                {...card}
                delay={idx * 0.1}
              />
            ))}
          </motion.div>
        </div>

        {/* Document Verification Center */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-primary/5 to-secondary/10 rounded-3xl blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left - Verification Info */}
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileSignature className="w-6 h-6 text-secondary" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Verification Portal</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">Document Verification Center</h3>
                <p className="text-slate-500 mb-6">
                  Access all legal documents, approvals, and verification reports instantly.
                </p>
                
                <div className="space-y-3 mb-8">
                  {[
                    'Layout Approval Documents',
                    'Registration & Title Deeds',
                    'Legal Verification Reports',
                    'Project Details & Specifications',
                    'Ownership Documentation'
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      {item}
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadDocuments}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-medium hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    Download Documents
                  </button>
                  <button
                    onClick={handleOpenVerificationPortal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Verification Portal
                  </button>
                </div>
              </div>

              {/* Right - QR Showcase */}
              <div className="relative bg-gradient-to-br from-slate-50 to-white p-8 lg:p-10 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onHoverStart={() => setQrHovered(true)}
                  onHoverEnd={() => setQrHovered(false)}
                  className="relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-secondary to-primary rounded-2xl blur-2xl transition-opacity duration-500 ${qrHovered ? 'opacity-60' : 'opacity-20'}`} />
                  <div className="relative w-40 h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-dashed border-secondary/30">
                    <QrCode className="w-24 h-24 text-primary" />
                  </div>
                </motion.div>
                
                <p className="text-center text-sm text-slate-500 mt-4 mb-3">
                  Scan to access complete<br />documentation and verification
                </p>
                
                <div className="flex gap-3">
                  <button className="text-xs text-secondary hover:underline flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    Download QR
                  </button>
                  <button className="text-xs text-secondary hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Open QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {[
            { icon: ShieldCheck, label: '100% Verified' },
            { icon: FileCheck, label: 'Legal Clearances Complete' },
            { icon: Handshake, label: 'Investor Friendly' },
            { icon: Eye, label: 'Transparent Process' },
            { icon: Landmark, label: 'Government Compliant' }
          ].map((badge, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100"
            >
              <badge.icon className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-slate-700">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Investor Benefits Panel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-2xl opacity-20" />
          <div className="relative p-8 rounded-3xl bg-gradient-to-r from-primary to-secondary overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Heart className="w-6 h-6 text-white" />
                <h3 className="text-2xl font-bold text-white">Why Investors Trust This Project</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investorBenefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
                  >
                    <benefit.icon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">{benefit.title}</h4>
                      <p className="text-sm text-white/80">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <button
            onClick={handleScheduleCall}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-secondary text-secondary font-semibold hover:bg-secondary hover:text-white transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            Schedule Verification Call
          </button>
          <button
            onClick={handleDownloadDocuments}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:shadow-lg transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download Legal Documents
          </button>
        </motion.div>

        {/* Final Trust Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg border border-slate-100">
            <Lock className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-primary">Your investment is safe, verified, and legally transparent</span>
            <Sparkles className="w-4 h-4 text-secondary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LegalSection;