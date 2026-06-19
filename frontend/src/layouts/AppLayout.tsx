import type { PropsWithChildren } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { StickyMobileCTA } from '@/components/StickyMobileCTA';
import { brandColors } from '@/config/animations';

export function AppLayout({ children }: PropsWithChildren) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left"
        style={{ scaleX, background: `linear-gradient(90deg, ${brandColors.gold}, ${brandColors.emerald}, ${brandColors.gold})` }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
}
