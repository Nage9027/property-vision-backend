import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'location', label: 'Location' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'intelligence', label: 'Analytics' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'contact', label: 'Contact' },
] as const;

export function PropertyStickyNav() {
  const [activeSection, setActiveSection] = useState('overview');
  const [showNav, setShowNav] = useState(false);
  const [linePos, setLinePos] = useState({ left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLElement>>(new Map());

  /* ── Show nav only after hero is scrolled past ── */
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector('section');
      if (!hero) return;
      setShowNav(window.scrollY > hero.offsetHeight - 100);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── IntersectionObserver with 40% threshold ── */
  useEffect(() => {
    const elements = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (!visible.length) return;

        const best = visible.reduce((a, b) =>
          a.intersectionRatio > b.intersectionRatio ? a : b
        );
        setActiveSection(best.target.id);
      },
      { threshold: 0.4 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Update gold line position ── */
  useEffect(() => {
    const btn = btnRefs.current.get(activeSection);
    const container = containerRef.current;
    if (!btn || !container) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setLinePos({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [activeSection]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const setBtnRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) btnRefs.current.set(id, el);
    else btnRefs.current.delete(id);
  }, []);

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={showNav ? { y: 0 } : { y: 100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#071B35] shadow-2xl shadow-black/30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Centered Nav Items */}
        <div className="flex flex-1 justify-center overflow-hidden">
          <div
            ref={containerRef}
            className="relative flex items-center gap-1 overflow-x-auto scrollbar-hide lg:gap-6 xl:gap-10"
          >
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                ref={(el) => setBtnRef(section.id, el)}
                onClick={() => scrollTo(section.id)}
                className={`relative shrink-0 whitespace-nowrap px-2 py-4 text-[11px] font-medium uppercase tracking-wider transition-colors duration-200 lg:px-0 lg:text-xs ${
                  activeSection === section.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                {section.label}
              </button>
            ))}
            {/* Gold Active Line */}
            <motion.div
              className="absolute bottom-0 h-[3px] rounded-full bg-[#F5C84C]"
              animate={{ left: linePos.left, width: linePos.width }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            />
          </div>
        </div>

        {/* Enquire Now */}
        <button
          onClick={() => scrollTo('contact')}
          className="shrink-0 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/35 lg:px-6"
        >
          Enquire Now
        </button>
      </div>
    </motion.nav>
  );
}
