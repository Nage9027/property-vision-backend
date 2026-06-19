import type { Variants, Transition, Easing } from 'framer-motion';

export const easeOut: Easing = [0.25, 0.1, 0.25, 1];
export const easeInOut: Easing = [0.45, 0, 0.55, 1];
export const easeSpring: Transition = { type: 'spring', stiffness: 200, damping: 20 };

export const brandColors = {
  navy: '#0A2540',
  emerald: '#0D9488',
  gold: '#C6A43F',
  goldLight: '#f0c14b',
  white: '#FFFFFF',
  bgLight: '#F8FAFC',
} as const;

export const transitions = {
  smooth: { duration: 0.6, ease: easeOut },
  slow: { duration: 0.8, ease: easeOut },
  fast: { duration: 0.3, ease: easeOut },
  spring: easeSpring,
} as const;

export const pageLoadVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOut },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export const scaleInBounce: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};


export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const cardHover = {
  y: -8,
  scale: 1.02,
  borderColor: '#C6A43F',
  boxShadow: '0 20px 40px -12px rgba(198,164,63,0.25)',
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const cardHoverLift = {
  y: -12,
  scale: 1.03,
  boxShadow: '0 20px 40px -12px rgba(0,0,0,0.2)',
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const imageZoom = {
  initial: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const imageZoomSubtle = {
  initial: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export const pricePulse = {
  animate: {
    textShadow: [
      '0 0 0px rgba(198,164,63,0)',
      '0 0 8px rgba(198,164,63,0.6)',
      '0 0 0px rgba(198,164,63,0)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: { repeat: Infinity, duration: 6, ease: 'easeInOut' as const },
  },
};

export const floatSlow = {
  animate: {
    y: [0, -12, 0],
    transition: { repeat: Infinity, duration: 8, ease: 'easeInOut' as const },
  },
};

export const backgroundZoom: Variants = {
  animate: {
    scale: [1, 1.08],
    transition: {
      duration: 20,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'linear' as const,
    },
  },
};

export const buttonHover = {
  scale: 1.05,
  boxShadow: '0 0 20px rgba(13,148,136,0.4)',
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export const buttonTap = { scale: 0.97 };

export const navLogo: Variants = {
  hidden: { scale: 0.8, rotate: -5, opacity: 0 },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

export const navItem = (i: number): Variants => ({
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: easeOut },
  },
});

export const splitTextReveal = (i: number): Variants => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: easeOut },
  },
});

export const accordionContent: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export const iconRotate = {
  closed: { rotate: 0 },
  open: { rotate: 45 },
};

export const mapPulse = {
  animate: {
    scale: [1, 1.03, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const progressBar = {
  hidden: { width: 0 },
  visible: (width: string) => ({
    width,
    transition: { duration: 1.5, ease: 'easeOut' as const, delay: 0.3 },
  }),
};

export const masterPlanReveal: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: easeOut },
  },
};

export const testimonialCard: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export const slideFade = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.8, ease: easeInOut },
};

export const goldenGradient = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 10, repeat: Infinity, ease: 'linear' as const },
  },
};

export const buttonPulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const stickyCTA = {
  initial: { y: 100 },
  animate: {
    y: 0,
    transition: { duration: 0.5, delay: 1.5, ease: easeOut },
  },
};

export const locationCard = (i: number): Variants => ({
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
  },
});

export const scrollIndicator = {
  animate: {
    y: [0, 6, 0],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

export const shimmer = {
  animate: {
    x: ['-100%', '100%'],
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' as const },
  },
};

export const counterAnimation: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 2, ease: 'easeOut' as const },
  },
};

export const heroBadge: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.2, duration: 0.5, ease: easeOut },
  },
};

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.8, ease: easeOut },
  },
};

export const heroDescription: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.6 },
  },
};

export const heroCta: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.7, duration: 0.5, ease: easeOut },
  },
};

export const heroMedia: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.9, duration: 0.7, ease: easeOut },
  },
};

export const heroStats: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.1, duration: 0.5, ease: easeOut },
  },
};

export const splitRevealLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.2, ease: easeOut },
  },
};

export const splitRevealRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.4, ease: easeOut },
  },
};

export const cityCard: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
};

export const cityHover = {
  scale: 1.05,
  boxShadow: '0 0 25px rgba(13,148,136,0.3)',
  transition: { duration: 0.3 },
};

export const amenityHover = {
  y: -5,
  borderColor: '#C6A43F',
  boxShadow: '0 10px 30px -8px rgba(0,0,0,0.1)',
  transition: { duration: 0.3 },
};

export const iconBounce: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4, ease: easeOut },
};

export const lineGrow: Variants = {
  hidden: { scaleX: 0, transformOrigin: 'left' },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: easeOut, delay: 0.2 },
  },
};
