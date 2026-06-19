import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Phone, MessageCircle } from 'lucide-react';
import type { PropertyMedia } from '@/types/property';
import type { Property } from '@/types/property';

function formatPrice(p: Property['price']) {
  if (p == null || p === '') return null;
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function MasterPlanViewer({
  masterPlans,
  property,
}: {
  masterPlans: PropertyMedia[];
  property: Property;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const mainPlan = masterPlans[0];

  return (
    <section id="master-plan" className="relative bg-[#081120] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-[#c6a43f]/30 bg-[#c6a43f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a43f]">
            Site Details
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">Layout & Specifications</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">Master Plan — {property.title}</p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          >
            {mainPlan ? (
              <div className="relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.3s' }}>
                <img
                  src={mainPlan.url}
                  alt="Master Plan"
                  className="w-full object-contain"
                  style={{ maxHeight: fullscreen ? '100vh' : '600px' }}
                />
              </div>
            ) : (
              <div className="flex h-[500px] items-center justify-center">
                <div className="text-center">
                  <div className="relative mx-auto h-64 w-64 rounded-full border-2 border-dashed border-white/20">
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <div className="absolute inset-8 rounded-full border border-white/5" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/30 text-center">
                      <MapPin className="mx-auto h-8 w-8" />
                      <p className="mt-2 text-xs">Master Plan</p>
                    </div>
                    <span className="absolute -top-2 -right-2 rounded-full bg-[#c6a43f] px-2 py-0.5 text-[10px] font-bold text-[#081120]">N</span>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                className="rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                className="rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>

            <div className="absolute bottom-4 right-4 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/60 backdrop-blur-sm">
              <span className="mr-2 text-[#c6a43f]">⭕</span> Available <span className="mx-2 text-white/30">|</span>{' '}
              <span className="text-red-400">⬤</span> Sold
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl">
              <div className="bg-gradient-to-r from-[#c6a43f]/20 to-[#f0c14b]/10 px-6 py-5">
                <h3 className="font-serif text-xl font-bold text-white">Pricing & Availability</h3>
              </div>
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/50">Price per sq. yard</p>
                  <p className="text-3xl font-bold text-[#f0c14b]">{formatPrice(property.price) ?? '₹4,200'}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Total Plots', value: property.bedrooms ?? 97, color: 'text-white' },
                    { label: 'Available', value: '62', color: 'text-emerald-400' },
                    { label: 'Sold', value: '35', color: 'text-red-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-sm text-white/60">{item.label}</span>
                      <span className={`font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[36%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                </div>
                <p className="text-xs text-white/40">36% Sold Out</p>

                <div className="space-y-3 pt-2">
                  <motion.a
                    href="tel:+917659926345"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c6a43f] to-[#f0c14b] py-3.5 font-semibold text-[#081120]"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </motion.a>
                  <motion.a
                    href="https://wa.me/917659926345?text=Hi%20I%27m%20interested%20in%20this%20property"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 py-3.5 font-semibold text-white backdrop-blur-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MapPin(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
