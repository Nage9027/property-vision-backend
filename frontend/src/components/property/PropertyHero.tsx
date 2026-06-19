import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, MapPin, Share2, Download } from 'lucide-react';
import type { Property, PropertyMedia } from '@/types/property';
import { slideFade, fadeUp } from '@/config/animations';

function formatPrice(p: Property['price']) {
  if (p == null || p === '') return null;
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function PropertyHero({
  property,
  videos,
  images,
}: {
  property: Property;
  videos: PropertyMedia[];
  images: PropertyMedia[];
}) {
  const [currentMedia, setCurrentMedia] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const allMedia = [...videos, ...images];

  const next = useCallback(() => setCurrentMedia((p) => (p + 1) % allMedia.length), [allMedia.length]);
  const prev = useCallback(() => setCurrentMedia((p) => (p - 1 + allMedia.length) % allMedia.length), [allMedia.length]);

  useEffect(() => {
    if (!isPlaying || allMedia.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [isPlaying, allMedia.length, next]);

  if (!allMedia.length) {
    return (
      <section className="relative flex h-[70vh] min-h-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#081120] via-[#0a2540] to-[#0d9488]/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.15),transparent_60%)]" />
        <div className="relative z-10 text-center text-white">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]">
            Featured Project
          </span>
          <h1 className="mt-6 font-serif text-5xl font-bold md:text-7xl">{property.title}</h1>
          <p className="mt-4 text-lg text-white/70">
            {property.city}{property.locality ? ` · ${property.locality}` : ''}
          </p>
        </div>
      </section>
    );
  }

  const current = allMedia[currentMedia];
  const isVideo = current.type === 'video' || current.type.includes('video');

  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-[#081120]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMedia}
          variants={slideFade}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          {isVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            >
              <source src={current.url} />
            </video>
          ) : (
            <img src={current.url} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#081120] via-[#081120]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081120]/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block rounded-full border border-[#c6a43f]/40 bg-[#c6a43f]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0c14b] backdrop-blur-sm">
                Featured Project
              </span>
              <h1 className="mt-4 font-serif text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                {property.title}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-lg text-white/70">
                <MapPin className="h-5 w-5 shrink-0 text-[#c6a43f]" />
                <span>{property.city}{property.locality ? ` · ${property.locality}` : ''}</span>
              </div>

                  {property.price && (
                  <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                  className="mt-4 inline-block rounded-2xl border border-[#c6a43f]/30 bg-gradient-to-r from-[#c6a43f]/20 to-[#f0c14b]/10 px-5 py-2 backdrop-blur-sm"
                >
                  <span className="text-xs uppercase tracking-widest text-[#f0c14b]/80">Starting from</span>
                  <p className="text-2xl font-bold text-white">{formatPrice(property.price)}</p>
                  <p className="text-xs text-white/50">per sq. yard</p>
                </motion.div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {['CRDA Approved', `${property.area ?? 4} Acres`, `${property.bedrooms ?? 97} Units`].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <motion.a
                  href="#master-plan"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] px-6 py-3 font-semibold text-[#081120] shadow-lg shadow-[#c6a43f]/30"
                >
                  View Layout
                </motion.a>
                <motion.a
                  href="#contact-form"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md"
                >
                  Contact Now
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Brochure</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">Quick Stats</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Area', value: `${property.area ?? 4} Acres` },
                    { label: 'Total Units', value: `${property.bedrooms ?? 97}` },
                    { label: 'Sold Out', value: '35' },
                    { label: 'Available', value: '62' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-white/5 p-3">
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="mt-0.5 text-xs text-white/50">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {allMedia.length > 1 && (
        <div className="absolute bottom-4 right-6 z-10 flex items-center gap-2">
          <button
            onClick={prev}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1.5">
            {allMedia.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentMedia(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentMedia ? 'w-8 bg-[#c6a43f]' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
