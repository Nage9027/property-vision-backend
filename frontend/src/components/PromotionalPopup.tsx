import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useActiveBanner } from '@/features/banners/hooks/usePromotionalBanner';

const POPUP_COOKIE_KEY = 'pv_popup_closed';
const POPUP_COOKIE_TTL_MS = 24 * 60 * 60 * 1000;

function getPopupCookie(): number | null {
  try {
    const raw = localStorage.getItem(POPUP_COOKIE_KEY);
    if (!raw) return null;
    const ts = parseInt(raw, 10);
    if (isNaN(ts)) return null;
    return ts;
  } catch {
    return null;
  }
}

function setPopupCookie() {
  try {
    localStorage.setItem(POPUP_COOKIE_KEY, String(Date.now()));
  } catch {
    /* noop */
  }
}

function shouldShowPopup(): boolean {
  if (import.meta.env.DEV) return true;
  const ts = getPopupCookie();
  if (!ts) return true;
  return Date.now() - ts > POPUP_COOKIE_TTL_MS;
}

/* ─── Animation variants per type ─── */
const animVariants: Record<string, Record<string, unknown>> = {
  FADE: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  },
  SCALE: {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  SLIDE_UP: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  BLUR: {
    initial: { opacity: 0, filter: 'blur(12px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(8px)' },
    transition: { duration: 0.6 },
  },
};

function getVariants(anim: string) {
  return animVariants[anim] || animVariants.FADE;
}

/* ─── CTA click handler ─── */
function handleBannerCta(banner: {
  ctaUrl?: string | null;
  propertyUrl?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
}) {
  if (banner.propertyUrl) {
    window.location.href = banner.propertyUrl;
  } else if (banner.whatsapp) {
    const num = banner.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/${num}`, '_blank');
  } else if (banner.phone) {
    window.location.href = `tel:${banner.phone}`;
  } else if (banner.ctaUrl) {
    window.open(banner.ctaUrl, '_blank');
  }
}

/* ─── Type-specific renderers ─── */
function CenterModal({ banner, onClose }: { banner: NonNullable<ReturnType<typeof useActiveBanner>['data']>; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10"
      >
        {banner.bannerImage && (
          <img
            src={banner.bannerImage}
            alt="Promotional Banner"
            className="max-h-[90vh] max-w-[95vw] rounded-2xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          />
        )}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
        >
          <X className="h-5 w-5" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function BottomBar({ banner, onClose }: { banner: NonNullable<ReturnType<typeof useActiveBanner>['data']>; onClose: () => void }) {
  const v = getVariants(banner.animationType);
  return (
    <motion.div
      {...(v as object)}
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl"
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {banner.bannerImage && (
            <img src={banner.bannerImage} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          )}
          <div className="min-w-0">
            {banner.title && (
              <p className="truncate text-sm font-semibold text-white">{banner.title}</p>
            )}
            {banner.subtitle && (
              <p className="truncate text-xs text-slate-400">{banner.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {banner.ctaText && (
            <button
              onClick={() => handleBannerCta(banner)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-4 py-2 text-xs font-bold text-[#020617] shadow transition hover:shadow-lg"
            >
              {banner.ctaText}
            </button>
          )}
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function FullscreenPopup({ banner, onClose }: { banner: NonNullable<ReturnType<typeof useActiveBanner>['data']>; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 mx-4 flex w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-2xl shadow-black/60 lg:flex-row"
      >
        <div className="relative flex-1">
          {banner.bannerImage ? (
            <img src={banner.bannerImage} alt="" className="h-full w-full object-cover" />
          ) : banner.bannerVideo ? (
            <video autoPlay muted loop playsInline className="h-full w-full object-cover">
              <source src={banner.bannerVideo} />
            </video>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center bg-gradient-to-br from-emerald-900/20 to-[#020617]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-[#020617]/40 to-transparent" />
        </div>
        <div className="flex w-full max-w-md flex-col justify-center p-8 lg:p-12">
          {banner.offerText && (
            <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
              <Sparkles className="h-3 w-3" />
              {banner.offerText}
            </span>
          )}
          {banner.title && (
            <h2 className="font-serif text-3xl font-bold text-white lg:text-4xl">{banner.title}</h2>
          )}
          {banner.subtitle && (
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{banner.subtitle}</p>
          )}
          {banner.price && (
            <p className="mt-4 text-2xl font-bold text-[#d4a937]">{banner.price}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {banner.ctaText && (
              <button
                onClick={() => handleBannerCta(banner)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-6 py-3 text-sm font-bold text-[#020617] shadow-lg transition hover:shadow-xl"
              >
                {banner.ctaText}
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm text-white/60 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/60 backdrop-blur-sm transition hover:bg-black/70 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

function MobileWhatsapp({ banner, onClose }: { banner: NonNullable<ReturnType<typeof useActiveBanner>['data']>; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      className="fixed bottom-4 right-4 z-[100] max-w-xs sm:bottom-6 sm:right-6"
    >
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 text-white shadow-lg shadow-emerald-500/20 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{banner.title || 'Join Our Community'}</p>
              <p className="mt-0.5 text-xs text-emerald-100/70">
                {banner.subtitle || 'Get exclusive offers'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-100/50 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => handleBannerCta(banner)}
          className="mt-3 w-full rounded-xl bg-white/15 px-4 py-2.5 text-center text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
        >
          {banner.ctaText || 'Chat on WhatsApp'}
        </button>
      </div>
    </motion.div>
  );
}

function SideFloating({ banner, onClose }: { banner: NonNullable<ReturnType<typeof useActiveBanner>['data']>; onClose: () => void }) {
  const v = getVariants(banner.animationType);
  return (
    <motion.div
      {...(v as object)}
      className="fixed right-4 top-1/4 z-[100] w-72 -translate-y-1/4 sm:right-6"
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        {banner.bannerImage && (
          <div className="relative h-32">
            <img src={banner.bannerImage} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent" />
          </div>
        )}
        <div className="p-4">
          {banner.title && (
            <p className="text-sm font-bold text-white">{banner.title}</p>
          )}
          {banner.subtitle && (
            <p className="mt-0.5 text-xs text-slate-400">{banner.subtitle}</p>
          )}
          <div className="mt-3 flex gap-2">
            {banner.ctaText && (
              <button
                onClick={() => handleBannerCta(banner)}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#c6a43f] to-[#d4a937] px-3 py-2 text-xs font-bold text-[#020617] transition hover:shadow-lg"
              >
                {banner.ctaText}
              </button>
            )}
            <button onClick={onClose} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:bg-white/5 hover:text-white/80">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export function PromotionalPopup() {
  const { data: banner } = useActiveBanner();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      try { localStorage.removeItem(POPUP_COOKIE_KEY); } catch {}
    }
  }, []);

  useEffect(() => {
    if (!banner || dismissed) return;
    if (!shouldShowPopup()) return;

    const delay = banner.autoOpen ? (banner.delayMs || 2000) : 0;
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [banner, dismissed]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setDismissed(true);
    setPopupCookie();
  }, []);

  if (!banner || dismissed || !visible) return null;

  switch (banner.popupType) {
    case 'BOTTOM_BAR':
      return <BottomBar banner={banner} onClose={handleClose} />;
    case 'FULLSCREEN':
      return <FullscreenPopup banner={banner} onClose={handleClose} />;
    case 'MOBILE_WHATSAPP':
      return <MobileWhatsapp banner={banner} onClose={handleClose} />;
    case 'SIDE_FLOATING':
      return <SideFloating banner={banner} onClose={handleClose} />;
    case 'CENTER_MODAL':
    default:
      return <CenterModal banner={banner} onClose={handleClose} />;
  }
}
