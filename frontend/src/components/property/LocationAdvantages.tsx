import { motion } from 'framer-motion';
import { MapPin, Car, Plane, Building2 as BuildingIcon, Route, Navigation } from 'lucide-react';

const LOCATION_DATA = [
  { place: 'Vijayawada Highway', distance: '2 km', icon: Route },
  { place: 'ORR Exit', distance: '3 km', icon: Navigation },
  { place: 'Amaravati', distance: '25 km', icon: BuildingIcon },
  { place: 'Guntur', distance: '35 km', icon: BuildingIcon },
  { place: 'Vijayawada Airport', distance: '25 km', icon: Plane },
  { place: 'Financial District', distance: '15 km', icon: Car },
];

export function LocationAdvantages() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white px-6 py-20 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_70%_30%,rgba(13,148,136,0.06),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="inline-block rounded-full bg-[#c6a43f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a43f]">
            Connectivity
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[#0a2540] md:text-4xl">Location Advantages</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            Strategically located with excellent connectivity to major landmarks.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATION_DATA.map((loc, i) => {
            const Icon = loc.icon;
            return (
              <motion.div
                key={loc.place}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-[#0d9488]/5 blur-2xl transition duration-500 group-hover:bg-[#0d9488]/10" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0d9488]/10 to-[#0a2540]/10 transition duration-300 group-hover:from-[#0d9488]/20 group-hover:to-[#0a2540]/20">
                    <Icon className="h-6 w-6 text-[#0d9488]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#0a2540]">{loc.place}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{loc.distance} away</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-[#0d9488]/10 px-3 py-1 text-xs font-semibold text-[#0d9488]">
                    {loc.distance}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl border border-[#c6a43f]/20 bg-gradient-to-r from-[#c6a43f]/10 to-amber-50/50 p-6 text-center"
        >
          <p className="text-sm text-[#8a6d1f]">
            <span className="font-semibold">Investment Opportunity:</span> This area is seeing rapid development with new IT parks, residential complexes, and commercial hubs coming up within 5-10 km radius.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
