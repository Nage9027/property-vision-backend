import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, ShieldCheck } from 'lucide-react';

export function SiteVisitForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) errs.phone = 'Enter valid 10-digit number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const fieldClasses = (key: string) =>
    `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 ${
      errors[key]
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-slate-200 bg-white focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/10'
    }`;

  return (
    <section id="contact-form" className="relative bg-white px-6 py-20 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(13,148,136,0.04),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28"
          >
            <span className="inline-block rounded-full bg-[#c6a43f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6a43f]">
              Schedule a Visit
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold text-[#0a2540] md:text-4xl">
              Interested in this property?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Book a site visit or get a call back from our team. We'll help you find the perfect investment.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                <span>We respect your privacy. Your information is secure with us.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-500" />
                <span>No spam. Only relevant property updates.</span>
              </div>
            </div>

            <motion.a
              href="https://wa.me/917659926345?text=Hi%20I%27m%20interested%20in%20this%20property.%20Please%20share%20more%20details."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-3 font-semibold text-white shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl border border-emerald-100 bg-gradient-to-b from-emerald-50 to-white p-10 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                  <Send className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#0a2540]">Request Submitted!</h3>
                <p className="mt-2 text-gray-500">
                  Our team will contact you within 2 hours. Thank you for your interest!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className={fieldClasses('name')}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className={fieldClasses('email')}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">+91</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        className={`${fieldClasses('phone')} pl-12`}
                        placeholder="9876543210"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Preferred Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      className={fieldClasses('date')}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      className={fieldClasses('message')}
                      rows={3}
                      placeholder="Any specific questions?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#0a2540] to-[#0d9488] py-3.5 font-semibold text-white shadow-lg shadow-[#0d9488]/20 transition hover:shadow-xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Request Site Visit
                    </span>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
