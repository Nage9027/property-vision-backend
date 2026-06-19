import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Property } from '@/types/property';

function formatPrice(p: Property['price']) {
  if (p == null || p === '') return 'Price on request';
  const n = typeof p === 'string' ? parseFloat(p) : Number(p);
  if (Number.isNaN(n)) return String(p);
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function SimilarProperties({ properties, currentId }: { properties: Property[]; currentId: string }) {
  const similar = properties.filter((p) => p.id !== currentId).slice(0, 3);
  if (!similar.length) return null;

  return (
    <section className="bg-[#f8fafc] px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl font-bold text-[#0a2540] md:text-4xl">Similar Properties</h2>
          <p className="mt-3 text-gray-500">Explore more investment opportunities.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((property, i) => {
            const thumb = property.media?.find((m) => m.type === 'image')?.url ?? property.media?.[0]?.url;
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/properties/${property.slug ?? property.id}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#0d9488]/5"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={property.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0a2540]/5 to-[#0d9488]/10">
                        <span className="text-sm text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[#0a2540] transition-colors group-hover:text-[#0d9488]">
                      {property.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {property.city}{property.locality ? ` · ${property.locality}` : ''}
                    </div>
                    <p className="mt-3 font-semibold text-[#c6a43f]">{formatPrice(property.price)}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
