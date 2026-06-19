import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useDragControls } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, Autoplay, EffectFade } from 'swiper/modules';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Camera,
  Video,
  Sparkles,
  Eye,
  MapPin,
  Building2,
  Ruler,
  Navigation as NavIcon,
  Heart,
  Share2,
  Download,
  Info
} from 'lucide-react';
import CountUp from 'react-countup';
import type { PropertyMedia } from '../../types/property';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// ============================================
// TYPES
// ============================================
interface GalleryImage extends Omit<PropertyMedia, 'type'> {
  caption?: string;
  type: 'image' | 'video';
}

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.4, ease: "easeOut" }
};

// ============================================
// PREMIUM STATS CARD
// ============================================
type StatsCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  suffix?: string;
};
const StatsCard = ({ icon: Icon, value, label, suffix = '' }: StatsCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
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
// PREMIUM GALLERY CARD
// ============================================
const GalleryCard = ({ image, index, onClick }: { image: GalleryImage; index: number; onClick: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isVideo = image.type === 'video';

  return (
    <motion.button
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover="hover"
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
        )}
        {isVideo ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Play className="w-12 h-12 text-white/60" />
          </div>
        ) : (
          <img
            src={image.url}
            alt={image.caption || `Gallery ${index + 1}`}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isVideo ? <Video className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
          {isVideo ? 'Video Tour' : 'View Image'}
        </div>
        
        {/* Caption */}
        {image.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-white text-sm font-medium">{image.caption}</p>
          </div>
        )}
        
        {/* Zoom Icon */}
        <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
          <Maximize2 className="w-4 h-4 text-white" />
        </div>
      </div>
    </motion.button>
  );
};

// ============================================
// FEATURED IMAGE COMPONENT
// ============================================
const FeaturedImage = ({ image, onClick }: { image: GalleryImage; onClick: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      whileHover="hover"
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl shadow-2xl focus:outline-none"
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
        )}
        <img
          src={image.url}
          alt={image.caption || 'Featured property image'}
          className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Premium Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-white mb-2">Lucky Garden Edara</h3>
            <p className="text-white/80 text-sm">Premium Plotted Development</p>
          </div>
        </div>
        
        {/* View Badge */}
        <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-4 h-4" />
          View Full Gallery
        </div>
      </div>
    </motion.button>
  );
};

// ============================================
// PREMIUM LIGHTBOX COMPONENT
// ============================================
const PremiumLightbox = ({ images, initialIndex, onClose }: { images: GalleryImage[]; initialIndex: number; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const swiperRef = useRef<any>(null);
  
  const currentImage = images[currentIndex];
  const isVideo = currentImage?.type === 'video';
  
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    if (swiperRef.current) swiperRef.current.slideNext();
  }, [images.length]);
  
  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    if (swiperRef.current) swiperRef.current.slidePrev();
  }, [images.length]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-white/60 text-sm">Lucky Garden Edara</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
            <span className="text-white/80 text-sm">
              {currentIndex + 1} <span className="text-white/40">/ {images.length}</span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
          >
            <Info className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Main Image */}
      <div className="flex items-center justify-center h-full" onClick={(e) => e.stopPropagation()}>
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-h-[85vh] max-w-[90vw]"
        >
          {isVideo ? (
            <video
              autoPlay
              controls
              className="max-h-[85vh] max-w-[90vw] rounded-2xl"
              src={currentImage.url}
            />
          ) : (
            <img
              src={currentImage.url}
              alt={currentImage.caption || ''}
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          )}
          
          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && currentImage.caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10"
              >
                <p className="text-white text-sm">{currentImage.caption}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`relative w-16 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                  idx === currentIndex ? 'ring-2 ring-secondary scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                {img.type === 'video' ? (
                  <div className="w-full h-full bg-black/50 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Counter */}
      <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-medium">
        {currentIndex + 1} / {images.length}
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN IMAGE GALLERY COMPONENT
// ============================================
export function ImageGallery({ images, propertyName = 'Lucky Garden Edara' }: { images: GalleryImage[]; propertyName?: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  if (!images.length) return null;
  
  const featuredImage = images[0];
  const supportingImages = images.slice(1, 7);
  
  // Stats for the gallery section
  const stats = [
    { icon: Building2, value: 125, label: 'Premium Plots', suffix: '+' },
    { icon: Ruler, value: 33, label: 'Feet Roads', suffix: ' FT' },
    { icon: NavIcon, value: 2, label: 'KM to ORR', suffix: ' KM' },
    { icon: MapPin, value: 97, label: 'Total Units', suffix: '' }
  ];
  
  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-secondary" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">Project Gallery</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-secondary" />
          </motion.div>
          
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
            Explore{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
              {propertyName}
            </span>
          </motion.h2>
          
          <motion.p variants={fadeUp} className="text-lg text-slate-600 max-w-3xl mx-auto">
            Take a closer look at the project layout, infrastructure, development progress, and investment potential.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex justify-center gap-2 mt-6">
            <div className="w-12 h-0.5 rounded-full bg-secondary/60" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
            <div className="w-3 h-0.5 rounded-full bg-secondary/30" />
          </motion.div>
        </motion.div>
        
        {/* Premium Gallery Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {/* Featured Image - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <FeaturedImage image={featuredImage} onClick={() => setSelectedIndex(0)} />
          </div>
          
          {/* Supporting Images Grid */}
          <div className="grid grid-cols-2 gap-3">
            {supportingImages.slice(0, 4).map((image, idx) => (
              <GalleryCard
                key={idx}
                image={image}
                index={idx}
                onClick={() => setSelectedIndex(idx + 1)}
              />
            ))}
          </div>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <StatsCard key={idx} {...stat} />
          ))}
        </div>
        
        {/* View All Gallery Button */}
        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedIndex(0)}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            View Full Gallery
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
      
      {/* Premium Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <PremiumLightbox
            images={images}
            initialIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default ImageGallery;